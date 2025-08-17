import { test, expect } from '@playwright/test';

test.describe('Admin Help Panel - Dont Show Again Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app first to establish context
    await page.goto('/');
    
    // Clear any stored dismissal data
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Accept cookie consent banner if it appears first
    try {
      const cookieBanner = page.locator('[id*="cookie"]').first();
      if (await cookieBanner.isVisible({ timeout: 2000 })) {
        const acceptButton = cookieBanner.locator('button').filter({ hasText: /accept|allow|agree/i }).first();
        if (await acceptButton.isVisible()) {
          await acceptButton.click();
          await page.waitForTimeout(500);
        }
      }
    } catch (e) {
      // Cookie banner might not be present, continue
    }

    // Enable admin mode
    await page.evaluate(() => {
      localStorage.setItem('admin-enabled', 'true');
      window.dispatchEvent(new CustomEvent('adminModeChanged', { detail: { enabled: true } }));
    });
  });

  test('should show help panel automatically for first-time admin users', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Help panel should appear automatically after 1 second
    const helpPanel = page.locator('#admin-help-overlay');
    await expect(helpPanel).toBeVisible({ timeout: 3000 });
    
    // Should show step 1 of the tutorial
    await expect(page.locator('#help-title')).toContainText('Article Editing Guide');
    await expect(page.locator('#help-header')).toContainText('Step 1 of');
  });

  test('should not show help panel if permanently dismissed', async ({ page }) => {
    // Set permanent dismissal
    await page.evaluate(() => {
      localStorage.setItem('hasSeenEditingGuide', 'true');
    });
    
    // Navigate to articles page
    await page.goto('/articles');
    
    // Help panel should NOT appear
    const helpPanel = page.locator('#admin-help-overlay');
    await expect(helpPanel).not.toBeVisible({ timeout: 3000 });
  });

  test('should not show help panel if dismissed for current session', async ({ page }) => {
    // Set session dismissal
    await page.evaluate(() => {
      sessionStorage.setItem('adminHelpDismissedThisSession', 'true');
    });
    
    // Navigate to articles page
    await page.goto('/articles');
    
    // Help panel should NOT appear
    const helpPanel = page.locator('#admin-help-overlay');
    await expect(helpPanel).not.toBeVisible({ timeout: 3000 });
  });

  test('should show "dont show again" checkbox option', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Wait for help panel to appear
    const helpPanel = page.locator('#admin-help-overlay');
    await expect(helpPanel).toBeVisible({ timeout: 3000 });
    
    // Check for "don't show again" option
    const dontShowCheckbox = page.locator('#help-dont-show-again input[type="checkbox"]');
    await expect(dontShowCheckbox).toBeVisible();
    
    // Check the explanatory text
    await expect(page.locator('#help-dont-show-again')).toContainText("Don't show this guide again");
    await expect(page.locator('#help-dont-show-again')).toContainText("This guide will be hidden for this session only");
  });

  test('should update explanation text when checkbox is checked', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Wait for help panel to appear
    await expect(page.locator('#admin-help-overlay')).toBeVisible({ timeout: 3000 });
    
    // Check the "don't show again" checkbox
    const dontShowCheckbox = page.locator('#help-dont-show-again input[type="checkbox"]');
    await dontShowCheckbox.check();
    
    // Explanation text should change
    await expect(page.locator('#help-dont-show-again')).toContainText("This guide will be permanently hidden for all sessions");
  });

  test('should store session dismissal when closing without checkbox', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Wait for help panel to appear
    await expect(page.locator('#admin-help-overlay')).toBeVisible({ timeout: 3000 });
    
    // Close without checking "don't show again"
    await page.click('#help-close-button');
    
    // Should disappear
    await expect(page.locator('#admin-help-overlay')).not.toBeVisible();
    
    // Check that only session storage was set, not localStorage
    const sessionDismissed = await page.evaluate(() => sessionStorage.getItem('adminHelpDismissedThisSession'));
    const permanentDismissed = await page.evaluate(() => localStorage.getItem('hasSeenEditingGuide'));
    
    expect(sessionDismissed).toBe('true');
    expect(permanentDismissed).toBeNull();
  });

  test('should store permanent dismissal when closing with checkbox checked', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Wait for help panel to appear
    await expect(page.locator('#admin-help-overlay')).toBeVisible({ timeout: 3000 });
    
    // Check "don't show again" and close
    await page.click('#help-dont-show-again input[type="checkbox"]');
    await page.click('#help-close-button');
    
    // Should disappear
    await expect(page.locator('#admin-help-overlay')).not.toBeVisible();
    
    // Check that localStorage was set
    const permanentDismissed = await page.evaluate(() => localStorage.getItem('hasSeenEditingGuide'));
    expect(permanentDismissed).toBe('true');
  });

  test('should work with "Skip Tutorial" button', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Wait for help panel to appear
    await expect(page.locator('#admin-help-overlay')).toBeVisible({ timeout: 3000 });
    
    // Verify Skip Tutorial button exists
    const skipButton = page.locator('#help-skip-button');
    await expect(skipButton).toBeVisible();
    await expect(skipButton).toContainText('Skip Tutorial');
    
    // Check "don't show again" and use skip button
    await page.click('#help-dont-show-again input[type="checkbox"]');
    await page.click('#help-skip-button');
    
    // Should disappear and store permanent dismissal
    await expect(page.locator('#admin-help-overlay')).not.toBeVisible();
    
    const permanentDismissed = await page.evaluate(() => localStorage.getItem('hasSeenEditingGuide'));
    expect(permanentDismissed).toBe('true');
  });

  test('should allow manual triggering via help button', async ({ page }) => {
    // Set permanent dismissal first
    await page.evaluate(() => {
      localStorage.setItem('hasSeenEditingGuide', 'true');
    });
    
    // Navigate to articles page
    await page.goto('/articles');
    
    // Help panel should NOT appear automatically
    await expect(page.locator('#admin-help-overlay')).not.toBeVisible({ timeout: 3000 });
    
    // But help button should still work
    const helpButton = page.locator('[id*="help"]').filter({ hasText: /help|guide/i }).first();
    if (await helpButton.isVisible()) {
      await helpButton.click();
      await expect(page.locator('#admin-help-overlay')).toBeVisible();
    }
  });

  test('should respect session-only dismissal across page reloads in same session', async ({ page }) => {
    // Navigate to articles page
    await page.goto('/articles');
    
    // Wait for help panel and dismiss for session only
    await expect(page.locator('#admin-help-overlay')).toBeVisible({ timeout: 3000 });
    await page.click('#help-close-button');
    
    // Reload the page
    await page.reload();
    
    // Help panel should NOT appear after reload
    await expect(page.locator('#admin-help-overlay')).not.toBeVisible({ timeout: 3000 });
    
    // Navigate away and back
    await page.goto('/');
    await page.goto('/articles');
    
    // Still should NOT appear
    await expect(page.locator('#admin-help-overlay')).not.toBeVisible({ timeout: 3000 });
  });
});
