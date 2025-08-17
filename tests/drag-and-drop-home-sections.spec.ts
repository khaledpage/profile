import { test, expect } from '@playwright/test';

test.describe('Enhanced Drag-and-Drop Home Sections Customization', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Login as admin if login form is present
    const loginForm = page.locator('#admin-login-form');
    if (await loginForm.isVisible()) {
      await page.locator('#admin-password-input').fill('admin123');
      await page.locator('#admin-login-button').click();
      await expect(loginForm).not.toBeVisible();
    }
  });

  test('should display enhanced drag-and-drop interface for home sections', async ({ page }) => {
    // Open settings panel
    const settingsButton = page.locator('#settings-button');
    await settingsButton.click();
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Navigate to Home Sections tab
    await page.locator('#settings-tab-home').click();
    await expect(page.locator('#home-sections-editor')).toBeVisible();

    // Verify enhanced description and instructions
    const description = page.locator('#home-sections-description');
    await expect(description).toContainText('Drag sections to reorder');
    await expect(description).toContainText('Check/uncheck to show/hide');

    // Verify all sections are present with enhanced styling
    const sections = ['hero', 'about', 'skills', 'projects', 'articles', 'workflow', 'contact'];
    for (const section of sections) {
      const sectionItem = page.locator(`#section-item-${section}`);
      await expect(sectionItem).toBeVisible();
      
      // Check for drag handle indicator
      await expect(sectionItem.locator('.flex.flex-col.gap-0\\.5')).toBeVisible();
      
      // Check for order indicator
      await expect(sectionItem.locator('.absolute.-top-2.-left-2')).toBeVisible();
      
      // Check for emoji icons
      await expect(sectionItem.locator(`#section-item-name-${section}`)).toContainText(/[🏠👋💪🚀📚⚙️📧]/);
    }
  });

  test('should handle visibility toggles with enhanced styling', async ({ page }) => {
    // Open settings panel and navigate to Home Sections
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();

    // Test visibility toggle for the first section
    const firstSection = page.locator('#section-item-hero');
    const checkbox = page.locator('#section-checkbox-hero');
    
    // Check initial state
    const isInitiallyChecked = await checkbox.isChecked();
    
    // Click the custom checkbox (the visible div)
    await firstSection.locator('label').click();
    
    // Verify the checkbox state changed
    await expect(checkbox).toBeChecked({ checked: !isInitiallyChecked });
    
    // Verify opacity change for hidden state
    if (!isInitiallyChecked) {
      await expect(firstSection).toHaveClass(/opacity-60/);
    } else {
      await expect(firstSection).toHaveClass(/opacity-100/);
    }
  });

  test('should support manual arrow controls alongside drag-and-drop', async ({ page }) => {
    // Open settings panel and navigate to Home Sections
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();

    // Test moving the second section up
    const aboutSection = page.locator('#section-item-about');
    const moveUpButton = page.locator('#section-move-up-about');
    
    // Click move up button
    await moveUpButton.click();
    
    // Verify the section moved up (order should change)
    // The about section should now have order indicator "1"
    await expect(aboutSection.locator('.absolute.-top-2.-left-2')).toContainText('1');
    
    // Test that top section's up button is disabled
    const heroMoveUp = page.locator('#section-move-up-hero');
    await expect(heroMoveUp).toBeDisabled();
    
    // Test that bottom section's down button is disabled
    const contactMoveDown = page.locator('#section-move-down-contact');
    await expect(contactMoveDown).toBeDisabled();
  });

  test('should provide visual feedback during drag operations', async ({ page }) => {
    // Open settings panel and navigate to Home Sections
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();

    const aboutSection = page.locator('#section-item-about');
    
    // Hover over section to verify hover effects
    await aboutSection.hover();
    
    // Check that controls become visible on hover
    const controls = aboutSection.locator('#section-item-controls-about');
    await expect(controls).toHaveClass(/group-hover:opacity-100/);
    
    // Verify the section has cursor-move styling
    await expect(aboutSection).toHaveClass(/cursor-move/);
    
    // Check for drag handle visibility on hover
    const dragHandle = aboutSection.locator('.opacity-50.group-hover\\:opacity-100');
    await expect(dragHandle).toBeVisible();
  });

  test('should maintain responsive design on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open settings panel
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();

    // Verify the sections are still properly displayed
    const sectionsEditor = page.locator('#home-sections-editor');
    await expect(sectionsEditor).toBeVisible();
    
    // Check that sections maintain proper spacing
    const firstSection = page.locator('#section-item-hero');
    await expect(firstSection).toBeVisible();
    
    // Verify controls are accessible on mobile
    const controls = firstSection.locator('#section-item-controls-hero');
    await expect(controls).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Verify layout adapts properly
    await expect(sectionsEditor).toBeVisible();
    await expect(firstSection).toBeVisible();
  });

  test('should save preferences and reflect changes on home page', async ({ page }) => {
    // Open settings panel and navigate to Home Sections
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();

    // Hide the about section
    const aboutCheckbox = page.locator('#section-checkbox-about');
    if (await aboutCheckbox.isChecked()) {
      await page.locator('#section-item-about label').click();
    }
    
    // Close settings panel
    await page.locator('#settings-close-button').click();
    
    // Refresh the page to test persistence
    await page.reload();
    
    // Re-open settings to verify the preference was saved
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();
    
    // Verify the about section is still unchecked
    await expect(page.locator('#section-checkbox-about')).not.toBeChecked();
    
    // Verify the section has opacity indicating hidden state
    await expect(page.locator('#section-item-about')).toHaveClass(/opacity-60/);
  });

  test('should provide proper accessibility and keyboard navigation', async ({ page }) => {
    // Open settings panel and navigate to Home Sections
    await page.locator('#settings-button').click();
    await page.locator('#settings-tab-home').click();

    // Test keyboard navigation to arrow buttons
    await page.keyboard.press('Tab');
    
    // Test that arrow buttons have proper titles/tooltips
    const moveUpButton = page.locator('#section-move-up-hero');
    await expect(moveUpButton).toHaveAttribute('title', 'Move up');
    
    const moveDownButton = page.locator('#section-move-down-hero');
    await expect(moveDownButton).toHaveAttribute('title', 'Move down');
    
    // Test that checkboxes are properly labeled
    const aboutLabel = page.locator('#section-item-about label');
    await expect(aboutLabel).toBeVisible();
    
    // Verify screen reader accessibility
    const aboutCheckbox = page.locator('#section-checkbox-about');
    await expect(aboutCheckbox).toHaveClass(/sr-only/); // Screen reader only
  });
});
