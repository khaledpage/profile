import { useState, useEffect, useCallback } from 'react';

export interface ArticleAnalytics {
  slug: string;
  views: number;
  totalReadingTime: number;
  averageScrollDepth: number;
  lastViewed: Date;
  sessions: AnalyticsSession[];
}

export interface AnalyticsSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  scrollDepth: number;
  readingTime: number;
  device: 'mobile' | 'tablet' | 'desktop';
  referrer?: string;
}

export interface AnalyticsMetrics {
  totalViews: number;
  uniqueVisitors: number;
  averageReadingTime: number;
  topArticles: Array<{
    slug: string;
    title: string;
    views: number;
    readingTime: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  weeklyViews: Array<{
    date: string;
    views: number;
  }>;
}

class AnalyticsService {
  private readonly storageKey = 'portfolio_analytics';
  private currentSession: AnalyticsSession | null = null;
  private scrollObserver: IntersectionObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupScrollTracking();
    }
  }

  private initializeSession(): void {
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      scrollDepth: 0,
      readingTime: 0,
      device: this.detectDevice(),
      referrer: document.referrer || undefined,
    };
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private detectDevice(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private setupScrollTracking(): void {
    let maxScrollDepth = 0;
    let readingStartTime = Date.now();

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
      
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
      
      if (this.currentSession) {
        this.currentSession.scrollDepth = maxScrollDepth;
        this.currentSession.readingTime = Date.now() - readingStartTime;
      }
    };

    // Throttled scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateScrollDepth, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track reading time when user is actively reading
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window
      } else {
        // User returned to the page
        readingStartTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up on page unload
    const handleBeforeUnload = () => {
      this.endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  public trackArticleView(slug: string, title?: string): void {
    const analytics = this.getStoredAnalytics();
    const existing = analytics.find(a => a.slug === slug);

    if (existing) {
      existing.views += 1;
      existing.lastViewed = new Date();
      if (this.currentSession) {
        existing.sessions.push({ ...this.currentSession });
      }
    } else {
      const newAnalytics: ArticleAnalytics = {
        slug,
        views: 1,
        totalReadingTime: 0,
        averageScrollDepth: 0,
        lastViewed: new Date(),
        sessions: this.currentSession ? [{ ...this.currentSession }] : [],
      };
      analytics.push(newAnalytics);
    }

    this.storeAnalytics(analytics);
  }

  public endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date();
    // Session data is already stored in trackArticleView
    this.currentSession = null;
  }

  public getArticleAnalytics(slug: string): ArticleAnalytics | null {
    const analytics = this.getStoredAnalytics();
    return analytics.find(a => a.slug === slug) || null;
  }

  public getAllAnalytics(): ArticleAnalytics[] {
    return this.getStoredAnalytics();
  }

  public getAnalyticsMetrics(): AnalyticsMetrics {
    const analytics = this.getStoredAnalytics();
    
    const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
    const allSessions = analytics.flatMap(a => a.sessions);
    const uniqueVisitors = new Set(allSessions.map(s => s.sessionId)).size;
    
    const totalReadingTime = allSessions.reduce((sum, s) => sum + s.readingTime, 0);
    const averageReadingTime = allSessions.length > 0 ? totalReadingTime / allSessions.length : 0;

    const topArticles = analytics
      .map(a => ({
        slug: a.slug,
        title: a.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        views: a.views,
        readingTime: a.sessions.reduce((sum, s) => sum + s.readingTime, 0) / a.sessions.length || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const deviceBreakdown = allSessions.reduce(
      (acc, session) => {
        acc[session.device]++;
        return acc;
      },
      { mobile: 0, tablet: 0, desktop: 0 }
    );

    // Generate weekly views for the last 7 days
    const weeklyViews = this.generateWeeklyViews(analytics);

    return {
      totalViews,
      uniqueVisitors,
      averageReadingTime,
      topArticles,
      deviceBreakdown,
      weeklyViews,
    };
  }

  private generateWeeklyViews(analytics: ArticleAnalytics[]): Array<{ date: string; views: number }> {
    const today = new Date();
    const weeklyData: Array<{ date: string; views: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const viewsForDay = analytics.reduce((sum, article) => {
        const dayViews = article.sessions.filter(session => {
          const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
          return sessionDate === dateStr;
        }).length;
        return sum + dayViews;
      }, 0);

      weeklyData.push({
        date: dateStr,
        views: viewsForDay,
      });
    }

    return weeklyData;
  }

  public clearAnalytics(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  private getStoredAnalytics(): ArticleAnalytics[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((analytics: ArticleAnalytics) => ({
        ...analytics,
        lastViewed: new Date(analytics.lastViewed),
        sessions: analytics.sessions.map((session: AnalyticsSession) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        })),
      }));
    } catch (error) {
      console.error('Error loading analytics from localStorage:', error);
      return [];
    }
  }

  private storeAnalytics(analytics: ArticleAnalytics[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error storing analytics to localStorage:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();

export function useArticleAnalytics(slug?: string) {
  const [analytics, setAnalytics] = useState<ArticleAnalytics | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const trackView = useCallback((articleSlug: string, articleTitle?: string) => {
    analyticsService.trackArticleView(articleSlug, articleTitle || articleSlug);
    
    if (slug === articleSlug) {
      const updated = analyticsService.getArticleAnalytics(articleSlug);
      setAnalytics(updated);
    }
  }, [slug]);

  const refreshMetrics = useCallback(() => {
    setIsLoading(true);
    const allMetrics = analyticsService.getAnalyticsMetrics();
    setMetrics(allMetrics);
    setIsLoading(false);
  }, []);

  const refreshAnalytics = useCallback(() => {
    if (slug) {
      setIsLoading(true);
      const articleAnalytics = analyticsService.getArticleAnalytics(slug);
      setAnalytics(articleAnalytics);
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      refreshAnalytics();
    } else {
      refreshMetrics();
    }
  }, [slug, refreshAnalytics, refreshMetrics]);

  const clearAnalytics = useCallback(() => {
    analyticsService.clearAnalytics();
    setAnalytics(null);
    setMetrics(null);
    refreshMetrics();
  }, [refreshMetrics]);

  return {
    analytics,
    metrics,
    isLoading,
    trackView,
    refreshMetrics,
    refreshAnalytics,
    clearAnalytics,
  };
}
