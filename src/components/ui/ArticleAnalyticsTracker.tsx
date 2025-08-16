'use client';

import { useEffect } from 'react';
import { useArticleAnalytics } from '@/hooks/useArticleAnalytics';

interface ArticleAnalyticsTrackerProps {
  slug: string;
  title: string;
}

export default function ArticleAnalyticsTracker({ slug, title }: ArticleAnalyticsTrackerProps) {
  const { trackView } = useArticleAnalytics();

  useEffect(() => {
    // Track the article view when component mounts
    trackView(slug, title);
  }, [slug, title, trackView]);

  // This component renders nothing, it's just for tracking
  return null;
}
