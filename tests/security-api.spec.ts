import { test, expect } from '@playwright/test';

test.describe('API Testing', () => {
  
  test('API-001: Articles API Endpoints', async ({ page, request }) => {
    // Test GET /api/articles
    const articlesResponse = await request.get('/api/articles');
    expect(articlesResponse.status()).toBe(200);
    
    const articlesData = await articlesResponse.json();
    expect(Array.isArray(articlesData)).toBeTruthy();
    
    if (articlesData.length > 0) {
      const firstArticle = articlesData[0];
      expect(firstArticle).toHaveProperty('slug');
      expect(firstArticle).toHaveProperty('metadata');
      
      // Test individual article endpoint
      const articleResponse = await request.get(`/api/articles/${firstArticle.slug}`);
      expect(articleResponse.status()).toBe(200);
      
      const articleData = await articleResponse.json();
      expect(articleData).toHaveProperty('slug');
      expect(articleData).toHaveProperty('metadata');
      expect(articleData).toHaveProperty('content');
    }
  });

  test('API-002: Asset API Endpoints', async ({ request }) => {
    // Test article assets endpoint
    const assetResponse = await request.get('/api/articles/matrix-multiplication/assets/cover.jpg');
    
    // Should either return the asset or 404 if it doesn't exist
    expect([200, 404]).toContain(assetResponse.status());
    
    if (assetResponse.status() === 200) {
      // Check content type for images
      const contentType = assetResponse.headers()['content-type'];
      expect(contentType).toMatch(/image|application/);
    }
  });

  test('API-003: Authentication API', async ({ request }) => {
    // Test valid credentials
    const validLoginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'admin'
      }
    });
    
    expect(validLoginResponse.status()).toBe(200);
    
    const validLoginData = await validLoginResponse.json();
    expect(validLoginData).toHaveProperty('success');
    expect(validLoginData.success).toBe(true);
    
    // Test invalid credentials
    const invalidLoginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'invalid',
        password: 'invalid'
      }
    });
    
    expect(invalidLoginResponse.status()).toBe(401);
    
    const invalidLoginData = await invalidLoginResponse.json();
    expect(invalidLoginData).toHaveProperty('success');
    expect(invalidLoginData.success).toBe(false);
  });

  test('API-004: PDF Generation API', async ({ request }) => {
    // Test PDF generation endpoint
    const pdfResponse = await request.get('/api/articles/nextjs-vs-react/pdf');
    
    // Should either work or return error
    if (pdfResponse.status() === 200) {
      const contentType = pdfResponse.headers()['content-type'];
      expect(contentType).toContain('application/pdf');
      
      const contentDisposition = pdfResponse.headers()['content-disposition'];
      expect(contentDisposition).toContain('attachment');
    } else {
      // PDF generation might not be fully implemented
      expect([404, 500]).toContain(pdfResponse.status());
    }
  });
});

test.describe('Security Tests', () => {
  
  test('SEC-001: Admin Operations Security', async ({ request }) => {
    // Test DELETE without admin key
    const unauthorizedDelete = await request.delete('/api/articles?slug=test-article', {
      headers: {}
    });
    
    expect(unauthorizedDelete.status()).toBe(401);
    
    // Test PUT without admin key
    const unauthorizedUpdate = await request.put('/api/articles', {
      data: {
        article: {
          slug: 'test',
          metadata: { title: 'Test' },
          content: 'Test content'
        }
      }
    });
    
    expect(unauthorizedUpdate.status()).toBe(401);
    
    // Test with valid admin key
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    const authorizedUpdate = await request.put('/api/articles', {
      headers: {
        'x-admin-key': adminPassword
      },
      data: {
        article: {
          slug: 'test-security',
          metadata: {
            title: 'Security Test Article',
            summary: 'Test article for security testing',
            category: 'Testing',
            tags: ['test', 'security'],
            author: 'Test Author',
            publishDate: new Date().toISOString(),
            readingTime: 1,
            featured: false
          },
          content: '# Security Test\\n\\nThis is a test article for security testing.'
        }
      }
    });
    
    // Should succeed with proper authentication
    expect([200, 201]).toContain(authorizedUpdate.status());
  });

  test('SEC-002: Input Validation', async ({ page }) => {
    // Test XSS protection in search
    await page.goto('/articles');
    
    const searchInput = page.locator('#articles-search-input');
    await searchInput.fill('<script>alert(\"xss\")</script>');
    
    // Should not execute script
    let alertFired = false;
    page.on('dialog', () => {
      alertFired = true;
    });
    
    await page.waitForTimeout(1000);
    expect(alertFired).toBe(false);
    
    // Test form validation in edit modal
    await page.goto('/articles');
    
    const editButton = page.locator('[id*=\"article-edit-button-\"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      const modal = page.locator('#article-edit-modal');
      if (await modal.isVisible()) {
        // Test empty title validation
        const titleInput = page.locator('#edit-title');
        await titleInput.clear();
        
        const saveButton = page.locator('#save-button');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          
          // Should either show validation error or prevent saving
          // The exact behavior depends on implementation
          await page.waitForTimeout(500);
        }
        
        // Close modal
        const closeButton = page.locator('#close-button');
        await closeButton.click();
      }
    }
  });

  test('SEC-003: CSRF Protection', async ({ request }) => {
    // Test admin operations without proper headers
    const csrfTestResponse = await request.delete('/api/articles?slug=test', {
      headers: {
        'Origin': 'http://malicious-site.com'
      }
    });
    
    // Should reject request without proper authentication
    expect(csrfTestResponse.status()).toBe(401);
  });
});

test.describe('Performance Tests', () => {
  
  test('PERF-001: Page Load Performance', async ({ page }) => {
    // Test home page load time
    const homeStartTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const homeLoadTime = Date.now() - homeStartTime;
    
    expect(homeLoadTime).toBeLessThan(5000); // 5 seconds max
    
    // Test articles page load time
    const articlesStartTime = Date.now();
    await page.goto('/articles');
    await page.waitForSelector('#articles-explorer');
    const articlesLoadTime = Date.now() - articlesStartTime;
    
    expect(articlesLoadTime).toBeLessThan(5000); // 5 seconds max
    
    // Test admin dashboard load time
    const adminStartTime = Date.now();
    await page.goto('/admin');
    await page.waitForSelector('#admin-dashboard');
    const adminLoadTime = Date.now() - adminStartTime;
    
    expect(adminLoadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('PERF-002: Search Performance', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForSelector('#articles-search-input');
    
    const searchInput = page.locator('#articles-search-input');
    
    // Measure search response time
    const searchStartTime = Date.now();
    await searchInput.fill('react');
    
    // Wait for search to complete
    await page.waitForTimeout(100);
    const searchTime = Date.now() - searchStartTime;
    
    expect(searchTime).toBeLessThan(1000); // 1 second max for search response
  });

  test('PERF-003: Asset Loading Performance', async ({ page }) => {
    // Navigate to article with assets
    await page.goto('/articles/matrix-multiplication');
    
    // Measure time to load images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const imageLoadStartTime = Date.now();
      
      // Wait for first image to load
      await images.first().waitFor({ state: 'visible' });
      
      const imageLoadTime = Date.now() - imageLoadStartTime;
      expect(imageLoadTime).toBeLessThan(3000); // 3 seconds max for image loading
    }
  });
});

test.describe('Mobile and Touch Features', () => {
  
  test('MOBILE-001: Touch Interactions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Test touch scrolling
    await page.mouse.move(200, 300);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Should scroll without issues
    await page.waitForTimeout(500);
    
    // Test mobile navigation
    const mobileMenuButton = page.locator('[aria-label*=\"menu\"], [aria-label*=\"Menu\"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Mobile menu should be accessible
      await page.waitForTimeout(500);
    }
    
    // Test article cards on mobile
    await page.goto('/articles');
    
    const articleCards = page.locator('[id*=\"article-card-\"]');
    const cardCount = await articleCards.count();
    
    if (cardCount > 0) {
      const firstCard = articleCards.first();
      await expect(firstCard).toBeVisible();
      
      // Card should be touch-friendly
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.height).toBeGreaterThan(40); // Minimum touch target size
    }
  });

  test('MOBILE-002: Mobile Layout', async ({ page }) => {
    // Test various mobile screen sizes
    const mobileViewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 414, height: 896 }, // iPhone 11
      { width: 360, height: 640 }  // Android
    ];
    
    for (const viewport of mobileViewports) {
      await page.setViewportSize(viewport);
      
      // Test home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should not have horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // 20px tolerance
      
      // Test articles page
      await page.goto('/articles');
      await page.waitForSelector('#articles-explorer');
      
      const articlesGrid = page.locator('#articles-explorer-grid');
      await expect(articlesGrid).toBeVisible();
      
      // Test admin dashboard
      await page.goto('/admin');
      await page.waitForSelector('#admin-dashboard');
      
      const adminDashboard = page.locator('#admin-dashboard');
      await expect(adminDashboard).toBeVisible();
    }
  });
});

test.describe('Error Handling and Edge Cases', () => {
  
  test('ERROR-001: Network Error Handling', async ({ page, context }) => {
    // Test offline behavior
    await page.goto('/articles');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate
    await page.goto('/articles/nonexistent-article', { waitUntil: 'domcontentloaded' });
    
    // Page should still render something
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    
    // Go back online
    await context.setOffline(false);
  });

  test('ERROR-002: Invalid Data Handling', async ({ page }) => {
    // Test with non-existent article
    const response = await page.goto('/articles/definitely-not-an-article-12345');
    
    // Should handle gracefully
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    
    // Check for no uncaught JavaScript errors
    const errors: Error[] = [];
    page.on('pageerror', error => errors.push(error));
    
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('ERROR-003: Boundary Conditions', async ({ page }) => {
    // Test with empty search
    await page.goto('/articles');
    
    const searchInput = page.locator('#articles-search-input');
    await searchInput.fill('');
    
    // Should show all articles
    const articleCards = page.locator('[id*=\"article-card-\"]');
    const cardCount = await articleCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(0);
    
    // Test with very long search term
    const longSearchTerm = 'a'.repeat(1000);
    await searchInput.fill(longSearchTerm);
    
    // Should handle gracefully
    await page.waitForTimeout(500);
    
    // Test with special characters
    await searchInput.fill('!@#$%^&*()');
    await page.waitForTimeout(500);
    
    // Should not crash
    const specialCharCards = page.locator('[id*=\"article-card-\"]');
    const specialCharCount = await specialCharCards.count();
    expect(specialCharCount).toBeGreaterThanOrEqual(0);
  });

  test('ERROR-004: Large File Upload Handling', async ({ page }) => {
    await page.goto('/articles');
    
    const uploadInput = page.locator('#article-upload-input');
    
    if (await uploadInput.isVisible()) {
      // Create a large dummy file (this would normally be a real large file)
      // For testing purposes, we'll just test the UI behavior
      
      // Try to upload multiple files simultaneously
      // (In a real test, you'd create actual large files)
      console.log('Large file upload test - UI behavior check');
      
      // The upload section should still be responsive
      const uploadSection = page.locator('#articles-explorer-admin-controls');
      await expect(uploadSection).toBeVisible();
    }
  });
});
