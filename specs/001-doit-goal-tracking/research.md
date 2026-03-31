# Research: Doit Goal Tracking Initial Page

## Decision 1: Theme tokens via Tailwind v4 `@theme`

- Decision: Use Tailwind CSS v4 theme tokens in `app/globals.css` via `@theme` for all pastel light colors used by the goal page.
- Rationale: Keeps color usage centralized, avoids hard-coded per-component colors, and supports constitution requirements for clean code and responsive UI consistency.
- Alternatives considered:
  - Inline utility-only colors per component (rejected: scattered styling and weaker maintainability)
  - CSS variables outside Tailwind token mapping (rejected: less aligned with requested Tailwind `@theme` approach)

## Decision 2: UI primitives with shadcn/ui

- Decision: Use shadcn/ui components for dialog, button, checkbox, input, and card-like containers.
- Rationale: Reduces custom UI complexity, supports accessibility defaults, and aligns with requested stack while preserving minimal UX.
- Alternatives considered:
  - Build all primitives from scratch (rejected: higher complexity and maintenance burden)
  - Use another component library (rejected: user explicitly requested shadcn)

## Decision 3: Date operations with `date-fns`

- Decision: Use `date-fns` for date parsing, formatting, and days-left calculations.
- Rationale: Reliable and readable date logic with small, focused utility usage for urgency highlighting and label formatting.
- Alternatives considered:
  - Native Date arithmetic only (rejected: more error-prone and less readable)
  - Day.js/Luxon (rejected: not requested)

## Decision 4: Goal persistence with browser local storage

- Decision: Persist current/completed goals in browser local storage only.
- Rationale: Matches clarified scope (single browser/device), avoids backend complexity, and satisfies reload persistence requirement.
- Alternatives considered:
  - Backend API + DB (rejected: out of MVP scope)
  - Session memory only (rejected: fails persistence requirement)

## Decision 5: Explicit selection-first action flow

- Decision: Checking a goal marks it as selected only; user then explicitly chooses Move to Completed or Delete.
- Rationale: Matches clarified behavior, prevents accidental destructive actions, and keeps interactions intentional.
- Alternatives considered:
  - Immediate complete on checkbox toggle (rejected: conflicts with clarified workflow)
  - Direct delete without selection model (rejected: weaker consistency with requested check-then-action flow)

## Constitution Alignment Summary

- Clean code: domain logic and UI concerns are separated.
- UX simplicity: single page, two columns, one modal, explicit actions.
- Responsive design: mobile/tablet/desktop layout is required by contract.
- Minimal dependencies: only requested additions beyond existing stack.
- Zero-testing: manual verification only, no automated test suite.
