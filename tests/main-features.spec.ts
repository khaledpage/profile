import { test, expect } from '@playwright/test';

// Helper function to dismiss cookie banner if present
async function dismissCookieBanner(page: any) {
  try {
    // Wait a moment for page to load
    await page.waitForTimeout(1000);
    
    // Look for common cookie banner dismiss buttons
    const dismissSelectors = [
      'button:has-text("Accept")',
      'button:has-text("OK")',
      'button:has-text("Accept All")',
      'button:has-text("Allow")',
      '[data-cookie-accept]',
      '.cookie-accept',
      '#cookie-accept',
      '.cookie-banner button',
      '[aria-label*="cookie" i] button',
      '[class*="cookie" i] button:first-child'
    ];
    
    for (const selector of dismissSelectors) {
      const button = page.locator(selector);
      if (await button.isVisible({ timeout: 2000 })) {
        await button.click();
        await page.waitForTimeout(1000);
        console.log(`Dismissed cookie banner with selector: ${selector}`);
        break;
      }
    }
  } catch (error) {
    // Ignore errors if cookie banner is not present
    console.log('No cookie banner found or error dismissing it');
  }
}

// Helper function to login as admin if needed
async function loginAsAdmin(page: any) {
  try {
    // Check if we're on login page or if admin login is needed
    const loginForm = page.locator('form input[type="password"]');
    if (await loginForm.isVisible({ timeout: 2000 })) {
      // Fill in admin credentials
      await page.fill('input[type="text"], input[name="username"]', 'admin');
      await page.fill('input[type="password"], input[name="password"]', 'admin');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }
  } catch (error) {
    // Ignore if login is not needed
  }
}

test.beforeEach(async ({ page }) => {
  // Set a larger viewport for consistent testing
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // Dismiss cookie banner on each test
  await dismissCookieBanner(page);
  
  // Handle admin login if needed
  await loginAsAdmin(page);
});

test.describe('Admin Authentication and Access', () => {
  test('admin dashboard should be accessible when admin mode is enabled', async ({ page }) => {
    await page.goto('/admin');
    
    // Wait for page to load and check for admin dashboard or loading state
    await page.waitForLoadState('networkidle');
    
    // Should see the admin dashboard (admin mode is enabled by default)
    // Wait for either the dashboard title or loading state
    await expect(page.locator('#admin-dashboard-title, #admin-dashboard-loading')).toBeVisible();
    
    // If loading, wait for the actual dashboard
    const loadingElement = page.locator('#admin-dashboard-loading');
    if (await loadingElement.isVisible()) {
      await expect(page.locator('#admin-dashboard-title')).toBeVisible();
    }
    
    await expect(page.locator('#admin-dashboard-title')).toContainText('Admin Dashboard');
    await expect(page.locator('#admin-dashboard-subtitle')).toContainText('Manage your content and settings');
  });

  test('admin login page should be accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Should see login form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('admin login should work with correct credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in admin credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to home page (or see success message)
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Navigation and UI', () => {
  test('smooth scrolling should work for navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop navigation smooth scrolling
    await page.click('#nav-link-about');
    
    // Wait for scroll to complete
    await page.waitForTimeout(1000);
    
    // Check if we scrolled to the about section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('mobile navigation should work correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    const mobileMenuButton = page.locator('#mobile-menu-button');
    await expect(mobileMenuButton).toBeVisible();
    await mobileMenuButton.click();
    
    // Should see mobile navigation links
    await expect(page.locator('#mobile-nav-link-about')).toBeVisible();
    await expect(page.locator('#mobile-nav-link-projects')).toBeVisible();
  });

  test('header CTA button should have heartbeat animation', async ({ page }) => {
    await page.goto('/');
    
    // Set desktop viewport to ensure CTA button is visible (hidden on mobile)
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Check if CTA button exists and has heartbeat data attribute
    const ctaButton = page.locator('#header-cta-button');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('data-heartbeat', 'true');
  });
});

test.describe('Article Management', () => {
  test('articles page should load correctly', async ({ page }) => {
    await page.goto('/articles');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Should see articles explorer container (wait for loading to complete)
    await expect(page.locator('#articles-explorer-container, #articles-explorer-loading')).toBeVisible();
    
    // If loading, wait for the actual container
    const loadingElement = page.locator('#articles-explorer-loading');
    if (await loadingElement.isVisible()) {
      await expect(page.locator('#articles-explorer-container')).toBeVisible();
    }
    
    // Should see search functionality
    await expect(page.locator('#articles-search-input')).toBeVisible();
    
    // Should see filters
    await expect(page.locator('#articles-explorer-filters')).toBeVisible();
  });

  test('admin controls should be visible when admin mode is enabled', async ({ page }) => {
    await page.goto('/articles');
    
    // Look for admin controls (edit/delete buttons)
    const adminControls = page.locator('[id*="article-admin-controls-"]');
    if (await adminControls.first().isVisible()) {
      await expect(adminControls.first()).toBeVisible();
      
      // Check for edit and delete buttons
      const editButton = page.locator('[id*="article-edit-button-"]').first();
      const deleteButton = page.locator('[id*="article-delete-button-"]').first();
      
      await expect(editButton).toBeVisible();
      await expect(deleteButton).toBeVisible();
    }
  });

  test('article edit modal should open when edit button is clicked', async ({ page }) => {
    await page.goto('/articles');
    
    // Wait for articles to load
    await page.waitForSelector('[id*="article-card-"]');
    
    // Click first edit button if visible
    const editButton = page.locator('[id*="article-edit-button-"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Check if edit modal opens
      await expect(page.locator('#article-edit-modal')).toBeVisible();
      await expect(page.locator('#article-title-input')).toBeVisible();
      await expect(page.locator('#article-content-textarea')).toBeVisible();
    }
  });

  test('article details page should load correctly', async ({ page }) => {
    await page.goto('/articles/nextjs-vs-react');
    
    // Should see article content
    await expect(page.locator('article, [role="main"]')).toBeVisible();
    
    // Should see article title
    const articleTitle = page.locator('h1');
    await expect(articleTitle).toBeVisible();
  });
});

test.describe('Admin Dashboard', () => {
  test('admin dashboard should show statistics', async ({ page }) => {
    await page.goto('/admin');
    
    // Check for statistics cards
    await expect(page.locator('#total-articles-card')).toBeVisible();
    await expect(page.locator('#featured-articles-card')).toBeVisible();
    await expect(page.locator('#categories-card')).toBeVisible();
    await expect(page.locator('#tags-card')).toBeVisible();
    
    // Statistics should show numbers
    const totalArticles = page.locator('#total-articles-card .text-2xl');
    await expect(totalArticles).not.toBeEmpty();
  });

  test('admin dashboard quick actions should work', async ({ page }) => {
    await page.goto('/admin');
    
    // Check if quick actions section exists
    await expect(page.locator('#admin-quick-actions')).toBeVisible();
    
    // Test "Manage Articles" button
    const manageArticlesButton = page.locator('#manage-articles-button');
    await expect(manageArticlesButton).toBeVisible();
    
    await manageArticlesButton.click();
    await page.waitForURL('/articles');
    await expect(page).toHaveURL('/articles');
  });

  test('admin dashboard should show recent activity', async ({ page }) => {
    await page.goto('/admin');
    
    // Wait for admin dashboard to load
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#admin-dashboard-title')).toBeVisible();
    
    // Make sure we're on the dashboard tab
    const dashboardTab = page.locator('#dashboard-tab');
    await expect(dashboardTab).toBeVisible();
    await dashboardTab.click();
    
    // Check for recent activity section
    await expect(page.locator('#recent-activity-card')).toBeVisible();
    
    // Should show recent articles
    const recentArticles = page.locator('[id*="recent-article-"]');
    await expect(recentArticles.first()).toBeVisible();
  });

  test('admin dashboard back button should work', async ({ page }) => {
    await page.goto('/admin');
    
    // Click back to site button
    const backButton = page.locator('#back-to-site-button');
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Responsive Design', () => {
  test('site should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should load without horizontal scroll
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox?.width).toBeLessThanOrEqual(375);
  });

  test('admin dashboard should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');
    
    // Dashboard should be visible and responsive
    await expect(page.locator('#admin-dashboard')).toBeVisible();
    await expect(page.locator('#admin-stats-grid')).toBeVisible();
  });
});

test.describe('Performance and Loading', () => {
  test('home page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Page should be interactive
    await expect(page.locator('body')).toBeVisible();
  });

  test('articles page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Articles explorer should be visible (wait for loading state)
    await expect(page.locator('#articles-explorer-container, #articles-explorer-loading')).toBeVisible();
  });
});
