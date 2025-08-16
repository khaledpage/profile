# Comprehensive Test Cases

This document contains all test cases for the portfolio application, covering every feature and functionality.

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

*This test suite covers all implemented features and ensures comprehensive quality assurance for the portfolio application, with special emphasis on article management and file upload/download functionality as requested.*
- Clean up test artifacts after execution
- Mock external dependencies where appropriate

---

**Last Updated**: 2024-12-19
**Version**: 1.0.0
**Maintainer**: Development Team
