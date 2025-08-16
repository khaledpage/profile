'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/utils/i18n';
import { isAdminEnabled } from '@/utils/admin';
import { useArticles } from '@/hooks/useArticles';
import { SiteConfig } from '@/types/content';
import { Article } from '@/types/article';
import AnalyticsDashboard from '@/components/ui/AnalyticsDashboard';

export default function AdminDashboard() {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | undefined>(undefined);
  const { translations } = useLanguage(config);

  useEffect(() => {
    // Load the config from the API
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => {
        console.error('Failed to load config:', err);
      });
  }, []);
  const { articles, loading } = useArticles();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if admin mode is enabled
    if (config) {
      const adminEnabled = isAdminEnabled(config);
      setIsAdmin(adminEnabled);
      
      if (!adminEnabled) {
        router.push('/login');
      }
    }
  }, [config, router]);

  if (loading || !config) {
    return (
      <div id="admin-dashboard-loading" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div id="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p style={{ color: 'var(--muted)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div id="admin-access-denied" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Access Denied
          </h1>
          <p style={{ color: 'var(--muted)' }} className="mb-4">
            Admin access required to view this page.
          </p>
          <button
            id="go-to-login-button"
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: 'var(--accent-1)',
              color: 'white'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalArticles = articles.length;
  const featuredArticles = articles.filter(article => article.metadata.featured).length;
  const categories = [...new Set(articles.map(article => article.metadata.category))].length;
  const totalTags = [...new Set(articles.flatMap(article => article.metadata.tags))].length;

  return (
    <div id="admin-dashboard" className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header id="admin-header" className="border-b" style={{ borderColor: 'var(--card)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 id="admin-dashboard-title" className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                Admin Dashboard
              </h1>
              <p id="admin-dashboard-subtitle" style={{ color: 'var(--muted)' }}>
                Manage your content and settings
              </p>
            </div>
            <button
              id="back-to-site-button"
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded border"
              style={{
                borderColor: 'var(--accent-1)',
                color: 'var(--accent-1)',
                backgroundColor: 'transparent'
              }}
            >
              ← Back to Site
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div id="admin-tabs" className="border-b" style={{ borderColor: 'var(--card)' }}>
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              id="dashboard-tab"
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-accent-1 text-accent-1'
                  : 'border-transparent hover:text-accent-1'
              }`}
              style={{ 
                color: activeTab === 'dashboard' ? 'var(--accent-1)' : 'var(--muted)',
                borderColor: activeTab === 'dashboard' ? 'var(--accent-1)' : 'transparent'
              }}
            >
              Dashboard
            </button>
            <button
              id="analytics-tab"
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-accent-1 text-accent-1'
                  : 'border-transparent hover:text-accent-1'
              }`}
              style={{ 
                color: activeTab === 'analytics' ? 'var(--accent-1)' : 'var(--muted)',
                borderColor: activeTab === 'analytics' ? 'var(--accent-1)' : 'transparent'
              }}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Statistics Cards */}
            <div id="admin-stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div id="total-articles-card" className="glass rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 80%)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Total Articles</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalArticles}</p>
              </div>
            </div>
          </div>

          <div id="featured-articles-card" className="glass rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-2), transparent 80%)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--accent-2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Featured Articles</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{featuredArticles}</p>
              </div>
            </div>
          </div>

          <div id="categories-card" className="glass rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, #10b981, transparent 80%)' }}>
                <svg className="w-6 h-6" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Categories</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{categories}</p>
              </div>
            </div>
          </div>

          <div id="tags-card" className="glass rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, #f59e0b, transparent 80%)' }}>
                <svg className="w-6 h-6" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Total Tags</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalTags}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div id="admin-quick-actions" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div id="quick-actions-card" className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Quick Actions</h2>
            <div className="space-y-3">
              <button
                id="manage-articles-button"
                onClick={() => router.push('/articles')}
                className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--card)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 50%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span style={{ color: 'var(--foreground)' }}>Manage Articles</span>
                </div>
                <svg className="w-4 h-4" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                id="view-analytics-button"
                className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors opacity-50 cursor-not-allowed"
                style={{
                  borderColor: 'var(--card)',
                  backgroundColor: 'transparent'
                }}
                disabled
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                  <span style={{ color: 'var(--muted)' }}>Analytics (Coming Soon)</span>
                </div>
              </button>

              <button
                id="settings-button"
                className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors opacity-50 cursor-not-allowed"
                style={{
                  borderColor: 'var(--card)',
                  backgroundColor: 'transparent'
                }}
                disabled
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span style={{ color: 'var(--muted)' }}>Settings (Coming Soon)</span>
                </div>
              </button>
            </div>
          </div>

          <div id="recent-activity-card" className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Recent Activity</h2>
            <div className="space-y-3">
              {articles.slice(0, 5).map((article, index) => (
                <div key={article.slug} id={`recent-article-${index}`} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {article.metadata.title}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      {article.metadata.category} • {article.metadata.tags?.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <button
                    id={`edit-article-${index}-button`}
                    onClick={() => router.push(`/articles/${article.slug}`)}
                    className="px-3 py-1 rounded text-sm"
                    style={{
                      backgroundColor: 'var(--accent-1)',
                      color: 'white'
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div id="system-info-card" className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div id="admin-mode-info" className="text-center p-4 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Admin Mode</p>
              <p className="text-lg font-semibold text-green-500">Enabled</p>
            </div>
            <div id="last-backup-info" className="text-center p-4 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Last Backup</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Not Available</p>
            </div>
            <div id="storage-info" className="text-center p-4 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Storage</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Local Files</p>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && config && (
          <AnalyticsDashboard config={config} />
        )}
      </div>
    </div>
  );
}
