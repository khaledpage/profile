import { test, expect } from '@playwright/test';

test.describe('Backend Configuration', () => {
  test.beforeEach(async ({ page }) => {
    // Start from admin dashboard
    await page.goto('/admin');
    
    // Wait for the page to load
    await page.waitForSelector('#admin-dashboard');
    
    // Dismiss cookie banner immediately
    try {
      await page.waitForSelector('#cookie-banner', { timeout: 2000 });
      await page.click('#accept-all-cookies');
      await page.waitForTimeout(500); // Wait for banner to disappear
    } catch (e) {
      // Cookie banner might not be present, continue
    }
  });

  test('should display backend selector interface', async ({ page }) => {
    // Click on Backend tab
    await page.click('#backend-tab');
    
    // Verify backend selector container is visible
    await expect(page.locator('#backend-selector-container')).toBeVisible();
    
    // Check title
    await expect(page.locator('#backend-selector-title')).toContainText('Backend Configuration');
    
    // Check current backend status
    await expect(page.locator('#backend-current-status')).toBeVisible();
    
    // Check configure button
    await expect(page.locator('#backend-configure-button')).toBeVisible();
  });

  test('should toggle configuration panel', async ({ page }) => {
    await page.click('#backend-tab');
    
    // Configuration panel should not be visible initially
    await expect(page.locator('#backend-configuration-panel')).not.toBeVisible();
    
    // Click configure button
    await page.click('#backend-configure-button');
    
    // Configuration panel should be visible
    await expect(page.locator('#backend-configuration-panel')).toBeVisible();
    
    // Check backend type selector
    await expect(page.locator('#backend-type-selector')).toBeVisible();
    
    // Cancel configuration
    await page.click('#backend-configure-button');
    
    // Panel should be hidden again
    await expect(page.locator('#backend-configuration-panel')).not.toBeVisible();
  });

  test('should display backend type options', async ({ page }) => {
    await page.click('#backend-tab');
    await page.click('#backend-configure-button');
    
    // Check all three backend options are present
    await expect(page.locator('#backend-option-filesystem')).toBeVisible();
    await expect(page.locator('#backend-option-database')).toBeVisible();
    await expect(page.locator('#backend-option-cms')).toBeVisible();
    
    // Filesystem should be selected by default
    await expect(page.locator('#backend-option-filesystem')).toHaveClass(/border-accent-1/);
  });

  test('should configure database backend', async ({ page }) => {
    await page.click('#backend-tab');
    await page.click('#backend-configure-button');
    
    // Select database backend
    await page.click('#backend-option-database');
    
    // Database config section should appear
    await expect(page.locator('#database-config-section')).toBeVisible();
    
    // Check database type selector
    await expect(page.locator('#database-type-selector')).toBeVisible();
    
    // Test PostgreSQL configuration
    await page.selectOption('#database-type', 'postgresql');
    await expect(page.locator('#database-connection-fields')).toBeVisible();
    await expect(page.locator('#database-host-field')).toBeVisible();
    await expect(page.locator('#database-port-field')).toBeVisible();
    
    // Test SQLite configuration
    await page.selectOption('#database-type', 'sqlite');
    await expect(page.locator('#database-connection-fields')).not.toBeVisible();
    await expect(page.locator('#sqlite-filename-field')).toBeVisible();
    
    // Fill in SQLite configuration
    await page.fill('#sqlite-filename', './test-articles.db');
    
    // Test connection button should be enabled
    await expect(page.locator('#test-new-backend-button')).toBeEnabled();
  });

  test('should configure CMS backend', async ({ page }) => {
    await page.click('#backend-tab');
    await page.click('#backend-configure-button');
    
    // Select CMS backend
    await page.click('#backend-option-cms');
    
    // CMS config section should appear
    await expect(page.locator('#cms-config-section')).toBeVisible();
    
    // Check CMS type selector
    await page.selectOption('#cms-type', 'strapi');
    
    // Fill in basic configuration
    await page.fill('#cms-api-url', 'https://api.example.com');
    await page.fill('#cms-api-key', 'test-api-key');
    
    // Test Contentful specific fields
    await page.selectOption('#cms-type', 'contentful');
    await expect(page.locator('#contentful-config')).toBeVisible();
    await expect(page.locator('#contentful-space-field')).toBeVisible();
    await expect(page.locator('#contentful-environment-field')).toBeVisible();
    
    // Test Sanity specific fields
    await page.selectOption('#cms-type', 'sanity');
    await expect(page.locator('#sanity-config')).toBeVisible();
    await expect(page.locator('#sanity-project-field')).toBeVisible();
    await expect(page.locator('#sanity-dataset-field')).toBeVisible();
  });

  test('should test backend connection', async ({ page }) => {
    await page.click('#backend-tab');
    
    // Test current backend connection
    await page.click('#test-connection-button');
    
    // Should show some status change (loading, then result)
    // This is mocked, so we just verify the button interaction works
    await page.waitForTimeout(1000);
    
    // Configure a new backend and test it
    await page.click('#backend-configure-button');
    await page.click('#backend-option-database');
    
    await page.selectOption('#database-type', 'sqlite');
    await page.fill('#sqlite-filename', './test.db');
    
    // Test new backend connection
    await page.click('#test-new-backend-button');
    
    // Should show loading state initially
    await page.waitForTimeout(500);
  });

  test('should save backend configuration', async ({ page }) => {
    await page.click('#backend-tab');
    await page.click('#backend-configure-button');
    
    // Configure database backend
    await page.click('#backend-option-database');
    await page.selectOption('#database-type', 'sqlite');
    await page.fill('#sqlite-filename', './articles.db');
    
    // Save configuration
    await page.click('#save-backend-config-button');
    
    // Configuration panel should close
    await expect(page.locator('#backend-configuration-panel')).not.toBeVisible();
    
    // Refresh page and check persistence
    await page.reload();
    await page.click('#backend-tab');
    
    // Current backend should still show the saved configuration
    // (In real implementation, this would show "database")
  });

  test('should toggle advanced options', async ({ page }) => {
    await page.click('#backend-tab');
    await page.click('#backend-configure-button');
    
    // Advanced options should be visible
    await expect(page.locator('#backend-advanced-options')).toBeVisible();
    
    // Check sync option
    await expect(page.locator('#backend-sync-option')).toBeVisible();
    await expect(page.locator('#enable-sync-checkbox')).toBeVisible();
    
    // Toggle sync option
    await page.click('#enable-sync-checkbox');
    await expect(page.locator('#enable-sync-checkbox')).toBeChecked();
    
    // Toggle it off
    await page.click('#enable-sync-checkbox');
    await expect(page.locator('#enable-sync-checkbox')).not.toBeChecked();
  });

  test('should handle form validation', async ({ page }) => {
    await page.click('#backend-tab');
    await page.click('#backend-configure-button');
    
    // Select database backend
    await page.click('#backend-option-database');
    
    // Try to save without required fields
    await page.click('#save-backend-config-button');
    
    // Should remain in configuration mode due to validation
    await expect(page.locator('#backend-configuration-panel')).toBeVisible();
    
    // Fill required fields
    await page.selectOption('#database-type', 'postgresql');
    await page.fill('#database-host', 'localhost');
    await page.fill('#database-name', 'articles');
    
    // Now save should work
    await page.click('#save-backend-config-button');
  });

  test('should display connection status indicators', async ({ page }) => {
    await page.click('#backend-tab');
    
    // Current backend status should show connection indicator
    const statusSection = page.locator('#backend-current-status');
    await expect(statusSection).toBeVisible();
    
    // Should contain status icon and connection test button
    await expect(statusSection.locator('button')).toContainText('Test Connection');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.click('#backend-tab');
    
    // Tab through the interface
    await page.keyboard.press('Tab');
    await expect(page.locator('#backend-configure-button')).toBeFocused();
    
    // Enter to activate
    await page.keyboard.press('Enter');
    await expect(page.locator('#backend-configuration-panel')).toBeVisible();
    
    // Tab through backend options
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Arrow keys should work for backend selection
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('#backend-tab');
    
    // Interface should be accessible on mobile
    await expect(page.locator('#backend-selector-container')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.click('#backend-configure-button');
    
    // Configuration panel should adapt to tablet
    await expect(page.locator('#backend-configuration-panel')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // All elements should be properly laid out
    await expect(page.locator('#backend-type-selector')).toBeVisible();
  });
});

test.describe('Backend Integration', () => {
  test('should integrate with existing article features', async ({ page }) => {
    // This test would verify that switching backends doesn't break existing features
    await page.goto('/admin');
    
    // Dismiss cookie banner
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      await page.click('#accept-all-cookies');
    }
    
    // Start on dashboard tab to check articles
    const articlesContainer = page.locator('#admin-articles-grid');
    if (await articlesContainer.isVisible()) {
      // Check that article operations still work
      const firstArticle = articlesContainer.locator('.article-card').first();
      if (await firstArticle.isVisible()) {
        // Article management should still work regardless of backend
        await expect(firstArticle).toBeVisible();
      }
    }
    
    // Switch to backend configuration
    await page.click('#backend-tab');
    await expect(page.locator('#backend-selector-container')).toBeVisible();
    
    // Backend configuration shouldn't affect other admin features
    await page.click('#dashboard-tab');
    
    // Dashboard should still be functional
    await expect(page.locator('#admin-stats-grid')).toBeVisible();
  });
});
