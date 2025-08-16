---
applyTo: '**'
---

# Development Guidelines & Prompt Checklist

hint: if there are missing files, that are mentioned here, just create them.

## 📋 Pre-Development Checklist

Before making any changes, ensure you follow these steps:

### Feature to implement and bugs to fix and suggestion to make by the trigger word "start"
- Read the file FEATURES_AS_STORIES.md where the user write his wishes.
- when the user only type "start" he means go implment the story in FEATURES_AS_STORIES.md  and fix bugs from the STOCKING_BUGS.txt
- refactore and fix the user wisches in FEATURES_AS_STORIES.md
- Add id to it and implement the feature.
- Add implementation date and mark it as done.
- Only implement one feature that is not done yet.
- you need also to update the `Requirements-Tabelle.md` as well with the implemented features and the BUG_FIX_LOG.md with the fixed bug
- suggest new features or improvements based on the implemented changes in `FEATURES_SUGGESTIONS.md` and add place holder for the dev to accept or reject them. if you finde approved features in the file `FEATURES_SUGGESTIONS.md` implement them and update `FEATURES_AS_STORIES.md` accordingly and Requirements-Tabelle.md then remove them form `FEATURES_SUGGESTIONS.md`. if some of suggestions are not approved, dont implemnt them and move them to `FEATURES_REJECTED.md` for history, so you dont suggest them again. if the dev didnt accept or reject the suggestion, just leave them in `FEATURES_SUGGESTIONS.md` for future consideration.


### 🔍 Context Gathering

- [ ] Read current file contents before editing
- [ ] Check for recent manual edits by the user
- [ ] Understand the existing code structure and patterns
- [ ] Identify dependencies and potential side effects

### 🚨 Application Stability

- [ ] **NEVER break the app** - Test changes incrementally
- [ ] Preserve existing functionality while adding new features
- [ ] Use proper error handling and fallbacks
- [ ] Maintain TypeScript type safety

### 🌍 Internationalization (i18n)

- [ ] **Extract translations** for ALL new UI text
- [ ] Add translation keys to `src/content/config.json`
- [ ] Update both English (`en`) and German (`de`) translations
- [ ] Use translation hooks in components: `const { translations } = useLanguage(config)`
- [ ] Test with different languages

### 🎨 Styling & Theming

- [ ] Use CSS variables for colors: `var(--foreground)`, `var(--accent-1)`, etc.
- [ ] Ensure readability across all themes (dark/light/vibrant)
- [ ] Maintain consistent spacing and component patterns
- [ ] Test responsive design on different screen sizes

### 🧭 Navigation & UX

- [ ] Maintain consistent floating navigation (`.fab-nav` class)
- [ ] Ensure proper back button positioning and styling
- [ ] Add proper ARIA labels for accessibility
- [ ] Test keyboard navigation
- [ ] Each new element must have a unique ID

## 📝 Post-Development Requirements

After implementing any feature or fix:

### 📚 Documentation Updates
Always update these files when relevant:

1. **Requirements-Tabelle.md**
   - Add new requirement entries for features
   - Update acceptance criteria
   - Mark completed requirements

2. **TECHNICAL_DOCUMENTATION.md**
   - Document new components and utilities
   - Update architecture diagrams
   - Add implementation details

3. **CONTENT_MANAGER_MANUAL.md**
   - Add content management instructions
   - Update configuration examples
   - Document new customization options

4. **BUG_FIX_LOG.md**
   - Log all bugs with proper IDs
   - Document root causes and fixes
   - Update statistics
   - Always read bug history if it relevant to the new feature/bug fix, so no conflicts are introduced.

5. **README.md**
   - Update feature lists
   - Add new configuration options
   - Update deployment instructions

6. **sSTOCKING_BUGS.txt**
   - Always check this file for known issues before starting new work.

### 🔧 Configuration Updates
- [ ] Update translation configs for new text
- [ ] Add new settings to configuration schema
- [ ] Test custom defaults override functionality
- [ ] Verify settings panel integration

### 🧪 Testing & Validation
- [ ] Run `npm run build` to ensure no TypeScript errors
- [ ] Test in development mode: `npm run dev`
- [ ] Verify dev build: `npm run build` and `npm run start`
- [ ] Test across different browsers and devices

## 🎯 Component Development Standards

### Unique Element IDs (Required)

**Every HTML element MUST have a unique, hardcoded ID for code searchability:**

```tsx
// ✅ Good: Static, searchable IDs
<header id="main-header">
  <div id="header-logo">Logo</div>
  <nav id="desktop-nav">
    <a id="nav-link-about" href="/about">About</a>
    <a id="nav-link-projects" href="/projects">Projects</a>
  </nav>
  <button id="header-cta-button">Get Started</button>
</header>

// ✅ Good: Dynamic but predictable IDs based on content
<div id="skill-group-frontend">
  <div id="skill-item-frontend-0">React</div>
  <div id="skill-item-frontend-1">TypeScript</div>
</div>

// ❌ Bad: No IDs
<header>
  <div>Logo</div>
  <nav>
    <a href="/about">About</a>
  </nav>
</header>

// ❌ Bad: Random or completely dynamic IDs
<div id={Math.random().toString()}>
<div id={`dynamic-${Date.now()}`}>
```

**ID Naming Convention:**

- Use kebab-case (lowercase with hyphens)
- Include semantic context: `component-section-element`
- For dynamic content: `component-contentname-index`
- Examples: `hero-section`, `article-card-react-guide`, `skill-item-react-0`

### React Components

```tsx
// Template for new components
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
  // ... other props
};

export default function ComponentName({ config }: Props) {
  const { translations } = useLanguage(config);
  
  // Component logic
  
  return (
    <div id="component-name-container" style={{ color: 'var(--foreground)' }}>
      <h2 id="component-name-title">
        {translations?.section?.key || 'Fallback Text'}
      </h2>
      <button id="component-name-action-button">
        {translations?.section?.button || 'Action'}
      </button>
    </div>
  );
}
```

### Translation Integration

```typescript
// Always add to config.json
"languages": {
  "en": {
    "newSection": {
      "title": "Section Title",
      "description": "Section description",
      "button": "Action Button"
    }
  },
  "de": {
    "newSection": {
      "title": "Bereich Titel",
      "description": "Bereich Beschreibung", 
      "button": "Aktions Schaltfläche"
    }
  }
}
```

### CSS Classes & Styling

```css
/* Use existing patterns */
.fab-nav {
  position: fixed;
  right: 1rem;
  bottom: 5.5rem;
  z-index: 40;
}

.glass {
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--card), transparent 20%);
  border: 1px solid color-mix(in srgb, var(--foreground), transparent 90%);
}

.btn-primary {
  background: linear-gradient(to right, var(--accent-1), var(--accent-2));
  color: var(--card-contrast);
}
```

## 🔄 Feature Development Workflow

1. **Plan**: Understand requirements and existing architecture
2. **Design**: Create component structure and identify dependencies
3. **Implement**: Code with proper types, translations, and styling
4. **Test**: Verify functionality and cross-browser compatibility
5. **Document**: Update all relevant documentation files
6. **Review**: Check against this checklist before submission

## 🐛 Bug Fix Protocol

1. **Identify**: Reproduce and understand the bug
2. **Investigate**: Find root cause and document in BUG_FIX_LOG.md
3. **Fix**: Implement minimal, targeted solution
4. **Test**: Verify fix doesn't break existing functionality
5. **Document**: Update bug log with resolution details

## 📊 Quality Gates

### Code Quality

- [ ] No TypeScript errors or warnings
- [ ] ESLint passes without errors
- [ ] Proper error handling and edge cases
- [ ] Performance considerations (lazy loading, memoization)

### User Experience

- [ ] Consistent visual design
- [ ] Accessible to screen readers
- [ ] Mobile-responsive
- [ ] Fast loading and smooth animations

### Maintainability

- [ ] Clear component and function names
- [ ] Proper code organization
- [ ] Comprehensive documentation
- [ ] Easy to extend and modify

## 🚀 Deployment Checklist

Before any deployment:

- [ ] All tests pass locally
- [ ] Build succeeds without errors
- [ ] Server build works and Docker build completes successfully
- [ ] Docker build completes successfully
- [ ] Documentation is up to date
- [ ] Translation coverage is complete

## 🔗 Quick Reference Links

- **Config**: `src/content/config.json`
- **Types**: `src/types/content.ts`
- **Utils**: `src/utils/i18n.ts`, `src/utils/content.ts`
- **Styles**: `src/app/globals.css`
- **Components**: `src/components/`

---

*Always refer to this checklist before and after making changes to ensure consistency and quality.*
