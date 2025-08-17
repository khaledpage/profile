---
applyTo: '**'
---

Purpose
- Provide a concise, repeatable process for handling requests that change the codebase, ensuring requirements and change history are always up-to-date and reproducible.

Primary workflow
1. Locate context files
    - Open Requirements_tabelle.md and Change_log.md. Check both repository root and .github/instructions/.
    - If either file is missing, create it using the templates below.

2. Implement the requested change
    - Make the required code changes, add/update tests, run linters/formatters, and verify the build locally.
    - Always create new HTML elements with hard-coded unique IDs. Not dynamically generated ones.
    - New html elements with text, the text should be extracted to the translation files.
    - All styling should be in the CSS files and not inline, so it can be easily maintained and updated and related to the overall design system.

3. Update the change log
    - Add a new entry to Change_log.md including: date, author, short summary, files changed, commit hash/PR link.
    - Keep entries short and actionable so the history is easy to scan.

4. Update the requirements table
    - Reflect any new or modified requirements in Requirements_tabelle.md: add IDs, descriptions, rationale, priority, acceptance criteria, status, owner, and related files/modules.
    - Ensure the table is sufficient for another team to reproduce and build the application from scratch.

5. Finalize
    - Push the branch, open a PR referencing the change log and requirement IDs, and include QA/testing notes.
    - Add reviewers and resolve feedback before merging.

Templates

Change_log.md template
# Change Log
Follow: Date | Author | Summary | Files changed | Commit/PR
Example:
2025-08-17 | Khaled Alabsi | Improve guideline instructions; add templates | .github/instructions/guideline.instructions.md | commit abc123 / PR #42

Requirements_tabelle.md template
# Requirements Tabelle
Columns: ID | Requirement | Rationale | Priority | Status | Owner | Acceptance Criteria | Files/Modules
Example row:
REQ-001 | User can update profile picture | UX requirement for personalization | High | Done | @khaled | Upload accepted formats, preview shown | src/components/ProfilePic

Conventions
- File locations: prefer repository root or .github/instructions/ for both files.
- IDs: use short stable IDs (e.g., REQ-001).
- Priorities: High / Medium / Low.
- Status: Draft / In Progress / Done / Blocked.
- Commit message template: <type>(<scope>): <short summary> — include issue/REQ-ID if applicable.
- Change_log entries must reference commits or PRs when available.

Checklist before submitting a PR
- [ ] Requirements_tabelle.md updated for any requirement changes.
- [ ] Change_log.md entry added.
- [ ] Tests added/updated and passing.
- [ ] Linter/formatter run.
- [ ] PR description includes summary, related REQ IDs, and testing steps.

Notes
- Keep entries concise and actionable; the goal is reproducibility and traceability.
- When in doubt, add more detail to Requirements_tabelle.md (acceptance criteria, test steps, example data).