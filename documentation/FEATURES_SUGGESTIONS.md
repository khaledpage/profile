# Feature Suggestions

This file contains suggested features and improvements based on recent implementations and user feedback.

## Pending Suggestions (Awaiting Approval)

### SUGGESTION-001: Article Edit Functionality
**Description**: Add inline editing capabilities for articles in admin mode
**Rationale**: Since delete functionality is now available, adding edit would complete the CRUD operations
**Implementation**: 
- Add edit button next to delete button on article cards
- Modal editor with markdown preview
- Auto-save functionality
**Status**: Pending approval

### SUGGESTION-002: Bulk Article Operations  
**Description**: Allow admin to select multiple articles for bulk operations (delete, export, etc.)
**Rationale**: Improves efficiency when managing multiple articles
**Implementation**:
- Checkbox selection on article cards in admin mode
- Bulk action toolbar when articles are selected
- Confirmation dialogs for bulk operations
**Status**: approved

### SUGGESTION-003: Article Upload Progress Indicator
**Description**: Show progress bar during ZIP file uploads and processing
**Rationale**: Current upload feedback could be improved with visual progress
**Implementation**:
- Progress bar during file processing
- Processing status for each uploaded file
- Success/error indicators per file
**Status**: approved

### SUGGESTION-004: Navigation Smooth Scrolling Enhancement
**Description**: Add smooth scrolling behavior to navigation links
**Rationale**: Now that navigation IDs are fixed, smooth scrolling would improve UX
**Implementation**:
- CSS scroll-behavior or JavaScript smooth scrolling
- Offset for fixed header
- Focus management for accessibility
**Status**: Pending approval

### SUGGESTION-005: Admin Dashboard Page
**Description**: Dedicated admin dashboard with content management overview
**Rationale**: Centralized admin interface would be more intuitive than scattered admin controls
**Implementation**:
- `/admin` route with authentication check
- Article management, settings, and analytics
- Quick actions and recent activity
**Status**: Pending approval

---

## Instructions for Developer

To approve a suggestion:
1. Change status to "Approved" 
2. Move to FEATURES_AS_STORYS.md for implementation

To reject a suggestion:
1. Change status to "Rejected - [reason]"
2. Move to FEATURES_REJECTED.md for history

Leave status as "Pending approval" if undecided.
