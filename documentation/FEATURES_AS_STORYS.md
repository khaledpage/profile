# Features as Stories

## Completed Features

### FEAT-001: Admin Login System

- **ID**: FEAT-001
- **Status**: ✅ DONE
- **Implementation Date**: August 16, 2025
- **Description**: The admin can log in using /login and enter user and password, make them admin admin. create some env file for changing that. if the admin logged in admin role is activated. for now the admin mode is alway activate by defualt, and should stay like that, but if the defualt admin mode is deactivated, it should be enabled after log in.
- **Implementation Details**:
  - Created `/login` page with authentication form
  - Added environment variables for admin credentials (ADMIN_USERNAME, ADMIN_PASSWORD)
  - Created API route `/api/auth/login` for authentication
  - Added i18n translations for login page (English and German)
  - Admin mode remains enabled by default as requested

### FEAT-002: Header CTA Button Heartbeat Animation

- **ID**: FEAT-002
- **Status**: ✅ DONE
- **Implementation Date**: August 16, 2025
- **Description**: The btn header-cta-button should have heart beat animation
- **Implementation Details**:
  - Created CSS keyframes for heartbeat animation (1.5s ease-in-out infinite)
  - Applied heartbeat class to both desktop and mobile CTA buttons
  - Replaced previous wave-ring animation with heartbeat effect