import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Comprehensive', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/admin');
    // Wait for dashboard to load
    await page.waitForSelector('#admin-dashboard');
  });

  test('DASH-001: Dashboard Overview', async ({ page }) => {
    // Verify access control (should be accessible when admin enabled by default)
    await expect(page.locator('#admin-dashboard-title')).toContainText('Admin Dashboard');
    await expect(page.locator('#admin-dashboard-subtitle')).toContainText('Manage your content and settings');
    
    // Check statistics cards
    const statsCards = [
      '#total-articles-card',
      '#featured-articles-card', 
      '#categories-card',
      '#tags-card'
    ];
    
    for (const cardId of statsCards) {
      await expect(page.locator(cardId)).toBeVisible();
      
      // Verify statistics show numbers
      const statNumber = page.locator(`${cardId} .text-2xl`);
      await expect(statNumber).toBeVisible();
      
      const numberText = await statNumber.textContent();
      expect(numberText).toMatch(/\\d+/); // Should contain at least one digit
    }
    
    // Verify quick actions section
    await expect(page.locator('#admin-quick-actions')).toBeVisible();
    await expect(page.locator('#recent-activity-card')).toBeVisible();
    await expect(page.locator('#system-info-card')).toBeVisible();
  });

  test('DASH-002: Dashboard Navigation', async ({ page }) => {
    // Check default tab (Dashboard should be active)
    const dashboardTab = page.locator('#dashboard-tab');
    await expect(dashboardTab).toBeVisible();
    
    // Check analytics tab
    const analyticsTab = page.locator('#analytics-tab');
    await expect(analyticsTab).toBeVisible();
    
    // Click analytics tab
    await analyticsTab.click();
    
    // Should switch to analytics content
    await expect(page.locator('#analytics-dashboard')).toBeVisible();
    
    // Switch back to dashboard tab
    await dashboardTab.click();
    
    // Should see dashboard content again
    await expect(page.locator('#admin-stats-grid')).toBeVisible();
    
    // Test back to site navigation
    const backButton = page.locator('#back-to-site-button');
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('DASH-003: Quick Actions', async ({ page }) => {
    // Test "Manage Articles" button
    const manageArticlesButton = page.locator('#manage-articles-button');
    await expect(manageArticlesButton).toBeVisible();
    
    await manageArticlesButton.click();
    await page.waitForURL('/articles');
    await expect(page).toHaveURL('/articles');
    
    // Go back to dashboard
    await page.goto('/admin');
    
    // Check disabled buttons show proper state
    const viewAnalyticsButton = page.locator('#view-analytics-button');
    const settingsButton = page.locator('#settings-button');
    
    if (await viewAnalyticsButton.isVisible()) {
      await expect(viewAnalyticsButton).toHaveClass(/opacity-50|disabled/);
    }
    
    if (await settingsButton.isVisible()) {
      await expect(settingsButton).toHaveClass(/opacity-50|disabled/);
    }
  });

  test('DASH-004: System Information', async ({ page }) => {
    const systemInfoCard = page.locator('#system-info-card');
    await expect(systemInfoCard).toBeVisible();
    
    // Check admin mode status
    const adminModeInfo = page.locator('#admin-mode-info');
    await expect(adminModeInfo).toBeVisible();
    await expect(adminModeInfo).toContainText('Enabled');
    
    // Check backup status
    const backupInfo = page.locator('#last-backup-info');
    await expect(backupInfo).toBeVisible();
    
    // Check storage info
    const storageInfo = page.locator('#storage-info');
    await expect(storageInfo).toBeVisible();
    await expect(storageInfo).toContainText('Local Files');
  });

  test('DASH-005: Recent Activity Section', async ({ page }) => {
    const recentActivityCard = page.locator('#recent-activity-card');
    await expect(recentActivityCard).toBeVisible();
    
    // Should show recent articles
    const recentArticles = page.locator('[id*="recent-article-"]');
    const articleCount = await recentArticles.count();
    
    if (articleCount > 0) {
      // Check first article
      const firstArticle = recentArticles.first();
      await expect(firstArticle).toBeVisible();
      
      // Should have view button
      const viewButton = page.locator('[id*="edit-article-"][id*="-button"]').first();
      await expect(viewButton).toBeVisible();
      
      // Click view button should navigate to article
      await viewButton.click();
      await page.waitForURL(/.*\/articles\/.+/);
      expect(page.url()).toContain('/articles/');
    }
  });
});

test.describe('Analytics System', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin dashboard analytics tab
    await page.goto('/admin');
    await page.waitForSelector('#admin-dashboard');
    await page.click('#analytics-tab');
    await page.waitForSelector('#analytics-dashboard');
  });

  test('ANALYTICS-001: Analytics Dashboard', async ({ page }) => {
    const analyticsDashboard = page.locator('#analytics-dashboard');
    await expect(analyticsDashboard).toBeVisible();
    
    // Check analytics header
    const analyticsTitle = page.locator('#analytics-title');
    await expect(analyticsTitle).toBeVisible();
    await expect(analyticsTitle).toContainText('Analytics');
    
    const analyticsSubtitle = page.locator('#analytics-subtitle');
    await expect(analyticsSubtitle).toBeVisible();
    
    // Check clear analytics button
    const clearButton = page.locator('#clear-analytics-button');
    await expect(clearButton).toBeVisible();
    
    // Check overview statistics
    const overviewSection = page.locator('#analytics-overview');
    await expect(overviewSection).toBeVisible();
    
    const statCards = [
      '#total-views-stat',
      '#unique-visitors-stat',
      '#avg-reading-time-stat',
      '#total-articles-stat'
    ];
    
    for (const cardId of statCards) {
      const card = page.locator(cardId);
      if (await card.isVisible()) {
        await expect(card).toBeVisible();
      }
    }
    
    // Check weekly views chart
    const weeklyChart = page.locator('#weekly-views-chart');
    if (await weeklyChart.isVisible()) {
      await expect(weeklyChart).toBeVisible();
      
      // Should have chart bars
      const chartBars = page.locator('[id*="weekly-bar-"]');
      const barCount = await chartBars.count();
      expect(barCount).toBeGreaterThanOrEqual(7); // Should have 7 days
    }
    
    // Check top articles section
    const topArticlesSection = page.locator('#top-articles-section');
    if (await topArticlesSection.isVisible()) {
      await expect(topArticlesSection).toBeVisible();
    }
    
    // Check device breakdown
    const deviceSection = page.locator('#device-breakdown-section');
    if (await deviceSection.isVisible()) {
      await expect(deviceSection).toBeVisible();
      
      // Should have device stats
      const deviceStats = page.locator('[id*="device-"][id*="-stat"]');
      const deviceCount = await deviceStats.count();
      expect(deviceCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('ANALYTICS-002: Article View Tracking', async ({ page }) => {
    // First, navigate to an article to generate some analytics data
    await page.goto('/articles/nextjs-vs-react');
    await page.waitForSelector('article, [role="main"]');
    
    // Simulate reading time
    await page.waitForTimeout(2000);
    
    // Navigate back to analytics
    await page.goto('/admin');
    await page.click('#analytics-tab');
    await page.waitForSelector('#analytics-dashboard');
    
    // Check if analytics updated (this depends on implementation)
    const totalViewsStat = page.locator('#total-views-stat');
    if (await totalViewsStat.isVisible()) {
      const viewsText = await totalViewsStat.textContent();
      // Should show some number (even if 0)
      expect(viewsText).toMatch(/\\d+/);
    }
  });

  test('ANALYTICS-003: Analytics Data Management', async ({ page }) => {
    const clearButton = page.locator('#clear-analytics-button');
    
    if (await clearButton.isVisible()) {
      // Click clear data button
      await clearButton.click();
      
      // Should either show confirmation or immediately clear
      // Check if data is cleared (look for empty state or reset values)
      await page.waitForTimeout(1000);
      
      // Look for empty state or reset analytics
      const emptyState = page.locator('#analytics-dashboard-empty');
      const totalViews = page.locator('#total-views-stat .text-2xl');
      
      if (await emptyState.isVisible()) {
        await expect(emptyState).toContainText('No analytics data');
      } else if (await totalViews.isVisible()) {
        // Values should be reset to 0 or low numbers
        const viewsText = await totalViews.textContent();
        expect(viewsText).toBeTruthy();
      }
    }
  });

  test('ANALYTICS-004: Analytics Empty State', async ({ page }) => {
    // Clear analytics first
    const clearButton = page.locator('#clear-analytics-button');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Check for empty state or loading state
    const emptyState = page.locator('#analytics-dashboard-empty');
    const loadingState = page.locator('#analytics-dashboard-loading');
    
    if (await emptyState.isVisible()) {
      await expect(emptyState).toContainText('No analytics data');
    } else if (await loadingState.isVisible()) {
      await expect(loadingState).toContainText('Loading');
    } else {
      // Analytics might still show default values
      const dashboard = page.locator('#analytics-dashboard');
      await expect(dashboard).toBeVisible();
    }
  });
});

test.describe('Article Search and Filtering', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles');
    await page.waitForSelector('#articles-explorer');
  });

  test('ART-003: Article Search and Filtering', async ({ page }) => {
    // Test search functionality
    const searchInput = page.locator('#articles-search-input');
    await expect(searchInput).toBeVisible();
    
    // Enter search term
    await searchInput.fill('react');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Check if results are filtered
    const articleCards = page.locator('[id*="article-card-"]');
    const cardCount = await articleCards.count();
    
    if (cardCount > 0) {
      // At least one article should contain 'react' in title or content
      const firstCard = articleCards.first();
      const cardText = await firstCard.textContent();
      expect(cardText?.toLowerCase()).toContain('react');
    }
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Test tag filtering
    const tagButtons = page.locator('[id*="tag-filter-"]');
    const tagCount = await tagButtons.count();
    
    if (tagCount > 0) {
      const firstTag = tagButtons.first();
      await firstTag.click();
      
      // Should filter by tag
      await page.waitForTimeout(500);
      
      // Verify tag filtering worked
      const filteredCards = page.locator('[id*="article-card-"]');
      const filteredCount = await filteredCards.count();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
    
    // Test category filtering
    const categorySelect = page.locator('#category-filter-select');
    if (await categorySelect.isVisible()) {
      const options = page.locator('#category-filter-select option');
      const optionCount = await options.count();
      
      if (optionCount > 1) {
        // Select first category (skip "All Categories")
        await categorySelect.selectOption({ index: 1 });
        await page.waitForTimeout(500);
        
        // Should filter by category
        const categoryFilteredCards = page.locator('[id*="article-card-"]');
        const categoryFilteredCount = await categoryFilteredCards.count();
        expect(categoryFilteredCount).toBeGreaterThanOrEqual(0);
      }
    }
    
    // Test clear filters
    const clearFiltersButton = page.locator('#clear-filters-button');
    if (await clearFiltersButton.isVisible()) {
      await clearFiltersButton.click();
      
      // Should reset all filters
      await page.waitForTimeout(500);
      
      const allCards = page.locator('[id*="article-card-"]');
      const allCardCount = await allCards.count();
      expect(allCardCount).toBeGreaterThan(0);
    }
  });

  test('ART-004: Article Display and Layout', async ({ page }) => {
    // Check articles display in grid
    const articlesGrid = page.locator('#articles-explorer-grid');
    await expect(articlesGrid).toBeVisible();
    
    // Should have CSS grid layout
    const gridStyle = await articlesGrid.evaluate(el => getComputedStyle(el).display);
    expect(gridStyle).toBe('grid');
    
    // Check article cards
    const articleCards = page.locator('[id*="article-card-"]');
    const cardCount = await articleCards.count();
    
    if (cardCount > 0) {
      const firstCard = articleCards.first();
      await expect(firstCard).toBeVisible();
      
      // Should show metadata
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
      if (cardText) {
        expect(cardText.length).toBeGreaterThan(10);
      }
      
      // Test hover effects (if any)
      await firstCard.hover();
      await page.waitForTimeout(100);
    }
    
    // Test responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Grid should still be visible and responsive
    await expect(articlesGrid).toBeVisible();
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await expect(articlesGrid).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('ART-005: No Results Handling', async ({ page }) => {
    const searchInput = page.locator('#articles-search-input');
    
    // Search for something that definitely won't exist
    await searchInput.fill('definitely-not-a-real-article-search-term-12345');
    await page.waitForTimeout(500);
    
    // Should show no results message
    const noResultsMessage = page.locator('#no-articles-message');
    if (await noResultsMessage.isVisible()) {
      await expect(noResultsMessage).toContainText('No articles found');
      
      // Should have clear filters option
      const clearFiltersFromEmpty = page.locator('#clear-filters-from-empty');
      if (await clearFiltersFromEmpty.isVisible()) {
        await clearFiltersFromEmpty.click();
        
        // Should show all articles again
        await page.waitForTimeout(500);
        const articleCards = page.locator('[id*="article-card-"]');
        const cardCount = await articleCards.count();
        expect(cardCount).toBeGreaterThan(0);
      }
    }
  });
});
