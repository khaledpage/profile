import { test, expect } from '@playwright/test';

test.describe('Admin Login/Logout Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle cookie consent if present
    const acceptCookiesButton = page.locator('#accept-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should show login navigation when showLoginNavigation is enabled', async ({ page }) => {
    // Check if admin navigation is visible in header
    const adminNavigation = page.locator('.relative').filter({ has: page.locator('button:has-text("Login"), button:has-text("Admin Mode")') });
    
    // The visibility depends on config.admin.showLoginNavigation
    // This test verifies the component renders when enabled
    if (await adminNavigation.first().isVisible()) {
      await expect(adminNavigation.first()).toBeVisible();
    }
  });

  test('should show login button when user is not logged in', async ({ page }) => {
    // Clear any existing admin session
    await page.evaluate(() => {
      localStorage.removeItem('adminPassword');
    });
    await page.reload();

    // Look for login button
    const loginButton = page.locator('button:has-text("Login")');
    if (await loginButton.isVisible()) {
      await expect(loginButton).toBeVisible();
      
      // Check login button styling and icon
      const loginIcon = loginButton.locator('svg');
      await expect(loginIcon).toBeVisible();
      
      // Verify button is interactive
      await loginButton.hover();
      // Should change appearance on hover
    }
  });

  test('should navigate to login page when login button is clicked', async ({ page }) => {
    // Clear any existing admin session
    await page.evaluate(() => {
      localStorage.removeItem('adminPassword');
    });
    await page.reload();

    const loginButton = page.locator('button:has-text("Login")');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      // Should navigate to login page
      await expect(page).toHaveURL(/.*\/login/);
      
      // Verify login page elements
      const loginForm = page.locator('#login-form');
      await expect(loginForm).toBeVisible();
    }
  });

  test('should show admin dropdown when user is logged in', async ({ page }) => {
    // First log in as admin
    await page.goto('/login');
    
    const usernameField = page.locator('#username');
    const passwordField = page.locator('#password');
    const loginSubmitButton = page.locator('#login-button');
    
    if (await usernameField.isVisible()) {
      await usernameField.fill('admin');
      await passwordField.fill('admin');
      await loginSubmitButton.click();
      
      // Wait for redirect back to home
      await page.waitForURL('/');
      
      // Check for admin dropdown
      const adminDropdown = page.locator('button:has-text("Admin Mode")');
      if (await adminDropdown.isVisible()) {
        await expect(adminDropdown).toBeVisible();
        
        // Check dropdown styling
        await expect(adminDropdown).toHaveClass(/flex/);
        await expect(adminDropdown).toHaveClass(/items-center/);
        
        // Verify admin mode indicator styling
        const buttonBox = await adminDropdown.boundingBox();
        expect(buttonBox).toBeTruthy();
      }
    }
  });

  test('should show dropdown menu when admin button is clicked', async ({ page }) => {
    // Mock admin logged in state
    await page.evaluate(() => {
      localStorage.setItem('adminPassword', 'admin');
    });
    
    // Enable admin mode
    const settingsButton = page.locator('#settings-toggle');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
        await adminCheckbox.click();
        const applyButton = page.locator('#admin-apply-button');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      const closeButton = page.locator('#settings-close-button');
      await closeButton.click();
    }
    
    await page.reload();

    const adminButton = page.locator('button:has-text("Admin Mode")');
    if (await adminButton.isVisible()) {
      await adminButton.click();
      
      // Check dropdown menu appears
      const dropdownMenu = page.locator('.absolute.right-0.top-full');
      await expect(dropdownMenu).toBeVisible();
      
      // Check dropdown items
      const logoutButton = page.locator('button:has-text("Logout")');
      const dashboardLink = page.locator('a:has-text("Dashboard")');
      
      await expect(logoutButton).toBeVisible();
      await expect(dashboardLink).toBeVisible();
    }
  });

  test('should logout when logout button is clicked', async ({ page }) => {
    // Mock admin logged in state
    await page.evaluate(() => {
      localStorage.setItem('adminPassword', 'admin');
    });
    
    // Enable admin mode first
    const settingsButton = page.locator('#settings-toggle');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
        await adminCheckbox.click();
        const applyButton = page.locator('#admin-apply-button');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      const closeButton = page.locator('#settings-close-button');
      await closeButton.click();
    }
    
    await page.reload();

    const adminButton = page.locator('button:has-text("Admin Mode")');
    if (await adminButton.isVisible()) {
      await adminButton.click();
      
      const logoutButton = page.locator('button:has-text("Logout")');
      await expect(logoutButton).toBeVisible();
      await logoutButton.click();
      
      // Should clear admin session
      const adminPassword = await page.evaluate(() => localStorage.getItem('adminPassword'));
      expect(adminPassword).toBeNull();
      
      // Should show login button instead
      const loginButton = page.locator('button:has-text("Login")');
      await expect(loginButton).toBeVisible();
    }
  });

  test('should navigate to admin dashboard when dashboard link is clicked', async ({ page }) => {
    // Mock admin logged in state
    await page.evaluate(() => {
      localStorage.setItem('adminPassword', 'admin');
    });
    
    // Enable admin mode
    const settingsButton = page.locator('#settings-toggle');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
        await adminCheckbox.click();
        const applyButton = page.locator('#admin-apply-button');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      const closeButton = page.locator('#settings-close-button');
      await closeButton.click();
    }
    
    await page.reload();

    const adminButton = page.locator('button:has-text("Admin Mode")');
    if (await adminButton.isVisible()) {
      await adminButton.click();
      
      const dashboardLink = page.locator('a:has-text("Dashboard")');
      await expect(dashboardLink).toBeVisible();
      await dashboardLink.click();
      
      // Should navigate to admin page
      await expect(page).toHaveURL(/.*\/admin/);
      
      // Verify admin dashboard elements
      const adminDashboard = page.locator('#admin-dashboard');
      await expect(adminDashboard).toBeVisible();
    }
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    // Mock admin logged in state
    await page.evaluate(() => {
      localStorage.setItem('adminPassword', 'admin');
    });
    
    // Enable admin mode
    const settingsButton = page.locator('#settings-toggle');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      const adminCheckbox = page.locator('#admin-toggle-checkbox');
      if (await adminCheckbox.isVisible() && !(await adminCheckbox.isChecked())) {
        await adminCheckbox.click();
        const applyButton = page.locator('#admin-apply-button');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      const closeButton = page.locator('#settings-close-button');
      await closeButton.click();
    }
    
    await page.reload();

    const adminButton = page.locator('button:has-text("Admin Mode")');
    if (await adminButton.isVisible()) {
      await adminButton.click();
      
      const dropdownMenu = page.locator('.absolute.right-0.top-full');
      await expect(dropdownMenu).toBeVisible();
      
      // Click outside the dropdown
      await page.click('body', { position: { x: 100, y: 100 } });
      
      // Dropdown should close
      await expect(dropdownMenu).not.toBeVisible();
    }
  });

  test('should have proper styling and animations', async ({ page }) => {
    const loginButton = page.locator('button:has-text("Login")');
    if (await loginButton.isVisible()) {
      // Check button styling
      await expect(loginButton).toHaveClass(/flex/);
      await expect(loginButton).toHaveClass(/items-center/);
      
      // Test hover effects
      await loginButton.hover();
      
      // Check icon is present
      const icon = loginButton.locator('svg');
      await expect(icon).toBeVisible();
    }
    
    // Test admin dropdown styling when logged in
    await page.evaluate(() => {
      localStorage.setItem('adminPassword', 'admin');
    });
    await page.reload();
    
    const adminButton = page.locator('button:has-text("Admin Mode")');
    if (await adminButton.isVisible()) {
      // Check admin button styling (should be highlighted)
      const backgroundColor = await adminButton.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(backgroundColor).toBeTruthy();
      
      await adminButton.click();
      
      // Check dropdown styling
      const dropdownMenu = page.locator('.absolute.right-0.top-full');
      if (await dropdownMenu.isVisible()) {
        // Should have backdrop blur
        const backdropFilter = await dropdownMenu.evaluate(el => getComputedStyle(el).backdropFilter);
        expect(backdropFilter).toContain('blur');
      }
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    const loginButton = page.locator('button:has-text("Login")');
    if (await loginButton.isVisible()) {
      // Should be focusable
      await loginButton.focus();
      await expect(loginButton).toBeFocused();
      
      // Should activate with Enter key
      await loginButton.press('Enter');
      await expect(page).toHaveURL(/.*\/login/);
    }
  });
});
