# Implementation Plan: Goal Drag-and-Drop Reordering

**Branch**: `002-goal-drag-reorder` | **Date**: 2026-03-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-goal-drag-reorder/spec.md`

## Summary

Enable users to reorder goal cards within each column (current and completed) via drag-and-drop. The entire card surface is the drag zone, with an 8px movement threshold to prevent accidental drags on checkbox and button clicks. A visual drop-position indicator (Tailwind-styled line) shows the landing position during drag. Custom order is persisted alongside goals in localStorage under a new `goalOrder` field; failures fall back silently to creation-date order. Implemented using `@dnd-kit/sortable` (vertical list strategy with parent-element and vertical-axis constraints).

## Technical Context

**Language/Version**: TypeScript / React 19.2.4 / Next.js 16.2.1
**Primary Dependencies**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (new, justified below); `tailwindcss` v4, `lucide-react` (existing)
**Storage**: Browser localStorage — existing `doit_goals` key; storage shape extended with optional `goalOrder: { current: string[], completed: string[] }` field
**Testing**: Prohibited by constitution (no unit/integration/e2e/contract tests)
**Target Platform**: Browser web app — pointer/mouse primary; touch devices must not break but drag-reorder is a stretch goal deferred to a future iteration
**Project Type**: Web application (Next.js App Router, single project)
**Performance Goals**: Drop-indicator position updates in real time during drag with no perceivable lag (SC-002)
**Constraints**: No cross-column drag; localStorage failure falls back silently; touch drag deferred; existing checkbox and action-button interactions must not be disrupted
**Scale/Scope**: Single-user browser app; goal lists expected to remain small (tens of items per column)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Clean code**: New `goal-order.ts` utility module keeps order logic separate from storage and action concerns. `GoalColumn` receives a thin sortable wrapper; `GoalItem` gains only a `useSortable` ref and listeners. No speculative abstractions.
- [x] **UX simplicity**: No new interaction modes introduced. Drag-to-reorder is additive; all existing goal actions (select, complete, delete) are unchanged.
- [x] **Responsive by default**: Primary pointer/mouse support implemented. Touch breakpoints unaffected — existing Tailwind responsive layout preserved; drag deferred on touch is explicitly spec-approved (clarification Q3).
- [x] **Minimal dependencies**: `@dnd-kit` justified — native HTML5 drag-and-drop API cannot provide a React-state-managed drop indicator, reliable click disambiguation, or SSR safety without substantial custom code that would be harder to maintain (see research.md).
- [x] **Zero testing**: No test files, no test scaffolding, no testing-related tasks.
- [x] **Stack versions**: `next` 16.2.1, `react`/`react-dom` 19.2.4, `tailwindcss`/`@tailwindcss/postcss` ^4 — all preserved; `@dnd-kit` packages are additive.

## Project Structure

### Documentation (this feature)

```text
specs/002-goal-drag-reorder/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
└── page.tsx                    # Updated: goalOrder state, DndContext, onDragEnd, order persistence

components/goals/
├── goal-column.tsx             # Updated: SortableContext + drop-indicator rendering
└── goal-item.tsx               # Updated: useSortable hook wired to card root element

lib/goals/
├── goal-types.ts               # Updated: GoalOrderMap type added
├── goal-storage.ts             # Updated: loadGoalOrder / saveGoalOrder alongside loadGoals / saveGoals
├── goal-order.ts               # New: mergeOrder, insertAtBottom, removeFromOrder, reorderWithinColumn
└── goal-actions.ts             # No change required (reorder is order-only, not goal-data mutation)

tests/                          # Prohibited by constitution — do not create
```

**Structure Decision**: Single Next.js app project. Drag-reorder logic is colocated with the existing goal domain in `lib/goals/`. A new `goal-order.ts` utility keeps order management separate from goal-data mutations (`goal-actions.ts`) and storage I/O (`goal-storage.ts`) without over-abstracting.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| 3 new packages (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) | All three are required as a co-versioned, modular unit to get DnD context, sortable hooks, and CSS transform utilities | They cannot be split further; the HTML5 native drag API requires 400+ lines of custom React wiring to achieve equivalent click-discrimination, drop indicators, and SSR safety — this is higher maintenance cost than the three lightweight packages |
