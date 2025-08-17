import { test, expect } from '@playwright/test';

test.describe('Settings Panel Border Fix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle cookie consent if present
    const acceptCookiesButton = page.locator('#accept-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('theme selection grids should have adequate padding to prevent border cutoff', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();

    // Wait for settings panel to open
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Check that theme grid containers have padding
    const themeGrids = page.locator('[id^="theme-grid-"]');
    const firstGrid = themeGrids.first();
    await expect(firstGrid).toBeVisible();

    // Verify grid has padding class
    await expect(firstGrid).toHaveClass(/p-1/);

    // Check that theme buttons exist and are properly styled
    const themeButtons = page.locator('[id^="theme-option-"]');
    const firstButton = themeButtons.first();
    await expect(firstButton).toBeVisible();

    // Check button positioning and spacing
    const buttonBox = await firstButton.boundingBox();
    const gridBox = await firstGrid.boundingBox();
    
    if (buttonBox && gridBox) {
      // Button should not be at the very edge of the grid (padding should create space)
      expect(buttonBox.x).toBeGreaterThan(gridBox.x);
    }
  });

  test('skills layout grid should have adequate padding', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Check if skills layout section exists (it might be conditionally rendered)
    const skillsLayoutSection = page.locator('text=Skills Layout').locator('..');
    if (await skillsLayoutSection.isVisible()) {
      const skillsGrid = skillsLayoutSection.locator('div').filter({ hasText: /grid/ }).first();
      
      // Verify the skills grid has proper padding
      await expect(skillsGrid).toHaveClass(/p-1/);
      
      // Check skills buttons
      const skillsButtons = skillsGrid.locator('button');
      if (await skillsButtons.count() > 0) {
        const firstSkillButton = skillsButtons.first();
        const buttonBox = await firstSkillButton.boundingBox();
        const gridBox = await skillsGrid.boundingBox();
        
        if (buttonBox && gridBox) {
          // Button should not be at the very edge of the grid
          expect(buttonBox.x).toBeGreaterThan(gridBox.x);
        }
      }
    }
  });

  test('language selection grid should have adequate padding', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Navigate to behavior tab (where language might be)
    const behaviorTab = page.locator('#settings-tab-behavior');
    if (await behaviorTab.isVisible()) {
      await behaviorTab.click();
      
      // Check if language section exists
      const languageSection = page.locator('text=Language').locator('..');
      if (await languageSection.isVisible()) {
        const languageGrid = languageSection.locator('div').filter({ hasText: /grid/ }).first();
        
        // Verify the language grid has proper padding
        await expect(languageGrid).toHaveClass(/p-1/);
        
        // Check language buttons
        const languageButtons = languageGrid.locator('button');
        if (await languageButtons.count() > 0) {
          const firstLangButton = languageButtons.first();
          const buttonBox = await firstLangButton.boundingBox();
          const gridBox = await languageGrid.boundingBox();
          
          if (buttonBox && gridBox) {
            // Button should not be at the very edge of the grid
            expect(buttonBox.x).toBeGreaterThan(gridBox.x);
          }
        }
      }
    }
  });

  test('selected theme should display border without being cut off', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Find and click on a theme option
    const themeButtons = page.locator('[id^="theme-option-"]');
    const secondButton = themeButtons.nth(1); // Click second theme to see selection
    await secondButton.click();

    // Check that the selected theme has proper styling
    await expect(secondButton).toHaveClass(/ring-2/);
    await expect(secondButton).toHaveClass(/ring-accent-1/);

    // The button should be fully visible and not clipped
    const buttonBox = await secondButton.boundingBox();
    expect(buttonBox).toBeTruthy();
    
    if (buttonBox) {
      // Button should have reasonable dimensions (not clipped)
      expect(buttonBox.width).toBeGreaterThan(50);
      expect(buttonBox.height).toBeGreaterThan(30);
    }
  });
});
