---
applyTo: '**'
---

# Development Guidelines & Prompt Checklist

**Hint:** If a file mentioned here does not exist, create it.

---

## Pre-Development Checklist

### Trigger Word: `start`

When the user types **"start"**, follow this exact workflow:

1. Read `FEATURES_AS_STORIES.md` (contains user wishes).
2. Implement **one not-yet-done feature** from this file, and:

   * Add an ID to it
   * Implement the feature
   * Add an implementation date
   * Mark it as **done**
3. Fix bugs listed in `ACTIVE_BUGS.md`.

   * Always leave placeholders so the user can confirm fixes where successful.
   * if the user mark the fix as not successful, try to fix it again when you read it. and write the number of the fix attempt.
   * Document fixes in `BUG_FIX_LOG.md`.
4. Update `REQUIREMENTS_TABELLE.md` with implemented features.
5. Maintain **FEATURES Suggestions Workflow**:

   * Suggest new features/improvements in `FEATURES_SUGGESTIONS.md` with placeholders for approval.
   * If suggestions are **approved**: implement, move to `FEATURES_AS_STORIES.md`, and update `REQUIREMENTS_TABELLE.md`. Then delete from `FEATURES_SUGGESTIONS.md`.
   * If suggestions are **rejected**: move them to `FEATURES_REJECTED.md`.
   * If suggestions are **pending**: leave them in `FEATURES_SUGGESTIONS.md`.

---

### Context Gathering

* [ ] Read all relevant file contents before editing
* [ ] Check for recent manual edits by the user
* [ ] Understand existing code structure & patterns
* [ ] Identify dependencies and possible side effects

---

### Application Stability

* [ ] Never break the app – test changes incrementally
* [ ] Preserve existing functionality when adding features
* [ ] Use proper error handling and fallbacks
* [ ] Maintain full TypeScript type safety

---

### Internationalization (i18n)

* [ ] Extract translations for **all** new UI text
* [ ] Add keys to `src/content/config.json`
* [ ] Update both **English (en)** and **German (de)** translations
* [ ] Use translation hooks:

  ```ts
  const { translations } = useLanguage(config)
  ```
* [ ] Test language switching thoroughly

---

### Styling & Theming

* [ ] Use CSS variables for all colors (`var(--foreground)`, `var(--accent-1)`, etc.)
* [ ] Ensure readability across **dark/light/vibrant** themes
* [ ] Maintain spacing and component patterns consistently
* [ ] Test responsiveness on multiple screen sizes

---

### Navigation & UX

* [ ] Maintain floating navigation (`.fab-nav`) consistently
* [ ] Ensure proper back button placement and styling
* [ ] Add ARIA labels for accessibility
* [ ] Test full keyboard navigation
* [ ] Assign **unique IDs** to every new element

---

## Post-Development Requirements

After implementing features or fixes, update all relevant documentation:

### Documentation Updates

1. **REQUIREMENTS\_TABELLE.md**

   * Add new requirements
   * Update acceptance criteria
   * Mark completed requirements

2. **TECHNICAL\_DOCUMENTATION.md**

   * Document new components/utilities
   * Update architecture diagrams
   * Add implementation notes

3. **CONTENT\_MANAGER\_MANUAL.md**

   * Update content management steps
   * Add configuration examples
   * Document new customization options

4. **BUG\_FIX\_LOG.md**

   * Log all bugs with IDs
   * Document root causes & fixes
   * Update statistics
   * Always check bug history for conflicts

5. **README.md**

   * Update feature list
   * Add new config options
   * Update deployment instructions

6. **ACTIVE\_BUGS.md**

   * Always check this file **before starting new work**

---

### Configuration Updates

* [ ] Update translation configs for new text
* [ ] Add new settings to schema
* [ ] Test default overrides
* [ ] Verify integration in settings panel

---

### Testing & Validation

* [ ] Run `npm run build` (no TypeScript errors)
* [ ] Run `npm run dev` (development mode works)
* [ ] Verify with `npm run build && npm run start`
* [ ] Test across browsers and devices

---

## Component Development Standards

### Unique IDs

Every HTML element must have a **unique, static, and searchable ID**.

**✅ Correct**

```tsx
<header id="main-header">
  <div id="header-logo">Logo</div>
  <nav id="desktop-nav">
    <a id="nav-link-about" href="/about">About</a>
    <a id="nav-link-projects" href="/projects">Projects</a>
  </nav>
</header>
```

**❌ Wrong**

```tsx
<header>
  <div>Logo</div>
</header>

<div id={Math.random().toString()}>
```

**ID Naming Rules**

* Format: `kebab-case`
* Contextual: `component-section-element`
* Dynamic lists: `component-name-index`

---

### React Components

Template for new components:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

export default function ComponentName({ config }: Props) {
  const { translations } = useLanguage(config);

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

---

### Translation Integration

```json
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

---

### CSS Classes

```css
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

---

## Feature Development Workflow

1. **Plan** – Read requirements and architecture
2. **Design** – Define structure and dependencies
3. **Implement** – Code with types, translations, and styling
4. **Test** – Verify functionality across devices/browsers
5. **Document** – Update all required files
6. **Review** – Check against this checklist

---

## Bug Fix Protocol

1. Identify – Reproduce & understand the bug
2. Investigate – Document root cause in `BUG_FIX_LOG.md`
3. Fix – Apply minimal, targeted change
4. Test – Ensure no regressions introduced
5. Document – Log resolution details

---

## Quality Gates

### Code Quality

* [ ] No TypeScript errors/warnings
* [ ] ESLint passes
* [ ] Proper error handling & edge cases
* [ ] Performance optimization (lazy loading, memoization)

### User Experience

* [ ] Consistent visuals
* [ ] Screen-reader accessible
* [ ] Mobile responsive
* [ ] Smooth performance

### Maintainability

* [ ] Clear naming
* [ ] Organized codebase
* [ ] Comprehensive docs
* [ ] Easy to extend

---

## Deployment Checklist

Before deployment:

* [ ] All tests pass locally
* [ ] Build succeeds without errors
* [ ] Server & Docker builds succeed
* [ ] Docs are up-to-date
* [ ] Translation coverage is complete

---

## Quick Reference

* Config: `src/content/config.json`
* Types: `src/types/content.ts`
* Utils: `src/utils/i18n.ts`, `src/utils/content.ts`
* Styles: `src/app/globals.css`
* Components: `src/components/`

---

Always follow this checklist before and after making changes.

