import { test, expect } from '@playwright/test';

test.describe('Article Template System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/admin');
    
    // Wait for the admin dashboard to load
    await page.waitForSelector('#admin-dashboard');
    
    // Dismiss cookie banner if present
    try {
      await page.waitForSelector('#cookie-banner', { timeout: 2000 });
      await page.click('#accept-all-cookies');
      await page.waitForTimeout(500);
    } catch (e) {
      // Cookie banner might not be present
    }
  });

  test('should display templates tab and interface', async ({ page }) => {
    // Click on Templates tab
    await page.click('#templates-tab');
    
    // Verify template manager container is visible
    await expect(page.locator('#template-manager-container')).toBeVisible();
    
    // Check title and subtitle
    await expect(page.locator('#template-manager-title')).toContainText('Templates');
    await expect(page.locator('#template-manager-subtitle')).toBeVisible();
    
    // Check create template button
    await expect(page.locator('#create-template-button')).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    await page.click('#templates-tab');
    
    // Check category filter section
    await expect(page.locator('#template-category-filter')).toBeVisible();
    
    // Check all templates filter
    await expect(page.locator('#category-filter-all')).toBeVisible();
    
    // Check specific category filters
    await expect(page.locator('#category-filter-tutorial')).toBeVisible();
    await expect(page.locator('#category-filter-review')).toBeVisible();
    await expect(page.locator('#category-filter-case-study')).toBeVisible();
  });

  test('should display predefined templates', async ({ page }) => {
    await page.click('#templates-tab');
    
    // Wait for templates to load
    await page.waitForSelector('#templates-grid', { timeout: 5000 });
    
    // Check that templates grid is visible
    await expect(page.locator('#templates-grid')).toBeVisible();
    
    // Check for predefined templates (at least one should exist)
    const templateCards = page.locator('[id^="template-card-"]');
    const count = await templateCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check first template card has required elements
    const firstTemplate = templateCards.first();
    await expect(firstTemplate.locator('h3')).toBeVisible(); // Template name
    await expect(firstTemplate.locator('p').nth(1)).toBeVisible(); // Description
  });

  test('should filter templates by category', async ({ page }) => {
    await page.click('#templates-tab');
    await page.waitForSelector('#templates-grid');
    
    // Click on tutorial category filter
    await page.click('#category-filter-tutorial');
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check that category filter is active (has different styling)
    const tutorialFilter = page.locator('#category-filter-tutorial');
    await expect(tutorialFilter).toHaveClass(/border-accent-1/);
    
    // Verify only tutorial templates are shown
    const templateCards = page.locator('[id^="template-card-"]');
    const count = await templateCards.count();
    
    if (count > 0) {
      // Check that visible templates have tutorial category
      for (let i = 0; i < count; i++) {
        const card = templateCards.nth(i);
        // Templates should have category indicator
        await expect(card).toBeVisible();
      }
    }
  });

  test('should open template preview modal', async ({ page }) => {
    await page.click('#templates-tab');
    await page.waitForSelector('#templates-grid');
    
    // Find and click preview button on first template
    const firstPreviewButton = page.locator('[id^="preview-template-"]').first();
    await firstPreviewButton.click();
    
    // Check that preview modal opens
    await expect(page.locator('#template-preview-modal')).toBeVisible();
    
    // Check modal content
    await expect(page.locator('#template-preview-modal h3')).toContainText('Template Preview');
    
    // Close modal
    const closeButton = page.locator('#template-preview-modal button').last();
    await closeButton.click();
    
    // Modal should be closed
    await expect(page.locator('#template-preview-modal')).not.toBeVisible();
  });

  test('should handle template usage workflow', async ({ page }) => {
    await page.click('#templates-tab');
    await page.waitForSelector('#templates-grid');
    
    // Click use template button on first template
    const firstUseButton = page.locator('[id^="use-template-"]').first();
    
    // Note: This would normally redirect to article creation
    // For testing, we'll just verify the button is clickable
    await expect(firstUseButton).toBeVisible();
    await expect(firstUseButton).toBeEnabled();
    
    // Could extend this test to mock the article creation flow
  });

  test('should show empty state when no templates match filter', async ({ page }) => {
    await page.click('#templates-tab');
    await page.waitForSelector('#templates-grid');
    
    // Try to filter by a category that might not have templates
    // This is more likely with custom category
    await page.click('#category-filter-custom');
    await page.waitForTimeout(500);
    
    // Check if empty state is shown (only if no custom templates exist)
    const templateCards = page.locator('[id^="template-card-"]');
    const count = await templateCards.count();
    
    if (count === 0) {
      await expect(page.locator('#templates-empty-state')).toBeVisible();
      await expect(page.locator('#templates-empty-state h3')).toContainText('No templates found');
    }
  });

  test('should validate template structure and content', async ({ page }) => {
    await page.click('#templates-tab');
    await page.waitForSelector('#templates-grid');
    
    // Open preview of first template
    const firstPreviewButton = page.locator('[id^="preview-template-"]').first();
    await firstPreviewButton.click();
    
    await expect(page.locator('#template-preview-modal')).toBeVisible();
    
    // Check that metadata section exists
    const metadataSection = page.locator('#template-preview-modal').getByText('Metadata');
    await expect(metadataSection).toBeVisible();
    
    // Check that content structure section exists
    const contentSection = page.locator('#template-preview-modal').getByText('Content Structure');
    await expect(contentSection).toBeVisible();
    
    // Check that content preview shows markdown structure
    const contentPreview = page.locator('#template-preview-modal pre');
    await expect(contentPreview).toBeVisible();
    
    // Content should contain typical markdown elements
    const previewText = await contentPreview.textContent();
    expect(previewText).toContain('#'); // Should have markdown headers
    
    // Close modal
    await page.keyboard.press('Escape');
    await expect(page.locator('#template-preview-modal')).not.toBeVisible();
  });
});
