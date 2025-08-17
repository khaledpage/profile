import { test, expect } from '@playwright/test';

test.describe('Filter Layout Consistency', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    
    await page.goto('http://localhost:3000/articles', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for articles to load
    
    // Handle cookie consent banner if present
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      const acceptButton = page.locator('#cookie-accept-button');
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('category filter should stay on its own row regardless of tag filtering', async ({ page }) => {
    // Wait for filters to be visible
    await page.waitForSelector('#articles-explorer-filters');
    
    // Check if tag filters exist
    const tagFilters = page.locator('[id^="tag-filter-"]');
    const tagCount = await tagFilters.count();
    
    if (tagCount === 0) {
      console.log('No tag filters found, skipping this test');
      return;
    }
    
    // Get initial positions of filter sections
    const categoryFilterLabel = page.locator('label').filter({ hasText: 'Filter by Category:' });
    
    if (await categoryFilterLabel.count() === 0) {
      console.log('No category filter found, skipping this test');
      return;
    }
    
    // Get initial vertical position of category filter
    const initialCategoryBox = await categoryFilterLabel.boundingBox();
    expect(initialCategoryBox).toBeTruthy();
    
    // Click on a tag filter to reduce visible tags
    const firstTag = tagFilters.first();
    await firstTag.click();
    await page.waitForTimeout(500); // Wait for filtering animation
    
    // Get new position of category filter after filtering
    const newCategoryBox = await categoryFilterLabel.boundingBox();
    expect(newCategoryBox).toBeTruthy();
    
    // Verify category filter stayed in the same vertical position (or close to it)
    // Allow small tolerance for layout adjustments
    const verticalDifference = Math.abs(newCategoryBox!.y - initialCategoryBox!.y);
    expect(verticalDifference).toBeLessThan(50); // Allow up to 50px difference for layout adjustments
    
    // More importantly, verify category filter is still below tag filters
    const tagFilterSection = page.locator('label').filter({ hasText: 'Filter by Tag:' });
    if (await tagFilterSection.count() > 0) {
      const tagSectionBox = await tagFilterSection.boundingBox();
      expect(tagSectionBox).toBeTruthy();
      
      // Category filter should be below tag filter section
      expect(newCategoryBox!.y).toBeGreaterThan(tagSectionBox!.y);
    }
  });

  test('filter sections should be in vertical stack layout', async ({ page }) => {
    await page.waitForSelector('#articles-explorer-filters');
    
    // Check the main filters container uses vertical layout
    const filtersContainer = page.locator('#articles-explorer-filters');
    const containerClasses = await filtersContainer.getAttribute('class');
    
    // Should use space-y-* for vertical spacing, not flex flex-wrap
    expect(containerClasses).toContain('space-y');
    expect(containerClasses).not.toContain('flex-wrap');
  });

  test('each filter section should take full width', async ({ page }) => {
    await page.waitForSelector('#articles-explorer-filters');
    
    // Get all filter section divs
    const filterSections = page.locator('#articles-explorer-filters > div');
    const sectionCount = await filterSections.count();
    
    if (sectionCount === 0) {
      console.log('No filter sections found');
      return;
    }
    
    // Check each section has w-full class
    for (let i = 0; i < sectionCount; i++) {
      const section = filterSections.nth(i);
      const classes = await section.getAttribute('class');
      expect(classes).toContain('w-full');
    }
  });

  test('filter layout should remain stable when applying multiple filters', async ({ page }) => {
    await page.waitForSelector('#articles-explorer-filters');
    
    const categoryFilter = page.locator('#category-filter-select');
    const tagFilters = page.locator('[id^="tag-filter-"]');
    
    if (await categoryFilter.count() === 0 || await tagFilters.count() === 0) {
      console.log('Insufficient filters for this test');
      return;
    }
    
    // Get initial layout measurements
    const initialCategoryBox = await categoryFilter.boundingBox();
    expect(initialCategoryBox).toBeTruthy();
    
    // Apply tag filter
    await tagFilters.first().click();
    await page.waitForTimeout(300);
    
    // Apply category filter 
    await categoryFilter.selectOption({ index: 1 }); // Select first non-empty option
    await page.waitForTimeout(300);
    
    // Get final position
    const finalCategoryBox = await categoryFilter.boundingBox();
    expect(finalCategoryBox).toBeTruthy();
    
    // Category filter should maintain roughly the same position
    const horizontalDiff = Math.abs(finalCategoryBox!.x - initialCategoryBox!.x);
    expect(horizontalDiff).toBeLessThan(20); // Should stay in same horizontal position
  });

  test('clear filters button should be on its own row', async ({ page }) => {
    await page.waitForSelector('#articles-explorer-filters');
    
    // Apply a filter to make clear button visible
    const tagFilters = page.locator('[id^="tag-filter-"]');
    if (await tagFilters.count() > 0) {
      await tagFilters.first().click();
      await page.waitForTimeout(300);
      
      // Check clear button exists and has proper positioning
      const clearButton = page.locator('#clear-filters-button');
      await expect(clearButton).toBeVisible();
      
      // Clear button should be in its own container with w-full
      const clearButtonContainer = clearButton.locator('..');
      const containerClasses = await clearButtonContainer.getAttribute('class');
      expect(containerClasses).toContain('w-full');
    }
  });
});
