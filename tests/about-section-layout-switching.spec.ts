import { test, expect } from '@playwright/test';

test.describe('About Section Layout Switching', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Handle cookie consent if present
    const cookieDialog = page.locator('[data-testid="cookie-consent-dialog"]');
    if (await cookieDialog.isVisible()) {
      await page.click('[data-testid="cookie-consent-accept"]');
    }
  });

  test('should display basic about section by default', async ({ page }) => {
    // Check that the basic about section is visible
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    
    // Verify basic layout elements are present
    await expect(page.locator('#about h2')).toContainText('Über mich');
    
    // Check that enhanced components are not present in basic layout
    const profilePicture = page.locator('#about-profile-picture');
    await expect(profilePicture).not.toBeVisible();
  });

  test('should switch to enhanced layout through settings panel', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-panel-trigger');
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();
    
    // Wait for settings panel to open
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    
    // Navigate to appearance tab
    const appearanceTab = page.locator('#settings-tab-appearance');
    await appearanceTab.click();
    
    // Find About Layout section
    const aboutLayoutSection = page.locator('text=About Section Layout').locator('..');
    await expect(aboutLayoutSection).toBeVisible();
    
    // Click on enhanced layout option
    const enhancedOption = page.locator('button:has-text("Enhanced")');
    await enhancedOption.click();
    
    // Close settings panel
    const closeButton = page.locator('#settings-panel-close');
    await closeButton.click();
    
    // Wait a moment for the preference to be applied
    await page.waitForTimeout(500);
    
    // Verify enhanced layout is now active
    const profilePicture = page.locator('#about-profile-picture');
    await expect(profilePicture).toBeVisible();
    
    // Check enhanced layout specific elements
    const statsGrid = page.locator('#about-stats-grid');
    await expect(statsGrid).toBeVisible();
    
    const timeline = page.locator('#about-timeline');
    await expect(timeline).toBeVisible();
  });

  test('should persist layout choice across page reloads', async ({ page }) => {
    // Switch to enhanced layout first
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    await page.locator('button:has-text("Enhanced")').click();
    await page.locator('#settings-panel-close').click();
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Handle cookie consent again if needed
    const cookieDialog = page.locator('[data-testid="cookie-consent-dialog"]');
    if (await cookieDialog.isVisible()) {
      await page.click('[data-testid="cookie-consent-accept"]');
    }
    
    // Verify enhanced layout is still active
    const profilePicture = page.locator('#about-profile-picture');
    await expect(profilePicture).toBeVisible();
  });

  test('should switch back to basic layout', async ({ page }) => {
    // First switch to enhanced layout
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    await page.locator('button:has-text("Enhanced")').click();
    
    // Verify enhanced is active
    await page.locator('#settings-panel-close').click();
    await page.waitForTimeout(500);
    const profilePictureEnhanced = page.locator('#about-profile-picture');
    await expect(profilePictureEnhanced).toBeVisible();
    
    // Now switch back to basic
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    await page.locator('button:has-text("Basic")').click();
    await page.locator('#settings-panel-close').click();
    
    // Wait for change to apply
    await page.waitForTimeout(500);
    
    // Verify basic layout is now active
    const profilePictureBasic = page.locator('#about-profile-picture');
    await expect(profilePictureBasic).not.toBeVisible();
    
    // Check that basic about section text is visible
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
  });

  test('should show correct layout descriptions in settings', async ({ page }) => {
    // Open settings panel
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    
    // Check basic layout description
    const basicButton = page.locator('button:has-text("Basic")');
    await expect(basicButton).toBeVisible();
    await expect(page.locator('text=Simple text-based about section')).toBeVisible();
    
    // Check enhanced layout description
    const enhancedButton = page.locator('button:has-text("Enhanced")');
    await expect(enhancedButton).toBeVisible();
    await expect(page.locator('text=Rich layout with profile picture and timeline')).toBeVisible();
  });

  test('should highlight selected layout option', async ({ page }) => {
    // Open settings panel
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    
    // Check that one option is highlighted by default (should be basic or config default)
    const basicButton = page.locator('button:has-text("Basic")');
    const enhancedButton = page.locator('button:has-text("Enhanced")');
    
    // At least one should have the selected styling (ring-2 ring-accent-1)
    const selectedButtons = page.locator('button:has([class*="ring-2"])');
    await expect(selectedButtons).toHaveCount(1);
    
    // Click enhanced option
    await enhancedButton.click();
    
    // Verify enhanced is now highlighted
    await expect(enhancedButton).toHaveClass(/ring-2/);
  });

  test('should display profile picture with proper styling in enhanced layout', async ({ page }) => {
    // Switch to enhanced layout
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    await page.locator('button:has-text("Enhanced")').click();
    await page.locator('#settings-panel-close').click();
    await page.waitForTimeout(500);
    
    // Check profile picture styling
    const profilePicture = page.locator('#about-profile-picture');
    await expect(profilePicture).toBeVisible();
    
    // Verify the image source is correct
    const profileImg = page.locator('#about-profile-picture img');
    await expect(profileImg).toHaveAttribute('src', /csm_Khaled_Alabsi_Portraet/);
    await expect(profileImg).toHaveAttribute('alt', 'Khaled Alabsi');
    
    // Check that decorative elements are present
    const decorativeElements = page.locator('#about-profile-picture .absolute');
    await expect(decorativeElements.first()).toBeVisible();
  });

  test('should display stats grid and timeline in enhanced layout', async ({ page }) => {
    // Switch to enhanced layout
    await page.locator('#settings-panel-trigger').click();
    await page.waitForSelector('#settings-panel-content', { state: 'visible' });
    await page.locator('#settings-tab-appearance').click();
    await page.locator('button:has-text("Enhanced")').click();
    await page.locator('#settings-panel-close').click();
    await page.waitForTimeout(500);
    
    // Check stats grid
    const statsGrid = page.locator('#about-stats-grid');
    await expect(statsGrid).toBeVisible();
    
    // Verify stats content
    await expect(page.locator('text=5+ Jahre')).toBeVisible(); // Experience
    await expect(page.locator('text=Next.js, TS')).toBeVisible(); // Tech Focus
    await expect(page.locator('text=40+')).toBeVisible(); // Projects
    await expect(page.locator('text=Remote')).toBeVisible(); // Location
    
    // Check timeline
    const timeline = page.locator('#about-timeline');
    await expect(timeline).toBeVisible();
    
    // Verify timeline content
    await expect(page.locator('text=Informatik Studium')).toBeVisible();
    await expect(page.locator('text=Full-Stack Entwickler')).toBeVisible();
  });

});
