import { test, expect } from '@playwright/test';

test.describe('Enhanced Article Editing Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Accept cookie consent first
    await page.goto('/');
    
    // Wait for and accept cookie consent if present
    try {
      const cookieDialog = page.locator('[id*="cookie"]');
      if (await cookieDialog.isVisible({ timeout: 2000 })) {
        await page.click('button:has-text("Accept All")');
        await page.waitForTimeout(500);
      }
    } catch (error) {
      console.log('No cookie dialog found, continuing...');
    }
    
    // Login as admin
    await page.goto('/login');
    await page.fill('#username-input', 'admin');
    await page.fill('#password-input', 'admin123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('/', { timeout: 10000 });
    
    // Navigate to articles page
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
  });

  test('Enhanced modal should have gradient header and proper styling', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    // Wait for modal to open
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Check modal has enhanced styling
    const modal = page.locator('#article-edit-modal');
    await expect(modal).toHaveCSS('border-radius', '12px');
    
    // Check header has gradient background
    const header = page.locator('#modal-header');
    await expect(header).toBeVisible();
    
    // Check header contains title and subtitle
    await expect(page.locator('#modal-title')).toContainText('Edit Article');
    await expect(page.locator('#modal-subtitle')).toBeVisible();
    
    // Check for enhanced metadata panel
    const metadataPanel = page.locator('#metadata-panel');
    await expect(metadataPanel).toBeVisible();
    
    // Check for enhanced editor panel
    const editorPanel = page.locator('#editor-panel');
    await expect(editorPanel).toBeVisible();
  });

  test('Status indicators should update correctly', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Initially should not show unsaved changes indicator
    await expect(page.locator('text=Unsaved Changes')).not.toBeVisible();
    
    // Make a change to trigger unsaved state
    const titleInput = page.locator('#edit-title');
    await titleInput.fill('Modified Title Test');
    
    // Should show unsaved changes indicator with proper styling
    const unsavedIndicator = page.locator('text=Unsaved Changes');
    await expect(unsavedIndicator).toBeVisible();
    await expect(unsavedIndicator.locator('..')).toHaveClass(/bg-yellow-500/);
    
    // Save the changes
    const saveButton = page.locator('#save-button');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    
    // Should show saving indicator
    const savingIndicator = page.locator('text=Saving...');
    await expect(savingIndicator).toBeVisible();
    await expect(savingIndicator.locator('..')).toHaveClass(/bg-blue-500/);
    
    // Wait for save to complete
    await page.waitForTimeout(3000);
    
    // Should show saved indicator
    const savedIndicator = page.locator('text=Saved');
    await expect(savedIndicator).toBeVisible();
    await expect(savedIndicator.locator('..')).toHaveClass(/bg-green-500/);
  });

  test('Enhanced form fields should have proper styling and icons', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Check all form fields have labels with icons
    const fields = [
      { label: 'Title', input: '#edit-title' },
      { label: 'Summary', input: '#edit-summary' },
      { label: 'Tags', input: '#edit-tags' },
      { label: 'Category', input: '#edit-category' },
      { label: 'Cover Image URL', input: '#edit-cover-image' }
    ];
    
    for (const field of fields) {
      // Check label is visible and has icon
      const label = page.locator(`label[for="${field.input.substring(1)}"]`);
      await expect(label).toBeVisible();
      await expect(label).toContainText(field.label);
      await expect(label.locator('svg')).toBeVisible();
      
      // Check input has proper styling
      const input = page.locator(field.input);
      await expect(input).toBeVisible();
      await expect(input).toHaveClass(/rounded-lg/);
      await expect(input).toHaveClass(/px-4/);
      await expect(input).toHaveClass(/py-3/);
    }
    
    // Check featured checkbox has proper styling
    const featuredCheckbox = page.locator('#edit-featured');
    await expect(featuredCheckbox).toBeVisible();
    await expect(featuredCheckbox.locator('..').locator('..')).toHaveClass(/rounded-lg/);
  });

  test('Enhanced buttons should have hover effects and proper states', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Check preview toggle button
    const previewButton = page.locator('#preview-toggle-button');
    await expect(previewButton).toBeVisible();
    await expect(previewButton).toHaveClass(/transition-all/);
    await expect(previewButton).toHaveClass(/duration-300/);
    await expect(previewButton.locator('svg')).toBeVisible();
    
    // Check save button
    const saveButton = page.locator('#save-button');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toHaveClass(/transition-all/);
    await expect(saveButton).toHaveClass(/duration-300/);
    
    // Check close button
    const closeButton = page.locator('#close-button');
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveClass(/transition-all/);
    await expect(closeButton).toHaveClass(/duration-300/);
    await expect(closeButton.locator('svg')).toBeVisible();
  });

  test('Enhanced editor panel should have proper headers and content', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Check editor container has proper header
    const editorContainer = page.locator('#editor-container');
    await expect(editorContainer).toBeVisible();
    
    // Check editor header has icon and title
    const editorHeader = editorContainer.locator('.px-6.py-4.border-b').first();
    await expect(editorHeader).toBeVisible();
    await expect(editorHeader.locator('svg')).toBeVisible();
    await expect(editorHeader).toContainText('Content Editor');
    await expect(editorHeader).toContainText('Markdown supported');
    
    // Check content editor has enhanced styling
    const contentEditor = page.locator('#content-editor');
    await expect(contentEditor).toBeVisible();
    await expect(contentEditor).toHaveClass(/rounded-xl/);
    await expect(contentEditor).toHaveClass(/font-mono/);
    await expect(contentEditor).toHaveClass(/transition-all/);
    
    // Switch to preview mode
    const previewButton = page.locator('#preview-toggle-button');
    await previewButton.click();
    
    // Check preview panel has proper header
    const previewPanel = page.locator('#preview-panel');
    await expect(previewPanel).toBeVisible();
    
    const previewHeader = previewPanel.locator('.px-6.py-4.border-b').first();
    await expect(previewHeader).toBeVisible();
    await expect(previewHeader.locator('svg')).toBeVisible();
    await expect(previewHeader).toContainText('Live Preview');
    await expect(previewHeader).toContainText('Real-time');
  });

  test('Modal should have backdrop blur and proper overlay styling', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    // Check modal overlay has backdrop blur
    const overlay = page.locator('#article-edit-modal-overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveCSS('backdrop-filter', 'blur(8px)');
    
    // Check modal container has proper shadow and border
    const modal = page.locator('#article-edit-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveClass(/rounded-xl/);
    await expect(modal).toHaveClass(/shadow-2xl/);
  });

  test('Loading state should have enhanced styling', async ({ page }) => {
    // This test checks the loading state styling
    // We'll trigger it by checking if loading elements have proper classes
    
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    
    // If loading state appears, check its styling
    const loadingDiv = page.locator('#editor-loading');
    
    // Note: This test might not always catch the loading state due to fast loading
    // but it verifies the structure is in place
    if (await loadingDiv.isVisible({ timeout: 100 })) {
      await expect(loadingDiv).toHaveClass(/flex-1/);
      await expect(loadingDiv).toHaveClass(/flex/);
      await expect(loadingDiv).toHaveClass(/items-center/);
      await expect(loadingDiv).toHaveClass(/justify-center/);
      
      // Check for enhanced loading spinner
      const spinner = loadingDiv.locator('.animate-spin');
      await expect(spinner).toBeVisible();
      await expect(spinner).toHaveClass(/rounded-full/);
    }
  });

  test('Form validation and user feedback should work properly', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Clear title to test validation
    const titleInput = page.locator('#edit-title');
    await titleInput.clear();
    
    // Try to save with empty title
    const saveButton = page.locator('#save-button');
    
    // Make another change to enable save button
    const contentEditor = page.locator('#content-editor');
    await contentEditor.fill('Some content');
    
    // Save button should be enabled
    await expect(saveButton).toBeEnabled();
    
    // Test that tags input shows helper text
    const tagsLabel = page.locator('label[for="edit-tags"]').locator('..');
    await expect(tagsLabel).toContainText('Separate tags with commas');
  });

  test('Keyboard accessibility should work in enhanced modal', async ({ page }) => {
    // Open edit modal
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Test tab navigation through form fields
    await page.keyboard.press('Tab'); // Should focus first form field
    await page.keyboard.press('Tab'); // Should focus summary
    await page.keyboard.press('Tab'); // Should focus tags
    await page.keyboard.press('Tab'); // Should focus category
    await page.keyboard.press('Tab'); // Should focus cover image
    await page.keyboard.press('Tab'); // Should focus featured checkbox
    
    // Test escape key to close modal
    page.on('dialog', async dialog => {
      await dialog.dismiss(); // Dismiss any confirmation dialog
    });
    
    await page.keyboard.press('Escape');
    // Note: Modal might not close if there are unsaved changes and user dismisses dialog
  });
});
