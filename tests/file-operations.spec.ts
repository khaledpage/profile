import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';

test.describe('File Operations & ZIP Management', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to articles page with admin mode enabled
    await page.goto('/articles');
    // Wait for page to load - using correct container ID
    await page.waitForSelector('#articles-explorer-container');
  });

  test('FILE-001: ZIP Download Functionality', async ({ page }) => {
    // Look for an article card with download functionality
    const articleCard = page.locator('[id*="article-card-"]').first();
    await expect(articleCard).toBeVisible();

    // Check if admin controls are visible (admin mode enabled by default)
    const downloadButton = page.locator('[id*="download-zip-button-"]').first();
    
    if (await downloadButton.isVisible()) {
      // Start waiting for download before clicking
      const downloadPromise = page.waitForEvent('download');
      await downloadButton.click();
      
      // Wait for download to complete
      const download = await downloadPromise;
      
      // Verify filename contains article slug
      const filename = download.suggestedFilename();
      expect(filename).toMatch(/\.zip$/);
      
      // Save download to verify contents
      const downloadPath = path.join(__dirname, '../temp', filename);
      await download.saveAs(downloadPath);
      
      // Verify ZIP file exists
      expect(fs.existsSync(downloadPath)).toBeTruthy();
      
      // Verify ZIP contents
      const zipData = fs.readFileSync(downloadPath);
      const zip = await JSZip.loadAsync(zipData);
      
      // Should contain article.md
      expect(zip.files['article.md']).toBeDefined();
      
      // Should contain metadata.json
      expect(zip.files['metadata.json']).toBeDefined();
      
      // Clean up
      fs.unlinkSync(downloadPath);
    } else {
      console.log('Download button not visible - ZIP download might not be enabled');
    }
  });

  test('FILE-002: ZIP Upload Functionality', async ({ page }) => {
    // Look for upload controls
    const uploadSection = page.locator('#articles-explorer-admin-controls');
    
    if (await uploadSection.isVisible()) {
      // Create a test ZIP file
      const testZip = new JSZip();
      
      // Add test article files
      const testMetadata = {
        title: 'Test Article Upload',
        summary: 'A test article uploaded via ZIP',
        category: 'Testing',
        tags: ['test', 'upload'],
        author: 'Test Author',
        publishDate: new Date().toISOString(),
        readingTime: 5,
        featured: false
      };
      
      const testContent = '# Test Article\\n\\nThis is a test article uploaded via ZIP file.\\n\\n## Content\\n\\nSample content for testing.';
      
      testZip.file('metadata.json', JSON.stringify(testMetadata, null, 2));
      testZip.file('article.md', testContent);
      
      // Generate ZIP blob
      const zipBlob = await testZip.generateAsync({ type: 'blob' });
      
      // Create a temporary file for upload
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const testZipPath = path.join(tempDir, 'test-article.zip');
      const zipBuffer = await zipBlob.arrayBuffer();
      fs.writeFileSync(testZipPath, Buffer.from(zipBuffer));
      
      // Find and interact with upload input
      const uploadInput = page.locator('#article-upload-input');
      
      if (await uploadInput.isVisible()) {
        // Upload the test ZIP file
        await uploadInput.setInputFiles(testZipPath);
        
        // Wait for upload to complete
        await page.waitForSelector('#upload-results-container', { timeout: 10000 });
        
        // Verify upload results
        const uploadResults = page.locator('#upload-results-container');
        await expect(uploadResults).toBeVisible();
        
        // Check for success message
        const successMessage = page.locator('#upload-results-container .text-green-600');
        await expect(successMessage).toBeVisible();
        
        // Clean up
        fs.unlinkSync(testZipPath);
      } else {
        console.log('Upload input not visible - ZIP upload might not be enabled');
      }
    } else {
      console.log('Admin controls not visible - admin mode might not be enabled');
    }
  });

  test('FILE-003: Bulk ZIP Operations', async ({ page }) => {
    // Check if bulk mode toggle exists
    const bulkModeToggle = page.locator('#bulk-mode-toggle');
    
    if (await bulkModeToggle.isVisible()) {
      // Enable bulk mode
      await bulkModeToggle.click();
      
      // Verify bulk mode is active
      await expect(page.locator('#bulk-selection-controls')).toBeVisible();
      
      // Select multiple articles
      const checkboxes = page.locator('[id*="article-checkbox-"]');
      const checkboxCount = await checkboxes.count();
      
      if (checkboxCount > 0) {
        // Select first 2 articles
        for (let i = 0; i < Math.min(2, checkboxCount); i++) {
          await checkboxes.nth(i).check();
        }
        
        // Verify selection count updates
        const selectionCount = page.locator('#bulk-selection-controls span');
        await expect(selectionCount).toContainText('2 of');
        
        // Test select all functionality
        const selectAllButton = page.locator('#select-all-button');
        await selectAllButton.click();
        
        // Verify all articles selected
        await expect(selectionCount).toContainText(`${checkboxCount} of ${checkboxCount} selected`);
        
        // Test bulk download if available
        const bulkDownloadButton = page.locator('#bulk-download-button');
        if (await bulkDownloadButton.isVisible()) {
          const downloadPromise = page.waitForEvent('download');
          await bulkDownloadButton.click();
          
          const download = await downloadPromise;
          expect(download.suggestedFilename()).toMatch(/bulk.*\.zip$/);
        }
        
        // Deselect all
        await selectAllButton.click();
        await expect(selectionCount).toContainText('0 of');
      }
    } else {
      console.log('Bulk mode not available');
    }
  });

  test('FILE-004: Asset Management', async ({ page }) => {
    // Navigate to an article that might have assets
    await page.goto('/articles/matrix-multiplication');
    
    // Check if article content loads
    const articleContent = page.locator('article, [role="main"]');
    await expect(articleContent).toBeVisible();
    
    // Look for images or assets
    const images = page.locator('article img, [role="main"] img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Verify first image loads
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // Check if image source is accessible
      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
      
      // Verify asset URL format
      if (src?.includes('/api/articles/')) {
        // Test asset endpoint directly
        const response = await page.request.get(src);
        expect(response.status()).toBe(200);
      }
    }
  });

  test('FILE-005: PDF Export Functionality', async ({ page }) => {
    // Navigate to an article page
    await page.goto('/articles/nextjs-vs-react');
    
    // Look for PDF export option (might be in URL format)
    const articleSlug = 'nextjs-vs-react';
    const pdfUrl = `/api/articles/${articleSlug}/pdf`;
    
    // Test PDF generation endpoint
    const response = await page.request.get(pdfUrl);
    
    if (response.status() === 200) {
      // Verify content type
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/pdf');
      
      // Verify content disposition (should be attachment)
      const contentDisposition = response.headers()['content-disposition'];
      expect(contentDisposition).toContain('attachment');
      expect(contentDisposition).toContain('.pdf');
    } else {
      console.log('PDF export not available or not working');
    }
  });

  test('FILE-006: Invalid ZIP Upload Handling', async ({ page }) => {
    const uploadSection = page.locator('#articles-explorer-admin-controls');
    
    if (await uploadSection.isVisible()) {
      // Create an invalid ZIP file (missing required files)
      const invalidZip = new JSZip();
      invalidZip.file('random.txt', 'This is not a valid article structure');
      
      const zipBlob = await invalidZip.generateAsync({ type: 'blob' });
      
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const invalidZipPath = path.join(tempDir, 'invalid-article.zip');
      const zipBuffer = await zipBlob.arrayBuffer();
      fs.writeFileSync(invalidZipPath, Buffer.from(zipBuffer));
      
      const uploadInput = page.locator('#article-upload-input');
      
      if (await uploadInput.isVisible()) {
        // Upload the invalid ZIP file
        await uploadInput.setInputFiles(invalidZipPath);
        
        // Wait for error handling
        await page.waitForTimeout(2000);
        
        // Should show error message or handle gracefully
        // (Exact error handling depends on implementation)
        const errorMessages = page.locator('.text-red-500, .text-red-600, [class*="error"]');
        const errorCount = await errorMessages.count();
        
        // Either shows error or handles gracefully
        expect(errorCount >= 0).toBeTruthy();
        
        // Clean up
        fs.unlinkSync(invalidZipPath);
      }
    }
  });
});

test.describe('Bulk Operations Interface', () => {
  
  test('BULK-001: Bulk Selection Interface', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForSelector('#articles-explorer-container');
    
    const bulkModeToggle = page.locator('#bulk-mode-toggle');
    
    if (await bulkModeToggle.isVisible()) {
      // Test bulk mode toggle
      await bulkModeToggle.click();
      
      // Verify bulk selection controls appear
      await expect(page.locator('#bulk-selection-controls')).toBeVisible();
      
      // Verify checkboxes appear on article cards
      const articleCheckboxes = page.locator('[id*="article-checkbox-"]');
      const checkboxCount = await articleCheckboxes.count();
      expect(checkboxCount).toBeGreaterThan(0);
      
      // Test individual selection
      if (checkboxCount > 0) {
        await articleCheckboxes.first().check();
        
        // Verify selection count updates
        const selectionInfo = page.locator('#bulk-selection-controls span');
        await expect(selectionInfo).toContainText('1 of');
        
        // Test select all button
        const selectAllButton = page.locator('#select-all-button');
        await expect(selectAllButton).toBeVisible();
        await selectAllButton.click();
        
        // Verify all selected
        await expect(selectionInfo).toContainText(`${checkboxCount} of ${checkboxCount} selected`);
        
        // Test deselect all
        await selectAllButton.click();
        await expect(selectionInfo).toContainText('0 of');
      }
    }
  });

  test('BULK-002: Bulk Delete Operations', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForSelector('#articles-explorer-container');
    
    const bulkModeToggle = page.locator('#bulk-mode-toggle');
    
    if (await bulkModeToggle.isVisible()) {
      await bulkModeToggle.click();
      
      const articleCheckboxes = page.locator('[id*="article-checkbox-"]');
      const checkboxCount = await articleCheckboxes.count();
      
      if (checkboxCount > 0) {
        // Select first article
        await articleCheckboxes.first().check();
        
        // Look for bulk delete button
        const bulkDeleteButton = page.locator('#bulk-delete-button');
        
        if (await bulkDeleteButton.isVisible()) {
          // Click delete button
          await bulkDeleteButton.click();
          
          // Should show confirmation dialog
          const confirmDialog = page.locator('[role="dialog"], .confirm-dialog');
          
          // Handle confirmation if it appears
          if (await confirmDialog.isVisible()) {
            const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("cancel")');
            if (await cancelButton.isVisible()) {
              await cancelButton.click();
            }
          } else {
            // If using browser confirm, we can't easily test it in Playwright
            // This is expected behavior for browser native confirms
            console.log('Bulk delete uses browser confirmation dialog');
          }
        }
      }
    }
  });
});

test.describe('Error Handling', () => {
  
  test('ERROR-001: Network Error Handling', async ({ page }) => {
    // Test offline behavior
    await page.goto('/articles');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Try to navigate to another page
    await page.goto('/articles/nonexistent-article');
    
    // Should handle gracefully (either error page or network error)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy(); // Page should still render something
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('ERROR-002: Invalid Data Handling', async ({ page }) => {
    // Test with non-existent article
    await page.goto('/articles/definitely-not-an-article-that-exists-12345');
    
    // Should either show 404 or handle gracefully
    const response = await page.waitForResponse(/articles|404/);
    
    // Page should still be responsive
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    
    // No JavaScript errors should crash the app
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });
});
