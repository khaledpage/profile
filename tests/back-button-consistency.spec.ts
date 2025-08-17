import { test, expect } from '@playwright/test';

test.describe('Back Button Consistency', () => {
  test.beforeEach(async ({ page }) => {
    // Set a higher timeout for tests
    test.setTimeout(30000);
    
    // Go to the home page first
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    
    // Handle cookie consent banner if present
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      const acceptButton = page.locator('#cookie-accept-button');
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await page.waitForTimeout(500); // Wait for banner to disappear
      }
    }
  });

  test('articles page back button should be consistently styled and positioned', async ({ page }) => {
    // Navigate to articles page
    await page.goto('http://localhost:3000/articles', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for dynamic content
    
    // Find the back button
    const backButton = page.locator('a[href="/"]').filter({ hasText: '← Home' });
    await expect(backButton).toBeVisible();
    
    // Check fab-nav class and positioning
    await expect(backButton).toHaveClass(/fab-nav/);
    await expect(backButton).toHaveClass(/glass/);
    await expect(backButton).toHaveClass(/back-btn/);
    
    // Check positioning styles
    const styles = await backButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        position: computed.position,
        left: computed.left,
        bottom: computed.bottom,
        zIndex: computed.zIndex
      };
    });
    
    expect(styles.position).toBe('fixed');
    expect(styles.left).toBe('16px'); // 1rem = 16px
    expect(styles.bottom).toBe('88px'); // 5.5rem = 88px
    expect(styles.zIndex).toBe('40');
    
    // Test functionality
    await backButton.click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('individual article page back button should be consistently styled', async ({ page }) => {
    // First visit articles to get a valid article
    await page.goto('http://localhost:3000/articles', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for articles to load
    
    // Find and click on the first article link
    const firstArticle = page.locator('a[href^="/articles/"]').first();
    await expect(firstArticle).toBeVisible();
    await firstArticle.click();
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Wait for dynamic content
    
    // Find the back button
    const backButton = page.locator('a[href="/articles"]').filter({ hasText: '← Articles' });
    await expect(backButton).toBeVisible();
    
    // Check fab-nav class and positioning
    await expect(backButton).toHaveClass(/fab-nav/);
    await expect(backButton).toHaveClass(/glass/);
    await expect(backButton).toHaveClass(/back-btn/);
    
    // Check positioning styles
    const styles = await backButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        position: computed.position,
        left: computed.left,
        bottom: computed.bottom,
        zIndex: computed.zIndex
      };
    });
    
    expect(styles.position).toBe('fixed');
    expect(styles.left).toBe('16px');
    expect(styles.bottom).toBe('88px');
    expect(styles.zIndex).toBe('40');
    
    // Test functionality
    await backButton.click();
    await expect(page).toHaveURL('http://localhost:3000/articles');
  });

  test('project page back button should be consistently styled', async ({ page }) => {
    // Navigate to home and look for project links
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for project links in the projects section
    const projectLink = page.locator('a[href^="/projects/"]').first();
    if (await projectLink.count() > 0) {
      await projectLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000); // Wait for page content
      
      // Find the back button
      const backButton = page.locator('a[href="/"]').filter({ hasText: /← / });
      await expect(backButton).toBeVisible();
      
      // Check fab-nav class and positioning
      await expect(backButton).toHaveClass(/fab-nav/);
      await expect(backButton).toHaveClass(/glass/);
      await expect(backButton).toHaveClass(/back-btn/);
      
      // Check positioning styles
      const styles = await backButton.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          position: computed.position,
          left: computed.left,
          bottom: computed.bottom,
          zIndex: computed.zIndex
        };
      });
      
      expect(styles.position).toBe('fixed');
      expect(styles.left).toBe('16px');
      expect(styles.bottom).toBe('88px');
      expect(styles.zIndex).toBe('40');
      
      // Test functionality
      await backButton.click();
      await expect(page).toHaveURL('http://localhost:3000/');
    }
  });

  test('admin page back button should be consistently styled', async ({ page }) => {
    // Navigate to admin page
    await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for page content
    
    // Check if we're redirected to login or if admin is available
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      console.log('Admin requires authentication, skipping admin back button test');
      return;
    }
    
    // Find the back button
    const backButton = page.locator('#back-to-site-button');
    await expect(backButton).toBeVisible();
    
    // Check fab-nav class and positioning
    await expect(backButton).toHaveClass(/fab-nav/);
    await expect(backButton).toHaveClass(/glass/);
    await expect(backButton).toHaveClass(/back-btn/);
    
    // Check positioning styles
    const styles = await backButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        position: computed.position,
        left: computed.left,
        bottom: computed.bottom,
        zIndex: computed.zIndex
      };
    });
    
    expect(styles.position).toBe('fixed');
    expect(styles.left).toBe('16px');
    expect(styles.bottom).toBe('88px');
    expect(styles.zIndex).toBe('40');
    
    // Test functionality
    await backButton.click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('all back buttons should have consistent glass styling', async ({ page }) => {
    const pagesToTest = [
      { url: 'http://localhost:3000/articles', selector: 'a[href="/"]' },
    ];
    
    for (const pageTest of pagesToTest) {
      await page.goto(pageTest.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000); // Wait for content
      
      const backButton = page.locator(pageTest.selector).filter({ hasText: /← / }).first();
      if (await backButton.count() > 0) {
        // Check glass effect styles
        const glassStyles = await backButton.evaluate((el) => {
          const computed = getComputedStyle(el);
          return {
            backdropFilter: computed.backdropFilter,
            border: computed.border,
            borderRadius: computed.borderRadius,
            backgroundColor: computed.backgroundColor
          };
        });
        
        // Verify glass styling
        expect(glassStyles.backdropFilter).toContain('blur');
        expect(glassStyles.borderRadius).toBe('16px'); // 1rem
        // Background should be semi-transparent (modern browsers use color() format)
        expect(glassStyles.backgroundColor).toMatch(/rgba?\([^)]*,\s*[0-9.]+\)|color\(srgb.*\/.*\)/);
      }
    }
  });

  test('back buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/articles', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for content
    
    const backButton = page.locator('a[href="/"]').filter({ hasText: '← Home' });
    await expect(backButton).toBeVisible();
    
    // Test keyboard focus
    await backButton.focus();
    await expect(backButton).toBeFocused();
    
    // Test keyboard activation
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('back buttons should not overlap with settings FAB', async ({ page }) => {
    await page.goto('http://localhost:3000/articles', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for content
    
    const backButton = page.locator('a[href="/"]').filter({ hasText: '← Home' });
    const settingsFab = page.locator('#theme-settings-fab');
    
    if (await settingsFab.count() > 0 && await backButton.count() > 0) {
      const backButtonBox = await backButton.boundingBox();
      const settingsFabBox = await settingsFab.boundingBox();
      
      if (backButtonBox && settingsFabBox) {
        // Back button should be on the left, settings FAB on the right
        expect(backButtonBox.x + backButtonBox.width).toBeLessThan(settingsFabBox.x);
        
        // They should not overlap vertically (with some tolerance)
        const verticalOverlap = Math.max(0, 
          Math.min(backButtonBox.y + backButtonBox.height, settingsFabBox.y + settingsFabBox.height) - 
          Math.max(backButtonBox.y, settingsFabBox.y)
        );
        expect(verticalOverlap).toBeLessThan(10); // Allow 10px tolerance
      }
    }
  });
});
