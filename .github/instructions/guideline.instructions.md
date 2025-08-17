---
applyTo: '**'
---

# Development Guidelines & Checklist (Rewritten)

Hints
- If a referenced file is missing, create it.
- Never stop or close the server on port 3000 — it must remain running for e2e tests.
- Implement article code as a reusable, self-contained module (usable in backend and UI).
- UI tests must handle a cookie consent banner — tests may fail if not accepted.
- Running Playwright tests can sometimes hang while serving the HTML report (http://localhost:9323). Be aware and close the report to continue.

---

## Quick "start" Workflow (Exact procedure)
When the user types "start", perform these steps in order:

1. Read FEATURES_AS_STORIES.md.
2. Implement one incomplete story:
  - Assign a unique ID.
  - Implement the feature.
  - Add implementation date.
  - Mark the story as done.
3. Address ACTIVE_BUGS.md:
  - Reword each bug concisely.
  - Leave a user-verification placeholder before closing a bug.
  - If the fix fails, retry and log attempt number.
  - Record each fix in BUG_FIX_LOG.md.
4. Update REQUIREMENTS_TABELLE.md with statuses.
5. Follow the FEATURE SUGGESTIONS workflow:
  - Add suggestions to FEATURES_SUGGESTIONS.md with an approval placeholder.
  - If approved: implement -> add to FEATURES_AS_STORIES.md (with ID) -> update REQUIREMENTS_TABELLE.md -> remove from suggestions.
  - If rejected: move to FEATURES_REJECTED.md with reason.
  - If pending: keep in suggestions with required-info placeholders.
6. For each new feature/bug fix:
  - Add test cases in TEST_CASES.md.
  - Implement automated tests (Playwright) covering unit, integration, and e2e flows.
7. Consider work complete only when all relevant tests pass. Record results and blockers.
8. Log all attempts in problem_solving_log.md (description, steps, result, attempt number). Read this file first to avoid repeating failed approaches.

---

## Pre-Edit Context Gathering
- Read related files: features, bugs, config, recent edits.
- Note architecture, dependencies, side effects, and authoritative files for requirements/translations.
- Identify migrations, test gaps, and CI impacts.
- List open questions or unknowns for user confirmation.

---

## Stability & Safety Goals
- Do not break the app; test changes incrementally.
- Preserve existing behavior when adding features.
- Use explicit error handling and fallbacks.
- Maintain TypeScript type safety.

---

## Internationalization (i18n)
- Extract translations for any new UI text.
- Add keys to src/content/config.json and provide en/de entries.
- Use translations via:
  const { translations } = useLanguage(config)
- Test language switching thoroughly.

---

## Styling & Theming
- Use CSS variables for all colors (e.g., var(--foreground), var(--accent-1)).
- Ensure readability across themes and screen sizes.
- Keep consistent spacing and component patterns.

---

## Navigation & UX
- Keep floating navigation (.fab-nav) consistent.
- Ensure back button placement and ARIA labels.
- Test full keyboard navigation.
- Assign unique IDs to every new element.

---

## Component Development Standards

Unique ID rules
- Every element must have a unique, static, searchable ID.
- ID format: kebab-case, contextual (component-section-element).
- Dynamic lists: use component-name-index.

React Client Component Pattern
- Use this template for new client components:

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

- Add translation keys in src/content/config.json for en and de.

CSS examples
  .fab-nav { position: fixed; right: 1rem; bottom: 5.5rem; z-index: 40; }
  .glass { backdrop-filter: blur(12px); background: color-mix(in srgb, var(--card), transparent 20%); border: 1px solid color-mix(in srgb, var(--foreground), transparent 90%); }
  .btn-primary { background: linear-gradient(to right, var(--accent-1), var(--accent-2)); color: var(--card-contrast); }

---

## Testing & Validation
- Ensure builds succeed: npm run build (no TypeScript errors).
- Verify dev and production flows: npm run dev and npm run build && npm run start.
- Run Playwright tests; include cookie-banner and i18n flows.
- Fix failing tests before marking work done.

---

## Bug Fix Protocol
1. Reproduce and understand the bug.
2. Document root cause in BUG_FIX_LOG.md.
3. Apply minimal targeted fix.
4. Test for regressions.
5. Document resolution and attempt counts.
- Leave placeholders in ACTIVE_BUGS.md for user verification before moving to CLOSED_BUGS.md.

---

## Documentation to Update After Work
- REQUIREMENTS_TABELLE.md
- TECHNICAL_DOCUMENTATION.md
- CONTENT_MANAGER_MANUAL.md
- BUG_FIX_LOG.md
- README.md
- ACTIVE_BUGS.md

---

## Configuration & Quality Gates
- Add new translation keys and settings to schema.
- Verify settings panel integration.
- Ensure no TypeScript errors or ESLint warnings.
- Implement proper edge-case handling and performance considerations.

---

## Maintainability & UX Checks
- Use clear naming and organized structure.
- Ensure screen-reader accessibility and responsiveness.
- Maintain good performance and easy extensibility.

---

## Deployment Checklist
- All tests pass locally.
- Build succeeds.
- Server and Docker builds succeed.
- Documentation and translation coverage are up-to-date.

---

## Quick Reference
- Config: src/content/config.json
- Types: src/types/content.ts
- Utils: src/utils/i18n.ts, src/utils/content.ts
- Global styles: src/app/globals.css
- Components: src/components/

Always follow this checklist before and after making changes.
