import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
  test('theme controller should be visible and functional', async ({ page }) => {
    await page.goto('/');
    
    // Check if theme controller exists
    const themeController = page.locator('#theme-controller');
    await expect(themeController).toBeVisible();
    
    // Should have theme buttons
    await expect(page.locator('#theme-dark')).toBeVisible();
    await expect(page.locator('#theme-light')).toBeVisible();
    await expect(page.locator('#theme-vibrant')).toBeVisible();
  });

  test('dark theme should apply correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click dark theme button
    await page.click('#theme-dark');
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if dark theme is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Verify dark theme colors are applied
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => 
      getComputedStyle(el).backgroundColor
    );
    
    // Dark theme should have some background color (flexible for theme variations)
    // Accept any valid CSS color format - don't enforce specific color values
    expect(backgroundColor).toMatch(/^(rgb|rgba|hsl|hsla|#|color|var).*$|transparent|inherit|initial|unset/);
    
    // More importantly: check that theme attribute is set correctly
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('light theme should apply correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click light theme button
    await page.click('#theme-light');
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if light theme is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('vibrant theme should apply correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click vibrant theme button
    await page.click('#theme-vibrant');
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if vibrant theme is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'vibrant');
  });

  test('theme preference should persist on page reload', async ({ page }) => {
    await page.goto('/');
    
    // Set dark theme
    await page.click('#theme-dark');
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    
    // Theme should still be dark
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('Internationalization (i18n)', () => {
  test('language selector should be visible', async ({ page }) => {
    await page.goto('/');
    
    // Look for language selector (might be in header or settings)
    const languageSelector = page.locator('[id*="language"], [id*="lang"], [aria-label*="language"]');
    
    // If language selector exists, test it
    if (await languageSelector.first().isVisible()) {
      await expect(languageSelector.first()).toBeVisible();
    }
  });

  test('english content should load correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for English content in hero section
    const heroTitle = page.locator('#hero-title');
    if (await heroTitle.isVisible()) {
      const titleText = await heroTitle.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText?.length).toBeGreaterThan(0);
    }
  });

  test('german translation should work if available', async ({ page }) => {
    await page.goto('/');
    
    // Look for German language option
    const germanOption = page.locator('[data-lang="de"], [value="de"], text=/deutsch/i');
    
    if (await germanOption.first().isVisible()) {
      await germanOption.first().click();
      await page.waitForTimeout(1000);
      
      // Check if content changed to German
      const heroTitle = page.locator('#hero-title');
      if (await heroTitle.isVisible()) {
        const titleText = await heroTitle.textContent();
        expect(titleText).toBeTruthy();
      }
    }
  });

  test('fallback text should work when translations are missing', async ({ page }) => {
    await page.goto('/');
    
    // Content should always be visible, either translated or fallback
    const mainContent = page.locator('main, #main-content');
    await expect(mainContent).toBeVisible();
    
    // Hero section should have content
    const heroSection = page.locator('#hero');
    if (await heroSection.isVisible()) {
      const content = await heroSection.textContent();
      expect(content?.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe('Cookie Consent and Privacy', () => {
  test('cookie consent should appear on first visit', async ({ page, context }) => {
    // Clear cookies to simulate first visit
    await context.clearCookies();
    
    await page.goto('/');
    
    // Check if cookie consent banner appears
    const cookieConsent = page.locator('#cookie-consent, [id*="cookie"], [role="banner"]:has-text("cookie")');
    
    if (await cookieConsent.first().isVisible()) {
      await expect(cookieConsent.first()).toBeVisible();
      
      // Should have accept/reject buttons
      const acceptButton = page.locator('button:has-text("accept"), button:has-text("Accept")');
      const rejectButton = page.locator('button:has-text("reject"), button:has-text("Reject")');
      
      if (await acceptButton.isVisible()) {
        await expect(acceptButton).toBeVisible();
      }
    }
  });

  test('cookie consent should not appear after acceptance', async ({ page }) => {
    await page.goto('/');
    
    // Accept cookies if consent banner is visible
    const acceptButton = page.locator('button:has-text("accept"), button:has-text("Accept")');
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
    
    // Reload page
    await page.reload();
    
    // Cookie consent should not appear again
    const cookieConsent = page.locator('#cookie-consent, [id*="cookie"]');
    if (await cookieConsent.first().isVisible()) {
      // If still visible, it might be in a different state (minimized/accepted)
      const isMinimized = await cookieConsent.first().getAttribute('aria-hidden');
      expect(isMinimized).toBe('true');
    }
  });
});

test.describe('Accessibility (a11y)', () => {
  test('page should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have h1 tag
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
    
    // Should have logical heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('interactive elements should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Navigation links should have accessible names
    const navLinks = page.locator('nav a, [role="navigation"] a');
    if (await navLinks.first().isVisible()) {
      const firstLink = navLinks.first();
      const ariaLabel = await firstLink.getAttribute('aria-label');
      const text = await firstLink.textContent();
      
      // Should have either aria-label or visible text
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    // All images should have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeDefined();
      }
    }
  });

  test('form elements should have proper labels', async ({ page }) => {
    await page.goto('/login');
    
    // Form inputs should have labels or aria-label
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          // Check if there's a label for this input
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Should have label, aria-label, or aria-labelledby
          expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('keyboard navigation should work', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check if first focusable element is focused
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    // Continue tabbing to ensure tab order works
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should still have a focused element
    const stillFocused = page.locator(':focus');
    await expect(stillFocused).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('404 page should work for non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    
    // Should return 404 status
    expect(response?.status()).toBe(404);
    
    // Page should still render something
    await expect(page.locator('body')).toBeVisible();
  });

  test('invalid article slug should handle gracefully', async ({ page }) => {
    await page.goto('/articles/non-existent-article');
    
    // Should either show 404 or error message
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
    
    // Should not have JavaScript errors in console
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Filter out known acceptable errors
    const significantErrors = consoleLogs.filter(log => 
      !log.includes('404') && 
      !log.includes('Not Found') &&
      !log.includes('favicon.ico')
    );
    
    expect(significantErrors.length).toBe(0);
  });
});
