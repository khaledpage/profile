import { test, expect } from '@playwright/test';

test.describe('Article Editing Functionality', () => {
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

  test('Save button should be active after content changes', async ({ page }) => {
    // Find and click an edit button on any article card
    const editButton = page.locator('button:has-text("Edit")').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    
    // Wait for modal to open
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Check initial save button state - should be disabled
    const saveButton = page.locator('#save-button');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeDisabled();
    
    // Make a change to the content
    const contentEditor = page.locator('#content-editor');
    await expect(contentEditor).toBeVisible();
    
    // Clear and add new content
    await contentEditor.clear();
    await contentEditor.fill('# Test Content\n\nThis is a test to verify the save button works.');
    
    // Save button should now be enabled
    await expect(saveButton).toBeEnabled();
    await expect(saveButton).toHaveText('Save');
    
    // Test that we can click the save button
    await saveButton.click();
    
    // Should see saving state
    await expect(saveButton).toHaveText('Saving...');
    
    // Wait for save to complete
    await page.waitForTimeout(2000);
    
    // Save button should be disabled again after save
    await expect(saveButton).toBeDisabled();
  });

  test('Preview mode should render markdown correctly', async ({ page }) => {
    // Find and click an edit button on any article card
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    // Wait for modal to open
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Add markdown content
    const contentEditor = page.locator('#content-editor');
    await contentEditor.clear();
    await contentEditor.fill(`# Main Heading

## Sub Heading

This is **bold text** and this is *italic text*.

Here's a code block:
\`\`\`javascript
console.log('Hello World');
\`\`\`

And inline code: \`const x = 5;\`

- List item 1
- List item 2
- List item 3

> This is a blockquote

[Link to Google](https://google.com)`);
    
    // Switch to preview mode
    const previewButton = page.locator('#preview-toggle-button');
    await previewButton.click();
    
    // Should see preview panel
    await expect(page.locator('#preview-panel')).toBeVisible();
    await expect(page.locator('#preview-content')).toBeVisible();
    
    // Check that markdown is rendered correctly
    const previewContent = page.locator('#preview-content');
    
    // Check headings
    await expect(previewContent.locator('h1')).toContainText('Main Heading');
    await expect(previewContent.locator('h2')).toContainText('Sub Heading');
    
    // Check bold and italic
    await expect(previewContent.locator('strong')).toContainText('bold text');
    await expect(previewContent.locator('em')).toContainText('italic text');
    
    // Check code block
    await expect(previewContent.locator('pre code')).toContainText('console.log');
    
    // Check inline code
    await expect(previewContent.locator('code')).toContainText('const x = 5;');
    
    // Check list items
    await expect(previewContent.locator('li')).toHaveCount(3);
    
    // Check blockquote
    await expect(previewContent.locator('blockquote')).toContainText('This is a blockquote');
    
    // Check link
    await expect(previewContent.locator('a[href="https://google.com"]')).toContainText('Link to Google');
  });

  test('Content changes should trigger unsaved changes indicator', async ({ page }) => {
    // Find and click an edit button
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    // Wait for modal to open
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Initially should not have unsaved changes
    await expect(page.locator('text=Unsaved changes')).not.toBeVisible();
    
    // Make a change to the title
    const titleInput = page.locator('#edit-title');
    await titleInput.fill('Modified Title');
    
    // Should show unsaved changes indicator
    await expect(page.locator('text=Unsaved changes')).toBeVisible();
    
    // Make a change to the content
    const contentEditor = page.locator('#content-editor');
    await contentEditor.clear();
    await contentEditor.fill('Modified content');
    
    // Should still show unsaved changes
    await expect(page.locator('text=Unsaved changes')).toBeVisible();
    
    // Save the changes
    const saveButton = page.locator('#save-button');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    
    // Wait for save to complete and check that unsaved changes indicator disappears
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Last saved:')).toBeVisible();
  });

  test('Close modal with unsaved changes should show confirmation', async ({ page }) => {
    // Find and click an edit button
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();
    
    // Wait for modal to open
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Make a change
    const titleInput = page.locator('#edit-title');
    await titleInput.fill('Modified Title');
    
    // Try to close the modal
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('unsaved changes');
      await dialog.accept();
    });
    
    const closeButton = page.locator('#close-button');
    await closeButton.click();
    
    // Modal should close after accepting the dialog
    await expect(page.locator('#article-edit-modal')).not.toBeVisible();
  });
});
