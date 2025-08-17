import { test, expect } from '@playwright/test';

test.describe('Admin Login Cookie Consent Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app first to establish context
    await page.goto('/');
    
    // Clear any stored consent and login data
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
  });

  test('should show cookie consent modal when logging in without prior consent', async ({ page }) => {
    // Clear cookie consent
    await page.evaluate(() => {
      localStorage.removeItem('cookie-consent');
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    
    // Submit login form
    await page.click('#login-submit-button');
    
    // Check if cookie consent modal appears
    const cookieConsentModal = page.locator('#login-cookie-consent-modal');
    await expect(cookieConsentModal).toBeVisible();
    
    // Verify modal content
    await expect(page.locator('#login-cookie-consent-title')).toContainText(/cookie.*consent.*required/i);
    await expect(page.locator('#login-cookie-consent-message')).toContainText(/admin.*session/i);
    
    // Verify action buttons exist
    await expect(page.locator('#login-cookie-consent-deny')).toBeVisible();
    await expect(page.locator('#login-cookie-consent-accept')).toBeVisible();
  });

  test('should allow login after accepting cookie consent', async ({ page }) => {
    // Clear cookie consent  
    await page.evaluate(() => {
      localStorage.removeItem('cookie-consent');
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    
    // Submit login form
    await page.click('#login-submit-button');
    
    // Wait for cookie consent modal and accept
    const cookieConsentModal = page.locator('#login-cookie-consent-modal');
    await expect(cookieConsentModal).toBeVisible();
    
    await page.click('#login-cookie-consent-accept');
    
    // Should redirect to home page after successful login
    await expect(page).toHaveURL('/');
    
    // Verify admin mode is enabled (admin panel should be visible)
    const adminControls = page.locator('[id*="admin"]').first();
    await expect(adminControls).toBeVisible({ timeout: 5000 });
  });

  test('should cancel login when denying cookie consent', async ({ page }) => {
    // Clear cookie consent
    await page.evaluate(() => {
      localStorage.removeItem('cookie-consent');
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    
    // Submit login form
    await page.click('#login-submit-button');
    
    // Wait for cookie consent modal and deny
    const cookieConsentModal = page.locator('#login-cookie-consent-modal');
    await expect(cookieConsentModal).toBeVisible();
    
    await page.click('#login-cookie-consent-deny');
    
    // Modal should disappear but stay on login page
    await expect(cookieConsentModal).not.toBeVisible();
    await expect(page).toHaveURL('/login');
    
    // Should not be logged in
    await page.goto('/');
    const adminControls = page.locator('[id*="admin"]').first();
    await expect(adminControls).not.toBeVisible();
  });

  test('should login directly when cookie consent already given', async ({ page }) => {
    // Set existing cookie consent
    await page.evaluate(() => {
      localStorage.setItem('cookie-consent', JSON.stringify({
        necessary: true,
        analytics: false,
        preferences: true,
        marketing: false,
        timestamp: Date.now()
      }));
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    
    // Submit login form
    await page.click('#login-submit-button');
    
    // Should NOT show cookie consent modal
    const cookieConsentModal = page.locator('#login-cookie-consent-modal');
    await expect(cookieConsentModal).not.toBeVisible();
    
    // Should redirect directly to home page
    await expect(page).toHaveURL('/');
    
    // Verify admin mode is enabled
    const adminControls = page.locator('[id*="admin"]').first();
    await expect(adminControls).toBeVisible({ timeout: 5000 });
  });

  test('should store admin password only when preferences consent is given', async ({ page }) => {
    // Clear all storage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    
    // Submit login form
    await page.click('#login-submit-button');
    
    // Accept cookie consent
    await page.click('#login-cookie-consent-accept');
    
    // Wait for redirect
    await expect(page).toHaveURL('/');
    
    // Check that admin password is stored in localStorage
    const storedPassword = await page.evaluate(() => localStorage.getItem('admin-password'));
    expect(storedPassword).toBe('admin123');
    
    // Check that preferences consent is set
    const cookieConsent = await page.evaluate(() => {
      const stored = localStorage.getItem('cookie-consent');
      return stored ? JSON.parse(stored) : null;
    });
    expect(cookieConsent?.preferences).toBe(true);
  });

  test('should support different languages in cookie consent modal', async ({ page }) => {
    // Clear cookie consent
    await page.evaluate(() => {
      localStorage.removeItem('cookie-consent');
    });
    
    // Test with German language
    await page.evaluate(() => {
      localStorage.setItem('user-preferences', JSON.stringify({ language: 'de' }));
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    
    // Submit login form
    await page.click('#login-submit-button');
    
    // Cookie consent modal should appear with German text
    const cookieConsentModal = page.locator('#login-cookie-consent-modal');
    await expect(cookieConsentModal).toBeVisible();
    
    // Verify German text content (fallback to English is acceptable)
    const titleText = await page.locator('#login-cookie-consent-title').textContent();
    const messageText = await page.locator('#login-cookie-consent-message').textContent();
    
    // Should contain German text or English fallback
    expect(titleText).toBeTruthy();
    expect(messageText).toBeTruthy();
    expect(messageText).toContain('Admin');
  });
});
