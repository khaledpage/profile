'use client';

import { useArticleAnalytics } from '@/hooks/useArticleAnalytics';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

export default function AnalyticsDashboard({ config }: Props) {
  const { translations } = useLanguage(config);
  const { metrics, isLoading, clearAnalytics } = useArticleAnalytics();

  if (isLoading) {
    return (
      <div id="analytics-dashboard-loading" className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-1"></div>
        <span className="ml-3 text-foreground">
          {translations?.analytics?.loading || 'Loading analytics...'}
        </span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div id="analytics-dashboard-empty" className="text-center p-8">
        <p className="text-muted mb-4">
          {translations?.analytics?.noData || 'No analytics data available yet.'}
        </p>
        <p className="text-sm text-muted">
          {translations?.analytics?.startTracking || 'Analytics will appear as visitors read your articles.'}
        </p>
      </div>
    );
  }

  const formatReadingTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div id="analytics-dashboard" className="space-y-6">
      {/* Header */}
      <div id="analytics-header" className="flex items-center justify-between">
        <div>
          <h2 id="analytics-title" className="text-2xl font-bold text-foreground">
            {translations?.analytics?.title || 'Analytics Dashboard'}
          </h2>
          <p id="analytics-subtitle" className="text-muted mt-1">
            {translations?.analytics?.subtitle || 'Track your content performance and engagement'}
          </p>
        </div>
        <button
          id="clear-analytics-button"
          onClick={clearAnalytics}
          className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          title={translations?.analytics?.clearData || 'Clear analytics data'}
        >
          {translations?.analytics?.clearButton || 'Clear Data'}
        </button>
      </div>

      {/* Overview Stats */}
      <div id="analytics-overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="total-views-stat" className="glass p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted">
                {translations?.analytics?.totalViews || 'Total Views'}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(metrics.totalViews)}
              </p>
            </div>
          </div>
        </div>

        <div id="unique-visitors-stat" className="glass p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted">
                {translations?.analytics?.uniqueVisitors || 'Unique Visitors'}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(metrics.uniqueVisitors)}
              </p>
            </div>
          </div>
        </div>

        <div id="avg-reading-time-stat" className="glass p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted">
                {translations?.analytics?.avgReadingTime || 'Avg. Reading Time'}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatReadingTime(metrics.averageReadingTime)}
              </p>
            </div>
          </div>
        </div>

        <div id="total-articles-stat" className="glass p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted">
                {translations?.analytics?.trackedArticles || 'Tracked Articles'}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {metrics.topArticles.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Views Chart */}
      <div id="weekly-views-chart" className="glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {translations?.analytics?.weeklyViews || 'Weekly Views'}
        </h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {metrics.weeklyViews.map((day, index) => {
            const maxViews = Math.max(...metrics.weeklyViews.map(d => d.views));
            const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
            const date = new Date(day.date);
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  id={`weekly-bar-${index}`}
                  className="w-full bg-accent-1 rounded-t-sm transition-all duration-300 hover:bg-accent-2"
                  style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '2px' }}
                  title={`${day.views} views on ${date.toLocaleDateString()}`}
                />
                <div className="mt-2 text-xs text-muted text-center">
                  <div>{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                  <div className="font-semibold">{day.views}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <div id="top-articles-section" className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {translations?.analytics?.topArticles || 'Top Articles'}
          </h3>
          <div className="space-y-3">
            {metrics.topArticles.slice(0, 5).map((article, index) => (
              <div key={article.slug} id={`top-article-${index}`} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground truncate">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted">
                    {formatReadingTime(article.readingTime)} avg. reading time
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-foreground">
                    {article.views}
                  </div>
                  <div className="text-xs text-muted">views</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div id="device-breakdown-section" className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {translations?.analytics?.deviceBreakdown || 'Device Breakdown'}
          </h3>
          <div className="space-y-4">
            {Object.entries(metrics.deviceBreakdown).map(([device, count]) => {
              const total = Object.values(metrics.deviceBreakdown).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              
              const deviceIcon = {
                mobile: '📱',
                tablet: '📟', 
                desktop: '🖥️'
              }[device] || '📱';

              const deviceName = device.charAt(0).toUpperCase() + device.slice(1);

              return (
                <div key={device} id={`device-${device}-stat`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{deviceIcon}</span>
                    <span className="text-foreground">{deviceName}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-card rounded-full h-2 mr-3">
                      <div
                        className="bg-accent-1 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
