# Implementation Plan: Doit Goal Tracking Initial Page

**Branch**: `001-doit-goal-tracking` | **Date**: 2026-03-23 | **Spec**: `/specs/001-doit-goal-tracking/spec.md`
**Input**: Feature specification from `/specs/001-doit-goal-tracking/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build the initial Doit goal-tracking page with two columns (current/completed),
goal creation via modal form, selection-based complete/delete actions, urgency
highlighting for goals due within 3 days, and browser-local persistence.
Implementation uses Next.js App Router with React + Tailwind CSS (`@theme`
tokens), shadcn/ui components for interaction primitives, and `date-fns` for
date formatting/calculation.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5 + React 19.2.4  
**Primary Dependencies**: Next.js 16.2.1, Tailwind CSS v4 (`@theme`), shadcn/ui, date-fns  
**Storage**: Browser Local Storage (single-browser persistence)  
**Testing**: Prohibited by constitution (no unit/integration/e2e/contract tests)  
**Target Platform**: Modern desktop/tablet/mobile browsers
**Project Type**: Web application (single Next.js app)
**Performance Goals**: Goal add/select/complete/delete interactions feel immediate (<100ms local UI response under normal local list sizes)
**Constraints**: No automated tests; no backend/API; maintain clean code and minimal UX complexity; responsive layout required
**Scale/Scope**: Initial page MVP for single-user local goal list (dozens to low hundreds of goals)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Clean code approach defined (simple responsibilities, explicit naming, no unnecessary abstraction)
- UX scope remains minimal and MVP-focused
- Responsive behavior specified for mobile, tablet, and desktop
- Dependency additions minimized and justified
- No automated tests included (unit/integration/e2e/contract tests are prohibited)
- `next`, `react`, `react-dom`, `tailwindcss`, and `@tailwindcss/postcss` versions align with `package.json`

**Gate Status (Pre-Design)**: PASS

- Clean code: planned modular separation by domain model, storage adapter, and UI components.
- UX simplicity: constrained to two columns + one modal + explicit action flow.
- Responsive behavior: mobile/tablet/desktop breakpoints included in component layout.
- Dependency minimization: only user-requested additions (`shadcn/ui`, `date-fns`); local storage avoids backend dependency.
- Zero-testing directive: no test tasks or test scaffolding planned.
- Stack compliance: Next.js/React/Tailwind versions remain aligned to `package.json`.

## Project Structure

### Documentation (this feature)

```text
specs/001-doit-goal-tracking/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── goals/
│   ├── goal-column.tsx
│   ├── goal-item.tsx
│   ├── add-goal-dialog.tsx
│   └── goal-actions.tsx
└── ui/                   # shadcn/ui generated primitives

lib/
├── goals/
│   ├── goal-types.ts
│   ├── goal-storage.ts
│   ├── goal-selectors.ts
│   └── goal-actions.ts
└── date/
  └── goal-dates.ts

specs/001-doit-goal-tracking/
└── (plan + research + model + contracts + quickstart)
```

**Structure Decision**: Single Next.js app structure chosen to keep UX and
delivery minimal while preserving clean domain boundaries (`components/` and
`lib/`) for maintainability.

## Phase 0: Research Output

Research complete in `/specs/001-doit-goal-tracking/research.md`.

- Tailwind v4 `@theme` token strategy selected for pastel light theme consistency.
- shadcn/ui selected for accessible dialog/button/checkbox primitives with low custom complexity.
- `date-fns` selected for reliable day-difference and display formatting.
- Local storage chosen per clarified persistence scope.

## Phase 1: Design & Contracts Output

- Data model documented in `/specs/001-doit-goal-tracking/data-model.md`.
- UI interaction contract documented in `/specs/001-doit-goal-tracking/contracts/ui-contract.md`.
- Manual verification flow documented in `/specs/001-doit-goal-tracking/quickstart.md`.

## Constitution Check (Post-Design)

**Gate Status (Post-Design)**: PASS

- Clean code: entities, actions, storage, and date logic are separated.
- UX simplicity: no extra pages/features; single-page two-column flow maintained.
- Responsive design: contract and quickstart include mobile/tablet/desktop behavior checks.
- Minimal dependencies: only requested UI/date utilities; no backend/runtime expansion.
- Zero-testing directive: quickstart uses manual validation only; no automated test artifacts.
- Stack compliance: plan remains on Next.js 16.2.1, React 19.2.4, Tailwind major 4.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
