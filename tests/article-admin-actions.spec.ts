import { test, expect } from '@playwright/test';

test.describe('Article Admin Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle cookie consent if present
    const acceptCookiesButton = page.locator('#accept-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await page.waitForTimeout(500);
    }

    // Enable admin mode first
    const settingsButton = page.locator('#settings-toggle');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await expect(page.locator('#settings-panel')).toBeVisible();
      
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
        await adminCheckbox.click();
        const applyButton = page.locator('#admin-apply-button');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      
      // Close settings panel
      const closeButton = page.locator('#settings-close-button');
      await closeButton.click();
    }
  });

  test('should show edit and delete buttons on individual article pages for admin users', async ({ page }) => {
    // Navigate to articles page first
    await page.goto('/articles');
    await expect(page.locator('#articles-title')).toBeVisible();

    // Click on the first article
    const firstArticleLink = page.locator('[id^="article-card-"] a').first();
    await expect(firstArticleLink).toBeVisible();
    await firstArticleLink.click();

    // Wait for article page to load
    await page.waitForLoadState('networkidle');

    // Check that admin action buttons are visible
    const editButton = page.locator('#article-edit-button');
    const deleteButton = page.locator('#article-delete-button');

    await expect(editButton).toBeVisible();
    await expect(deleteButton).toBeVisible();

    // Verify button styling and icons
    await expect(editButton).toHaveAttribute('title', 'Edit Article');
    await expect(deleteButton).toHaveAttribute('title', 'Delete Article');

    // Check that buttons are positioned correctly (floating on the right)
    const editButtonBox = await editButton.boundingBox();
    const deleteButtonBox = await deleteButton.boundingBox();
    
    if (editButtonBox && deleteButtonBox) {
      expect(editButtonBox.x).toBeGreaterThan(page.viewportSize()!.width - 200); // Should be on the right side
      expect(deleteButtonBox.x).toBeGreaterThan(page.viewportSize()!.width - 200);
    }
  });

  test('should not show admin action buttons for non-admin users', async ({ page }) => {
    // Disable admin mode first
    const settingsButton = page.locator('#settings-toggle');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await expect(page.locator('#settings-panel')).toBeVisible();
      
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      if (await adminCheckbox.isVisible() && await adminCheckbox.isChecked()) {
        await adminCheckbox.click();
        const applyButton = page.locator('#admin-apply-button');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      
      // Close settings panel
      const closeButton = page.locator('#settings-close-button');
      await closeButton.click();
    }

    // Navigate to an article page
    await page.goto('/articles');
    const firstArticleLink = page.locator('[id^="article-card-"] a').first();
    if (await firstArticleLink.isVisible()) {
      await firstArticleLink.click();
      await page.waitForLoadState('networkidle');

      // Verify admin action buttons are not visible
      const editButton = page.locator('#article-edit-button');
      const deleteButton = page.locator('#article-delete-button');

      await expect(editButton).not.toBeVisible();
      await expect(deleteButton).not.toBeVisible();
    }
  });

  test('should open edit modal when edit button is clicked', async ({ page }) => {
    // Navigate to an article page
    await page.goto('/articles');
    const firstArticleLink = page.locator('[id^="article-card-"] a').first();
    await firstArticleLink.click();
    await page.waitForLoadState('networkidle');

    // Click edit button
    const editButton = page.locator('#article-edit-button');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Verify edit modal opens
    const editModal = page.locator('#article-edit-modal');
    await expect(editModal).toBeVisible();

    // Check modal components
    const titleField = page.locator('#edit-title');
    const contentField = page.locator('#edit-content');
    const saveButton = page.locator('#save-article');
    const cancelButton = page.locator('#cancel-edit');

    await expect(titleField).toBeVisible();
    await expect(contentField).toBeVisible();
    await expect(saveButton).toBeVisible();
    await expect(cancelButton).toBeVisible();

    // Cancel editing
    await cancelButton.click();
    await expect(editModal).not.toBeVisible();
  });

  test('should show delete confirmation on first delete button click', async ({ page }) => {
    // Navigate to an article page
    await page.goto('/articles');
    const firstArticleLink = page.locator('[id^="article-card-"] a').first();
    await firstArticleLink.click();
    await page.waitForLoadState('networkidle');

    // Click delete button
    const deleteButton = page.locator('#article-delete-button');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Check for confirmation state
    await expect(deleteButton).toHaveClass(/ring-2/);
    await expect(deleteButton).toHaveClass(/ring-red-500/);

    // Check for confirmation tooltip
    const confirmationTooltip = page.locator('text=Click again to confirm deletion');
    await expect(confirmationTooltip).toBeVisible();

    // Verify button title changes
    await expect(deleteButton).toHaveAttribute('title', 'Click again to confirm deletion');
  });

  test('should maintain floating position and not overlap with other elements', async ({ page }) => {
    // Navigate to an article page
    await page.goto('/articles');
    const firstArticleLink = page.locator('[id^="article-card-"] a').first();
    await firstArticleLink.click();
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('#article-edit-button');
    const deleteButton = page.locator('#article-delete-button');
    const backButton = page.locator('.fab-nav.glass.back-btn');

    await expect(editButton).toBeVisible();
    await expect(deleteButton).toBeVisible();

    // Get button positions
    const editBox = await editButton.boundingBox();
    const deleteBox = await deleteButton.boundingBox();
    const backBox = await backButton.boundingBox();

    if (editBox && deleteBox && backBox) {
      // Admin buttons should be on the right, back button on the left
      expect(editBox.x).toBeGreaterThan(backBox.x + backBox.width + 50); // No overlap
      expect(deleteBox.x).toBeGreaterThan(backBox.x + backBox.width + 50);
      
      // Edit and delete buttons should be stacked vertically
      expect(Math.abs(editBox.y - deleteBox.y)).toBeGreaterThan(40); // Vertical spacing
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Navigate to an article page
    await page.goto('/articles');
    const firstArticleLink = page.locator('[id^="article-card-"] a').first();
    await firstArticleLink.click();
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('#article-edit-button');
    const deleteButton = page.locator('#article-delete-button');

    // Check accessibility attributes
    await expect(editButton).toHaveAttribute('title');
    await expect(deleteButton).toHaveAttribute('title');

    // Buttons should be focusable
    await editButton.focus();
    await expect(editButton).toBeFocused();

    await deleteButton.focus();
    await expect(deleteButton).toBeFocused();

    // Should be keyboard accessible
    await editButton.press('Enter');
    // Should open modal
    await expect(page.locator('#article-edit-modal')).toBeVisible();
    
    // Close modal
    await page.locator('#cancel-edit').click();
  });
});
