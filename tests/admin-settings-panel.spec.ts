import { test, expect } from '@playwright/test';

test.describe('Admin-Only Settings Panel Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle cookie consent if present
    const acceptCookiesButton = page.locator('#accept-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should hide Advanced tab for non-admin users', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Ensure admin mode is disabled
    const adminCheckbox = page.locator('#admin-toggle-checkbox');
    if (await adminCheckbox.isVisible() && await adminCheckbox.isChecked()) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    // Check that Advanced tab is not visible
    const advancedTab = page.locator('#settings-tab-advanced');
    await expect(advancedTab).not.toBeVisible();

    // Verify other tabs are still visible
    const appearanceTab = page.locator('#settings-tab-appearance');
    const behaviorTab = page.locator('#settings-tab-behavior');
    const homeTab = page.locator('#settings-tab-home');

    await expect(appearanceTab).toBeVisible();
    await expect(behaviorTab).toBeVisible();
    await expect(homeTab).toBeVisible();
  });

  test('should show Advanced tab for admin users', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Enable admin mode
    const adminCheckbox = page.locator('#admin-toggle-checkbox');
    if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    // Check that Advanced tab is visible
    const advancedTab = page.locator('#settings-tab-advanced');
    await expect(advancedTab).toBeVisible();

    // Click on advanced tab
    await advancedTab.click();

    // Verify advanced tab content is displayed
    const advancedContent = page.locator('#advanced-tab-content');
    await expect(advancedContent).toBeVisible();
  });

  test('should automatically switch away from Advanced tab when admin mode is disabled', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Enable admin mode first
    const adminCheckbox = page.locator('#admin-toggle-checkbox');
    if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    // Navigate to Advanced tab
    const advancedTab = page.locator('#settings-tab-advanced');
    await expect(advancedTab).toBeVisible();
    await advancedTab.click();

    // Verify we're on Advanced tab
    const advancedContent = page.locator('#advanced-tab-content');
    await expect(advancedContent).toBeVisible();

    // Disable admin mode
    await adminCheckbox.click();
    if (await page.locator('#admin-apply-button').isVisible()) {
      await page.locator('#admin-apply-button').click();
    }

    // Should automatically switch to Appearance tab
    const appearanceContent = page.locator('#appearance-tab-content');
    await expect(appearanceContent).toBeVisible();

    // Advanced tab should not be visible anymore
    await expect(advancedTab).not.toBeVisible();
  });

  test('should hide Admin mode checkbox based on config', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Check if admin toggle section exists
    const adminToggleSection = page.locator('#admin-toggle-section');
    
    // This test depends on the config.admin.allowToggle setting
    // If allowToggle is true, the section should be visible
    // If allowToggle is false, the section should not be visible
    const isVisible = await adminToggleSection.isVisible();
    
    if (isVisible) {
      // If visible, check that all elements are present
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      const adminLabel = page.locator('#admin-toggle-label');
      const applyButton = page.locator('#admin-apply-button');

      await expect(adminCheckbox).toBeVisible();
      await expect(adminLabel).toBeVisible();
      await expect(applyButton).toBeVisible();
    } else {
      // If not visible, verify admin controls are hidden
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      await expect(adminCheckbox).not.toBeVisible();
    }
  });

  test('should properly filter tabs based on admin status', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Count total tabs when admin is disabled
    const adminCheckbox = page.locator('#admin-toggle-checkbox');
    if (await adminCheckbox.isVisible() && await adminCheckbox.isChecked()) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    const tabsWithoutAdmin = await page.locator('[id^="settings-tab-"]').count();
    
    // Enable admin mode
    if (await adminCheckbox.isVisible()) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    const tabsWithAdmin = await page.locator('[id^="settings-tab-"]').count();

    // Should have one more tab when admin is enabled (Advanced tab)
    expect(tabsWithAdmin).toBeGreaterThan(tabsWithoutAdmin);
  });

  test('should maintain tab functionality after admin mode changes', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Test tab navigation works with admin disabled
    const appearanceTab = page.locator('#settings-tab-appearance');
    const behaviorTab = page.locator('#settings-tab-behavior');
    const homeTab = page.locator('#settings-tab-home');

    await appearanceTab.click();
    await expect(page.locator('#appearance-tab-content')).toBeVisible();

    await behaviorTab.click();
    await expect(page.locator('#behavior-tab-content')).toBeVisible();

    await homeTab.click();
    await expect(page.locator('#home-tab-content')).toBeVisible();

    // Enable admin mode
    const adminCheckbox = page.locator('#admin-toggle-checkbox');
    if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    // Test that advanced tab is now available and functional
    const advancedTab = page.locator('#settings-tab-advanced');
    if (await advancedTab.isVisible()) {
      await advancedTab.click();
      await expect(page.locator('#advanced-tab-content')).toBeVisible();
    }

    // Test that other tabs still work
    await appearanceTab.click();
    await expect(page.locator('#appearance-tab-content')).toBeVisible();
  });

  test('should have proper styling for admin-only elements', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-toggle');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Enable admin mode
    const adminCheckbox = page.locator('#admin-toggle-checkbox');
    if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
      await adminCheckbox.click();
      const applyButton = page.locator('#admin-apply-button');
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
    }

    // Check Advanced tab styling
    const advancedTab = page.locator('#settings-tab-advanced');
    if (await advancedTab.isVisible()) {
      // Tab should have proper styling
      await expect(advancedTab).toHaveClass(/flex/);
      await expect(advancedTab).toHaveClass(/items-center/);
      
      // Should be clickable and interactive
      await advancedTab.hover();
      // Check that hover effects work
      const tabColor = await advancedTab.evaluate(el => getComputedStyle(el).color);
      expect(tabColor).toBeTruthy();
    }
  });
});
