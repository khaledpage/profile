# Comprehensive Test Cases

This document contains all test cases for the portfolio application, covering every feature and functionality.

## 🚨 ACTIVE BUG TESTING (January 17, 2025)

### BUG-004-EDIT: Article Editing Functionality Validation (P0 - E2E)

**Description**: Test save button activation and markdown preview rendering in article edit modal

**Test File**: `tests/article-editing-functionality.spec.ts`

**Prerequisites**:
- Server running on localhost:3002
- Admin login with username: 'admin', password: 'admin123'

**Test Cases**:

1. **Save Button Activation Test**:
   - Login as admin
   - Navigate to articles page
   - Click edit button on any article
   - Verify save button is initially disabled
   - Modify content in the editor
   - Verify save button becomes enabled
   - Click save and verify saving state
   - Verify save button becomes disabled after save

2. **Markdown Preview Rendering Test**:
   - Open article edit modal
   - Add markdown content (headers, bold, italic, code, lists, etc.)
   - Switch to preview mode
   - Verify all markdown elements render correctly as HTML
   - Check headings, formatting, code blocks, lists, and links

3. **Unsaved Changes Detection Test**:
   - Open edit modal
   - Make changes to title and content
   - Verify "Unsaved changes" indicator appears
   - Save changes and verify indicator disappears
   - Verify "Last saved" timestamp appears

4. **Close Confirmation Test**:
   - Open edit modal and make changes
   - Attempt to close modal
   - Verify confirmation dialog appears
   - Test both accept and cancel options

**Status**: CREATED - Tests implemented to validate BUG-004 fixes

---

### About Section Layout Switching Tests (2025-08-17)

**Description**: Comprehensive tests for About section layout switching functionality

**Test File**: `tests/about-section-layout-switching.spec.ts`

**Test Cases**:

1. **Default Layout Display Test**:
   - Navigate to home page
   - Verify basic about section is displayed by default
   - Check that enhanced layout elements are not visible

2. **Layout Switching Through Settings Test**:
   - Open settings panel and navigate to appearance tab
   - Find About Layout section
   - Switch from basic to enhanced layout
   - Verify enhanced layout activates with profile picture and timeline

3. **Preference Persistence Test**:
   - Switch to enhanced layout
   - Reload page
   - Verify enhanced layout persists across page reloads

4. **Bidirectional Switching Test**:
   - Switch to enhanced layout and verify activation
   - Switch back to basic layout and verify deactivation
   - Confirm profile picture and enhanced elements are hidden

5. **Settings UI Validation Test**:
   - Verify layout descriptions are accurate
   - Check that selected option is highlighted
   - Validate button styling and feedback

6. **Enhanced Layout Components Test**:
   - Switch to enhanced layout
   - Verify profile picture displays with correct styling
   - Check stats grid with experience, projects, tech focus
   - Validate timeline with education and work experience

**Status**: IMPLEMENTED - Complete test suite for About section layout switching

---

## FEAT-029-TEST: Enhanced Drag-and-Drop Home Sections Customization Test Suite

**Feature**: FEAT-029 - Enhanced drag-and-drop functionality for home page sections in settings panel

**Test Cases**:

1. **Drag-and-Drop Functionality Test**:
   - Open settings panel and navigate to Home Sections tab
   - Verify all sections are displayed with drag handles and order indicators
   - Drag a section from one position to another
   - Verify the section moves to the correct position
   - Verify order numbers update correctly
   - Check that preferences are saved automatically

2. **Visual Feedback During Drag Test**:
   - Initiate drag operation on any section
   - Verify dragged item has scale, rotation, and shadow effects
   - Verify drag-over target shows accent border and scale effect
   - Verify drag indicators are visible and positioned correctly
   - Test drag end state returns to normal styling

3. **Visibility Toggle Test**:
   - Click visibility checkbox for any section
   - Verify section opacity changes to indicate hidden state
   - Verify custom checkbox styling and animations work
   - Check that hidden sections are saved in preferences
   - Verify home page reflects the visibility changes

4. **Manual Arrow Controls Test**:
   - Use up/down arrow buttons to reorder sections
   - Verify buttons are disabled at list boundaries
   - Check that manual controls work alongside drag-and-drop
   - Verify hover effects and accessibility labels

5. **Visual Design and Polish Test**:
   - Verify section cards have glass morphism effects
   - Check emoji icons are displayed for each section type
   - Verify gradient animations and backdrop blur effects
   - Test responsive behavior on different screen sizes
   - Validate accessibility with keyboard navigation

6. **Instructions and Help Text Test**:
   - Verify instructional text is clear and helpful
   - Check that both drag-and-drop and manual methods are explained
   - Verify emoji indicators enhance the user experience
   - Test that the interface is intuitive for new users

**Expected Results**: Users can intuitively reorder home page sections with smooth drag-and-drop interactions, enhanced visual feedback, and polished modern UI design.

**Status**: CREATED - Tests required to validate enhanced drag-and-drop implementation

---

### FEAT-027-TEST: Enhanced Article Editing Modal Styling and Functionality (P1 - E2E)

**Description**: Comprehensive test suite for the enhanced article editing modal with improved styling, status indicators, and user experience

**Test File**: `tests/enhanced-editing-modal.spec.ts`

**Prerequisites**:
- Server running on localhost:3000
- Admin login with username: 'admin', password: 'admin123'
- Enhanced modal styling implementation

**Test Cases**:

1. **Enhanced Modal Styling Test**:
   - Open article edit modal
   - Verify modal has gradient header with rounded corners
   - Check for enhanced metadata panel with icons and proper styling
   - Verify backdrop blur effects and shadow styling
   - Confirm modal container has modern glass morphism appearance

2. **Status Indicators Functionality Test**:
   - Open edit modal and make changes
   - Verify "Unsaved Changes" indicator appears with yellow styling
   - Save changes and verify "Saving..." indicator with blue styling
   - Confirm "Saved" indicator appears with green styling and timestamp
   - Test all status indicator animations and transitions

3. **Enhanced Form Fields Test**:
   - Verify all form fields have proper labels with SVG icons
   - Check rounded corner styling and padding on all inputs
   - Test focus states and transitions on form elements
   - Verify featured checkbox has enhanced styling
   - Confirm helper text appears for tags field

4. **Enhanced Button Styling Test**:
   - Test preview toggle button with hover effects and icons
   - Verify save button changes color and shows loading spinner when saving
   - Check close button has proper hover animations and rotation effect
   - Confirm all buttons have backdrop blur and transition effects

5. **Enhanced Editor Panel Test**:
   - Verify editor header has proper icon and title
   - Check editor textarea has enhanced styling with monospace font
   - Test preview panel header with real-time indicator
   - Confirm proper background gradients and section styling

6. **Accessibility and Keyboard Navigation Test**:
   - Test tab navigation through all form fields
   - Verify focus states are visible and properly styled
   - Test escape key functionality for modal close
   - Check ARIA labels and accessibility attributes

7. **Loading State Enhancement Test**:
   - Verify loading spinner has proper styling and animation
   - Check loading state text and container alignment
   - Test loading state transitions and visibility

8. **Form Validation and User Feedback Test**:
   - Test form validation with empty fields
   - Verify helper text and error messaging
   - Check user feedback for successful actions
   - Test form state management and validation

**Status**: IMPLEMENTED - Comprehensive test suite created for enhanced editing modal

---

### BUG-002-ANIM: Article Animation Height Validation (P1 - Visual)

**Description**: Test article animation container height and prevent cutoff

**Manual Test Steps**:

1. Navigate to homepage
2. Scroll to articles section
3. Observe horizontal scrolling animation
4. Verify articles are not cut off from top or bottom
5. Check animation container height (should be 600px minimum)
6. Verify padding prevents cutoff issues

**Expected Result**: All article cards display fully within animation container without being cut off

**Status**: UPDATED - Container height increased to 600px with padding

---

## 🏛️ Architecture & Test Organization

### Test Categories
- **UNIT**: Component/Function level tests
- **INTEGRATION**: Feature interaction tests  
- **E2E**: End-to-end user workflows
- **API**: Backend API endpoint tests
- **SECURITY**: Authentication & authorization tests
- **PERFORMANCE**: Loading & responsiveness tests
- **ACCESSIBILITY**: A11y compliance tests

### Test Priority Levels
- **P0**: Critical functionality (breaks core features)
- **P1**: Important functionality (affects user experience)
- **P2**: Nice-to-have functionality (minor issues)

---

## 🔐 Authentication & Admin Features

### AUTH-001: Admin Authentication System (P0 - E2E)

**Description**: Test admin login functionality and session management

**Steps**:

1. Navigate to `/login`
2. Enter invalid credentials
3. Verify error message displays
4. Enter valid admin credentials (username: 'admin', password: 'admin')
5. Verify redirect to admin dashboard
6. Check session persistence across page refreshes
7. Test logout functionality

**Expected Result**: Admin can login, access restricted features, and logout successfully

### AUTH-002: Admin Default Mode (P0 - E2E)

**Description**: Test admin mode enabled by default in development

**Steps**:

1. Navigate to articles page
2. Verify admin controls are visible without login
3. Check delete buttons on article cards
4. Check edit buttons on article cards
5. Check bulk operations controls
6. Check ZIP upload functionality

**Expected Result**: Admin features accessible without explicit login when admin enabled by default

### AUTH-003: Admin Authorization Guards (P0 - SECURITY)

**Description**: Test API endpoint security for admin operations

**Steps**:

1. Call DELETE `/api/articles?slug=test` without admin key
2. Verify 401 Unauthorized response
3. Call PUT `/api/articles` without admin key
4. Verify 401 Unauthorized response
5. Call with valid admin key
6. Verify operations succeed

**Expected Result**: Admin operations require proper authentication

---

## 📚 Article Management System

### ART-001: Article CRUD Operations (P0 - E2E)

**Description**: Test complete article Create, Read, Update, Delete functionality

**Steps**:

1. Navigate to articles page in admin mode
2. Verify articles load and display correctly
3. Click on an article to read (Read operation)
4. Click edit button on article card
5. Modify title, content, tags in edit modal
6. Save changes (Update operation)
7. Verify changes appear on article card
8. Click delete button on article
9. Confirm deletion (Delete operation)
10. Verify article removed from list

**Expected Result**: All CRUD operations work seamlessly

### ART-002: Article Edit Modal Functionality (P1 - E2E)

**Description**: Test comprehensive article editing features

**Steps**:

1. Click edit button on any article
2. Verify modal opens with current article data
3. Edit title field and verify changes tracked
4. Edit summary field
5. Edit tags (comma-separated)
6. Edit category dropdown
7. Toggle featured checkbox
8. Edit cover image URL
9. Switch to content editor
10. Modify markdown content
11. Toggle preview mode
12. Verify markdown renders correctly
13. Test auto-save functionality
14. Save changes manually
15. Check "unsaved changes" indicator
16. Test close with unsaved changes warning

**Expected Result**: Edit modal provides comprehensive editing with real-time preview and change tracking

### ART-003: Article Search and Filtering (P1 - E2E)

**Description**: Test article discovery and filtering capabilities

**Steps**:

1. Navigate to articles page
2. Enter search term in search box
3. Verify filtered results
4. Clear search and verify all articles return
5. Click on a tag to filter by tag
6. Verify tag filtering works
7. Select category from dropdown
8. Verify category filtering works
9. Apply multiple filters (search + tag + category)
10. Use "Clear Filters" button
11. Verify all filters reset

**Expected Result**: Search and filtering work independently and in combination

### ART-004: Article Display and Layout (P1 - E2E)

**Description**: Test article presentation and responsive design

**Steps**:

1. Navigate to articles page
2. Verify articles display in grid layout
3. Check featured articles have special styling
4. Verify article cards show all metadata (title, summary, tags, category, date)
5. Test responsive behavior on different screen sizes
6. Check article card hover effects
7. Verify "no results" message when filters return empty
8. Test pagination if implemented

**Expected Result**: Articles display correctly with proper layout and responsive behavior

---

## 📁 File Operations & ZIP Management

### FILE-001: ZIP Download Functionality (P0 - E2E)

**Description**: Test individual article ZIP download feature

**Steps**:

1. Navigate to articles page in admin mode
2. Locate article with download button
3. Click "Download ZIP" button
4. Verify download initiated
5. Check downloaded ZIP file contains:
   - article.md file with content
   - metadata.json with article metadata
   - assets/ folder (if assets exist)
6. Verify ZIP filename matches article slug

**Expected Result**: ZIP download creates complete article package

### FILE-002: ZIP Upload Functionality (P0 - E2E)

**Description**: Test ZIP upload for importing articles

**Steps**:

1. Navigate to articles page in admin mode
2. Locate upload section
3. Select valid ZIP file(s) containing:
   - metadata.json
   - article.md
   - assets/ folder (optional)
4. Initiate upload
5. Verify upload progress indicators
6. Check upload results display
7. Verify uploaded articles appear in article list
8. Test invalid ZIP upload (missing required files)
9. Verify error handling for invalid uploads

**Expected Result**: ZIP upload successfully imports articles with proper feedback

### FILE-003: Bulk ZIP Operations (P1 - E2E)

**Description**: Test bulk export functionality

**Steps**:

1. Navigate to articles page in admin mode
2. Enable bulk mode
3. Select multiple articles using checkboxes
4. Use bulk download option (if available)
5. Verify bulk ZIP contains all selected articles
6. Test "Select All" functionality
7. Test partial selection
8. Verify bulk operation feedback

**Expected Result**: Bulk operations work efficiently for multiple articles

### FILE-004: Asset Management (P1 - INTEGRATION)

**Description**: Test article asset handling

**Steps**:

1. Access article with images/assets
2. Verify assets load correctly in article view
3. Check asset URLs resolve properly
4. Test asset download in ZIP export
5. Upload article with assets via ZIP
6. Verify assets extracted and accessible

**Expected Result**: Assets properly managed in upload/download operations

### FILE-005: PDF Export Functionality (P1 - E2E)

**Description**: Test article PDF generation

**Steps**:

1. Navigate to individual article page
2. Look for PDF export option
3. Generate PDF for article
4. Verify PDF contains:
   - Article title and metadata
   - Formatted content with proper styling
   - Mathematical formulas (if any)
   - Images and assets
5. Check PDF formatting and readability

**Expected Result**: PDF export generates properly formatted documents

---

## 🔄 Bulk Operations

### BULK-001: Bulk Selection Interface (P1 - E2E)

**Description**: Test bulk selection UI and controls

**Steps**:

1. Navigate to articles page in admin mode
2. Click "Bulk Mode" toggle
3. Verify checkboxes appear on article cards
4. Select individual articles
5. Verify selection count updates
6. Use "Select All" button
7. Verify all articles selected
8. Use "Deselect All" button
9. Verify selections cleared
10. Test bulk action toolbar appears when items selected

**Expected Result**: Bulk selection interface works intuitively

### BULK-002: Bulk Delete Operations (P0 - E2E)

**Description**: Test bulk deletion functionality

**Steps**:

1. Enable bulk mode
2. Select multiple articles (2-3 articles)
3. Click bulk delete button
4. Verify confirmation dialog appears
5. Confirm deletion
6. Verify progress feedback during deletion
7. Check selected articles removed from list
8. Verify bulk mode controls update correctly
9. Test canceling bulk delete

**Expected Result**: Bulk delete removes selected articles safely with proper confirmation

### BULK-003: Bulk Operations Performance (P2 - PERFORMANCE)

**Description**: Test bulk operations with large selections

**Steps**:

1. Enable bulk mode
2. Select large number of articles (10+ if available)
3. Perform bulk delete
4. Monitor operation performance
5. Verify UI remains responsive
6. Check error handling for failed operations

**Expected Result**: Bulk operations perform efficiently even with large selections

---

## 📊 Admin Dashboard

### DASH-001: Dashboard Overview (P1 - E2E)

**Description**: Test admin dashboard main interface

**Steps**:

1. Navigate to `/admin`
2. Verify access control (admin only)
3. Check dashboard loads with statistics:
   - Total articles count
   - Featured articles count
   - Categories count
   - Total tags count
4. Verify statistics reflect actual data
5. Test quick action buttons
6. Check recent activity section

**Expected Result**: Dashboard provides comprehensive overview of site statistics

### DASH-002: Dashboard Navigation (P1 - E2E)

**Description**: Test dashboard navigation and tabs

**Steps**:

1. Access admin dashboard
2. Click "Dashboard" tab (should be active by default)
3. Click "Analytics" tab
4. Verify tab switching works
5. Check content changes between tabs
6. Test "Back to Site" button
7. Verify navigation to main site

**Expected Result**: Dashboard navigation works smoothly between sections

### DASH-003: Quick Actions (P1 - E2E)

**Description**: Test dashboard quick action buttons

**Steps**:

1. Access admin dashboard
2. Click "Manage Articles" button
3. Verify navigation to articles page
4. Return to dashboard
5. Check disabled buttons (Analytics, Settings)
6. Verify they show "Coming Soon" status

**Expected Result**: Quick actions provide efficient access to main features

### DASH-004: System Information (P2 - E2E)

**Description**: Test system info display

**Steps**:

1. Access admin dashboard
2. Scroll to system information section
3. Verify admin mode status shows "Enabled"
4. Check backup status display
5. Verify storage type shows "Local Files"

**Expected Result**: System information accurately reflects current state

---

## 📈 Analytics System

### ANALYTICS-001: Analytics Dashboard (P1 - E2E)

**Description**: Test analytics dashboard functionality

**Steps**:

1. Navigate to admin dashboard
2. Click "Analytics" tab
3. Verify analytics dashboard loads
4. Check overview statistics:
   - Total views
   - Unique visitors
   - Average reading time
   - Tracked articles
5. Verify weekly views chart displays
6. Check top articles section
7. Review device breakdown chart

**Expected Result**: Analytics dashboard shows comprehensive engagement metrics

### ANALYTICS-002: Article View Tracking (P1 - INTEGRATION)

**Description**: Test article view tracking functionality

**Steps**:

1. Navigate to an article page
2. Spend time reading (simulate reading)
3. Navigate to analytics dashboard
4. Verify view count increased
5. Check reading time tracking
6. View same article again
7. Verify additional view recorded

**Expected Result**: Article views and reading times tracked accurately

### ANALYTICS-003: Analytics Data Management (P2 - E2E)

**Description**: Test analytics data clearing and management

**Steps**:

1. Access analytics dashboard with existing data
2. Click "Clear Data" button
3. Verify confirmation (if implemented)
4. Check analytics reset to empty state
5. Generate new analytics data
6. Verify tracking resumes correctly

**Expected Result**: Analytics data can be cleared and tracking resumes properly

### ANALYTICS-004: Device and Visitor Tracking (P2 - INTEGRATION)

**Description**: Test device type and visitor tracking

**Steps**:

1. Access site from different device types (if possible)
2. View articles from each device
3. Check analytics dashboard
4. Verify device breakdown reflects usage
5. Test unique visitor counting
6. Verify visitor counts appropriately

**Expected Result**: Device types and unique visitors tracked correctly

---

## 🎨 Theme and UI Features

### THEME-001: Theme Switching (P1 - E2E)

**Description**: Test theme toggle functionality

**Steps**:

1. Navigate to main page
2. Locate theme toggle button
3. Click to switch from light to dark theme
4. Verify color scheme changes throughout site
5. Switch back to light theme
6. Check theme persistence across page navigation
7. Test theme preference saving

**Expected Result**: Theme switching works smoothly with persistence

### THEME-002: Responsive Design (P1 - E2E)

**Description**: Test responsive behavior across devices

**Steps**:

1. Test desktop layout (1920x1080)
2. Test tablet layout (768x1024)
3. Test mobile layout (375x667)
4. Verify navigation adapts to screen size
5. Check article grid layout responsiveness
6. Test modal dialogs on mobile
7. Verify touch interactions work

**Expected Result**: Site adapts properly to all screen sizes

### THEME-003: Accessibility Features (P1 - ACCESSIBILITY)

**Description**: Test accessibility compliance

**Steps**:

1. Navigate site using keyboard only
2. Test tab order and focus indicators
3. Check ARIA labels on interactive elements
4. Verify color contrast ratios meet WCAG standards
5. Test screen reader compatibility
6. Check alt text on images
7. Verify form labels and error messages

**Expected Result**: Site meets accessibility standards

---

## 🔗 Navigation and User Experience

### NAV-001: Main Navigation (P0 - E2E)

**Description**: Test primary navigation functionality

**Steps**:

1. Navigate to home page
2. Click each navigation link:
   - Home/About section
   - Articles section  
   - Projects section
   - Contact section
3. Verify smooth scrolling to sections
4. Test navigation highlighting
5. Check mobile menu functionality

**Expected Result**: Navigation provides smooth access to all sections

### NAV-002: Article Navigation (P1 - E2E)

**Description**: Test article-specific navigation

**Steps**:

1. Navigate to articles page
2. Click on individual article
3. Verify article opens in dedicated page
4. Test back navigation
5. Check breadcrumb navigation (if implemented)
6. Test related articles suggestions (if implemented)

**Expected Result**: Article navigation is intuitive and functional

### NAV-003: Smooth Scrolling (P2 - E2E)

**Description**: Test smooth scrolling animations

**Steps**:

1. Navigate to home page
2. Click navigation links to different sections
3. Verify smooth scrolling animation
4. Test scroll speed and easing
5. Check scroll behavior on different devices

**Expected Result**: Smooth scrolling enhances user experience

### NAV-004: Heartbeat Animation (P2 - E2E)

**Description**: Test CTA button heartbeat animation

**Steps**:

1. Navigate to home page
2. Locate "Let's Talk" CTA button
3. Verify heartbeat animation is present
4. Check animation timing and smoothness
5. Test animation on different devices

**Expected Result**: CTA button displays heartbeat animation correctly

---

## ⚡ Performance and Loading

### PERF-001: Page Load Performance (P1 - PERFORMANCE)

**Description**: Test initial page load times

**Steps**:

1. Clear browser cache
2. Navigate to home page
3. Measure load time (should be < 3 seconds)
4. Navigate to articles page
5. Measure article listing load time
6. Test individual article load time

**Expected Result**: All pages load within acceptable time limits

### PERF-002: Image and Asset Loading (P1 - PERFORMANCE)

**Description**: Test asset loading optimization

**Steps**:

1. Navigate to articles with images
2. Check image lazy loading
3. Verify asset caching headers
4. Test progressive image loading
5. Check asset compression

**Expected Result**: Assets load efficiently with proper optimization

### PERF-003: Search Performance (P2 - PERFORMANCE)

**Description**: Test search functionality performance

**Steps**:

1. Navigate to articles page
2. Enter search terms quickly
3. Verify search responds without delay
4. Test search with large article collections
5. Check filtering performance

**Expected Result**: Search and filtering respond quickly

---

## 🔒 Security Tests

### SEC-001: XSS Protection (P0 - SECURITY)

**Description**: Test against cross-site scripting attacks

**Steps**:

1. Try to inject script tags in article content
2. Test XSS in search fields
3. Verify content sanitization
4. Test markdown rendering security

**Expected Result**: All user input properly sanitized

### SEC-002: CSRF Protection (P0 - SECURITY)

**Description**: Test CSRF protection on admin operations

**Steps**:

1. Attempt admin operations without proper headers
2. Test form submissions with invalid tokens
3. Verify proper request validation

**Expected Result**: CSRF attacks prevented

### SEC-003: Input Validation (P1 - SECURITY)

**Description**: Test input validation on all forms

**Steps**:

1. Test article edit form with invalid data
2. Try file uploads with malicious files
3. Test API endpoints with malformed data
4. Verify proper error handling

**Expected Result**: All inputs properly validated

---

## 📱 Mobile and Touch Features

### MOBILE-001: Touch Interactions (P1 - E2E)

**Description**: Test touch-specific functionality

**Steps**:

1. Test touch scrolling on mobile
2. Check swipe gestures (if implemented)
3. Test touch targets are appropriately sized
4. Verify mobile modal interactions
5. Test mobile navigation menu

**Expected Result**: Touch interactions work smoothly on mobile devices

### MOBILE-002: Mobile Layout (P1 - E2E)

**Description**: Test mobile-specific layouts

**Steps**:

1. Verify mobile navigation menu
2. Check mobile article grid layout
3. Test mobile modal dialogs
4. Verify mobile admin controls
5. Check mobile form layouts

**Expected Result**: Mobile layout provides optimal user experience

---

## 🔄 Error Handling and Edge Cases

### ERROR-001: Network Error Handling (P1 - E2E)

**Description**: Test behavior during network issues

**Steps**:

1. Simulate network disconnection
2. Try to load articles page
3. Verify appropriate error messages
4. Test retry mechanisms
5. Check offline behavior (if implemented)

**Expected Result**: Graceful error handling with user-friendly messages

### ERROR-002: Invalid Data Handling (P1 - E2E)

**Description**: Test handling of corrupted or invalid data

**Steps**:

1. Try to access non-existent article
2. Test with malformed article data
3. Upload invalid ZIP files
4. Verify error messages are helpful

**Expected Result**: Invalid data handled gracefully with clear error messages

### ERROR-003: Boundary Conditions (P2 - E2E)

**Description**: Test edge cases and limits

**Steps**:

1. Test with zero articles
2. Test with very long article titles
3. Test with empty search results
4. Upload maximum size files
5. Test with special characters in content

**Expected Result**: Edge cases handled appropriately

---

## 🧪 API Testing

### API-001: Articles API Endpoints (P0 - API)

**Description**: Test all article-related API endpoints

**Steps**:

1. GET `/api/articles` - verify article listing
2. GET `/api/articles/[slug]` - verify individual article
3. PUT `/api/articles` - test article update
4. DELETE `/api/articles?slug=[slug]` - test article deletion
5. Verify proper HTTP status codes
6. Check response data structure

**Expected Result**: All API endpoints function correctly with proper responses

### API-002: Asset API Endpoints (P1 - API)

**Description**: Test asset serving endpoints

**Steps**:

1. GET `/api/articles/[slug]/assets/[filename]` - test asset serving
2. GET `/api/articles/[slug]/pdf` - test PDF generation
3. Verify proper MIME types
4. Check caching headers
5. Test non-existent asset handling

**Expected Result**: Asset endpoints serve files correctly with proper headers

### API-003: Authentication API (P0 - API)

**Description**: Test authentication endpoints

**Steps**:

1. POST `/api/auth/login` with valid credentials
2. POST `/api/auth/login` with invalid credentials
3. Verify response format and status codes
4. Test rate limiting (if implemented)

**Expected Result**: Authentication API functions securely

---

## Test Execution Priority

### Phase 1 - Critical Path (P0)

1. AUTH-001, AUTH-002, AUTH-003
2. ART-001
3. FILE-001, FILE-002
4. BULK-002
5. API-001, API-003
6. SEC-001, SEC-002

### Phase 2 - Core Features (P1)

1. ART-002, ART-003, ART-004
2. DASH-001, DASH-002, DASH-003
3. ANALYTICS-001, ANALYTICS-002
4. THEME-001, THEME-002, THEME-003
5. NAV-001, NAV-002
6. All remaining P1 tests

### Phase 3 - Enhancement (P2)

1. All remaining P2 tests
2. Performance optimizations
3. Edge case handling
4. Additional accessibility tests

---

## Test Data Requirements

### Sample Articles

- Article with images/assets
- Article with long content
- Article with special characters
- Featured article
- Article with multiple tags and categories

### Test ZIP Files

- Valid article ZIP (metadata.json + article.md + assets/)
- Invalid ZIP (missing metadata.json)
- Empty ZIP file
- ZIP with malformed JSON

### User Accounts

- Admin user (admin/admin)
- Test invalid credentials

---

## Success Criteria

### All Tests Must Pass

- No critical (P0) test failures
- < 5% P1 test failures
- P2 test failures acceptable if documented

### Performance Benchmarks

- Page load times < 3 seconds
- Search response < 500ms
- File upload feedback immediate
- Bulk operations complete within reasonable time

### Accessibility Compliance

- WCAG 2.1 AA compliance
- Keyboard navigation functional
- Screen reader compatible

### Browser Compatibility

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 🔧 Backend Configuration & Multi-Backend Support

### BACKEND-001: Backend Selector Interface (P1 - E2E)

**Description**: Test backend configuration interface in admin panel

**Steps**:

1. Navigate to admin dashboard
2. Click on "Backend" tab
3. Verify backend selector interface loads
4. Check current backend status shows "filesystem"
5. Test "Configure" button toggles configuration panel
6. Verify backend type selector shows filesystem, database, CMS options
7. Test cancel functionality returns to previous state

**Expected Result**: Backend selector interface is accessible and functional

### BACKEND-002: Database Backend Configuration (P1 - INTEGRATION)

**Description**: Test database backend configuration with different database types

**Steps**:

1. Open backend configuration panel
2. Select "Database" backend type
3. Test PostgreSQL configuration:
   - Select PostgreSQL from dropdown
   - Enter host, port, database name, username
   - Verify all fields are properly validated
4. Test MySQL configuration:
   - Switch to MySQL
   - Verify port defaults to 3306
   - Test required field validation
5. Test SQLite configuration:
   - Switch to SQLite
   - Verify filename field appears
   - Verify host/port fields are hidden
6. Test "Test Connection" button (mock response)
7. Save configuration and verify persistence

**Expected Result**: Database configuration supports all three database types with proper validation

### BACKEND-003: CMS Backend Configuration (P1 - INTEGRATION)

**Description**: Test CMS backend configuration for different CMS platforms

**Steps**:

1. Select "CMS" backend type
2. Test Strapi configuration:
   - Select Strapi from dropdown
   - Enter API URL and API key
   - Verify configuration format
3. Test Contentful configuration:
   - Switch to Contentful
   - Verify Space ID and Environment fields appear
   - Test field validation
4. Test Sanity configuration:
   - Switch to Sanity
   - Verify Project ID and Dataset fields appear
5. Test Ghost configuration:
   - Switch to Ghost
   - Verify standard API URL/key fields
6. Test custom API configuration:
   - Select Custom API
   - Verify custom headers option
7. Test connection validation
8. Save and verify persistence

**Expected Result**: CMS configuration supports all platforms with platform-specific fields

### BACKEND-004: Backend Connection Testing (P1 - UNIT)

**Description**: Test backend connection validation functionality

**Steps**:

1. Configure a database backend with invalid credentials
2. Click "Test Connection" button
3. Verify loading state displays
4. Verify error state displays for invalid config
5. Configure valid credentials (mocked)
6. Test connection again
7. Verify success state displays
8. Test connection testing for CMS backends
9. Verify appropriate error messages for different failure types

**Expected Result**: Connection testing provides clear feedback for success/failure states

### BACKEND-005: Backend Migration Tools (P2 - INTEGRATION)

**Description**: Test article migration between different backends

**Steps**:

1. Set up source backend with test articles
2. Configure target backend
3. Access migration tools interface
4. Test dry-run migration:
   - Enable dry-run mode
   - Start migration
   - Verify progress reporting
   - Check migration summary
5. Test actual migration:
   - Disable dry-run mode
   - Configure batch size
   - Start migration
   - Monitor progress
6. Verify migration results:
   - Check success/failure counts
   - Review error messages
   - Validate migrated articles

**Expected Result**: Migration tools safely transfer articles between backends with progress tracking

### BACKEND-006: Fallback Backend Configuration (P2 - INTEGRATION)

**Description**: Test fallback backend setup and sync functionality

**Steps**:

1. Configure primary backend (filesystem)
2. Enable "Advanced Options"
3. Configure fallback backend (database)
4. Enable automatic sync
5. Test sync functionality:
   - Add article to primary backend
   - Trigger sync operation
   - Verify article appears in fallback backend
6. Test sync conflict resolution:
   - Modify article in both backends
   - Trigger sync
   - Verify conflict handling
7. Test fallback failover:
   - Simulate primary backend failure
   - Verify automatic fallback

**Expected Result**: Fallback backend provides redundancy with automatic sync capabilities

### BACKEND-007: Backend Persistence and State Management (P1 - UNIT)

**Description**: Test backend configuration persistence and state management

**Steps**:

1. Configure a database backend with all settings
2. Save configuration
3. Refresh page
4. Verify configuration persists in localStorage
5. Switch to different backend type
6. Save new configuration
7. Verify old configuration is replaced
8. Test configuration validation on load
9. Test handling of corrupted configuration data

**Expected Result**: Backend configuration persists correctly across sessions

### BACKEND-008: Multi-Backend Service Integration (P0 - INTEGRATION)

**Description**: Test integration between backend services and existing article features

**Steps**:

1. Configure database backend
2. Test article CRUD operations:
   - Create new article via admin interface
   - Verify article saved to database
   - Edit article content
   - Delete article
3. Test bulk operations:
   - Select multiple articles
   - Perform bulk delete
   - Verify database consistency
4. Test file operations:
   - Upload ZIP file with articles
   - Verify articles processed correctly
   - Export articles as ZIP
   - Generate PDF for article
5. Test search functionality:
   - Search for articles
   - Verify database queries work
6. Switch to CMS backend and repeat tests

**Expected Result**: All existing article features work seamlessly with new backend services

### BACKEND-009: Backend Error Handling (P1 - UNIT)

**Description**: Test error handling for backend operations

**Steps**:

1. Configure backend with network connectivity issues
2. Test various operations:
   - Get all articles
   - Create article
   - Update article
   - Delete article
3. Verify appropriate error messages display
4. Test timeout handling
5. Test invalid response handling
6. Test authentication failure handling
7. Verify graceful degradation to fallback backend
8. Test error recovery after connectivity restored

**Expected Result**: Backend errors are handled gracefully with informative user feedback

### BACKEND-010: Backend Security and Authentication (P0 - SECURITY)

**Description**: Test backend security measures and authentication

**Steps**:

1. Test database backend:
   - Verify SQL injection protection
   - Test connection string validation
   - Check credential encryption in storage
2. Test CMS backend:
   - Verify API key security
   - Test token refresh mechanisms
   - Check unauthorized access handling
3. Test configuration security:
   - Verify sensitive data not logged
   - Check localStorage data encryption
   - Test configuration export/import security
4. Test admin access controls:
   - Verify backend config requires admin auth
   - Test unauthorized access prevention

**Expected Result**: Backend configurations and operations maintain security standards

---

---

## 📝 Article Template System

### TEMP-001: Template Manager Interface (P0 - E2E)

**Description**: Test template management interface in admin dashboard

**Steps**:
1. Navigate to `/admin`
2. Click on "Templates" tab
3. Verify template manager container loads
4. Check title and subtitle display
5. Verify "Create Template" button is visible
6. Check category filter section displays
7. Verify templates grid loads with predefined templates

**Expected Result**: Template manager interface displays correctly with all navigation elements

### TEMP-002: Template Category Filtering (P1 - E2E)

**Description**: Test template filtering by category

**Steps**:
1. Navigate to admin Templates tab
2. Click on "All Templates" filter
3. Note total template count
4. Click on "Tutorial" category filter
5. Verify only tutorial templates are shown
6. Check category filter styling (active state)
7. Repeat for other categories (Review, Case Study, etc.)

**Expected Result**: Templates filter correctly by category with visual feedback

### TEMP-003: Template Preview Functionality (P1 - E2E)

**Description**: Test template preview modal

**Steps**:
1. Navigate to admin Templates tab
2. Click "Preview" button on any template
3. Verify preview modal opens
4. Check modal header shows template name
5. Verify metadata section displays correctly
6. Check content structure preview is visible
7. Test closing modal with close button
8. Test closing modal with Escape key

**Expected Result**: Template preview shows complete template structure and metadata

### TEMP-004: Predefined Templates Content (P0 - UNIT)

**Description**: Validate predefined template content and structure

**Steps**:
1. Load template service
2. Get all predefined templates
3. Verify tutorial template has proper structure
4. Check review template has all required sections
5. Validate case study template completeness
6. Ensure all templates have required metadata
7. Verify template content contains placeholders

**Expected Result**: All predefined templates have consistent structure and complete content

### TEMP-005: Template Storage Persistence (P1 - INTEGRATION)

**Description**: Test template storage in local storage

**Steps**:
1. Create a custom template
2. Save template
3. Refresh the page
4. Navigate back to Templates tab
5. Verify custom template persists
6. Delete custom template
7. Refresh page again
8. Verify template is removed

**Expected Result**: Custom templates persist across sessions and can be managed

### TEMP-006: Article Creation from Template (P0 - E2E)

**Description**: Test creating articles using templates

**Steps**:
1. Navigate to admin Templates tab
2. Click "Use Template" on tutorial template
3. Verify redirect to article creation (if implemented)
4. OR verify template data is properly prepared
5. Check metadata pre-population
6. Verify content structure is generated
7. Test customization options

**Expected Result**: Templates generate properly structured article content with metadata

### TEMP-007: Template Service API (P0 - UNIT)

**Description**: Test template service methods and data handling

**Steps**:
1. Test getAllTemplates() returns predefined + custom templates
2. Test getTemplatesByCategory() filters correctly
3. Test getTemplate() by ID returns correct template
4. Test saveTemplate() creates new custom template
5. Test updateTemplate() modifies existing template
6. Test deleteTemplate() removes custom template
7. Test createArticleFromTemplate() generates article data

**Expected Result**: All template service methods work correctly with proper data validation

### TEMP-008: Template Category Organization (P1 - E2E)

**Description**: Test template categorization and organization

**Steps**:
1. Navigate to admin Templates tab
2. Verify all category buttons are present
3. Check category icons display correctly
4. Verify template counts per category
5. Test category descriptions (if displayed)
6. Check custom category for user templates

**Expected Result**: Templates are properly organized by category with clear navigation

### TEMP-009: Template Multilingual Support (P1 - E2E)

**Description**: Test template interface in different languages

**Steps**:
1. Navigate to admin Templates tab (English)
2. Verify English interface text
3. Switch to German language
4. Navigate to Templates tab
5. Verify German translations display
6. Check template names and descriptions
7. Test switching back to English

**Expected Result**: Template interface supports both English and German languages

### TEMP-010: Template Error Handling (P1 - E2E)

**Description**: Test template system error handling

**Steps**:
1. Navigate to Templates tab
2. Try to access non-existent template
3. Verify error handling for missing templates
4. Test template creation with invalid data
5. Check error messages are user-friendly
6. Verify system gracefully handles storage errors

**Expected Result**: Template system handles errors gracefully with helpful user feedback

---

*This test suite covers all implemented features and ensures comprehensive quality assurance for the portfolio application, with special emphasis on article management, file upload/download functionality, multi-backend architecture, and the new article template system.*
- Clean up test artifacts after execution
- Mock external dependencies where appropriate

---

**Last Updated**: August 16, 2025
**Version**: 1.1.0
**Maintainer**: Development Team
