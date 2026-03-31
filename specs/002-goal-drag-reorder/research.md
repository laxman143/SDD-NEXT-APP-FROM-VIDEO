# Research: Goal Drag-and-Drop Reordering

**Date**: 2026-03-23
**Branch**: `002-goal-drag-reorder`

## Decision 1: Sortable Library Selection

**Decision**: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`

**Rationale**:
- React-native design — operates on React state, never mutates the DOM directly
- Ships SSR-safe; components render without errors on the server (Next.js App Router compatible)
- `useSortable` hook integrates cleanly into existing `GoalItem` without restructuring
- `arrayMove` utility handles the list reorder in a single pure-function call
- Actively maintained; supports React 19
- Accessible by default (keyboard navigation and ARIA attributes built in)

**Alternatives considered**:
- **Native HTML5 drag API**: Cannot cleanly render a React-managed drop indicator without complex `dragover`/`dragenter` event wiring. Click vs. drag disambiguation requires a manual `mousedown` + `mousemove` distance check. No SSR safety. Rejected.
- **SortableJS / react-sortablejs**: Imperative DOM manipulation model conflicts with React's declarative state model. Requires `ref`-based sync that fights React's reconciler. Not maintained for React 19. Rejected.
- **react-beautiful-dnd**: Archived / no longer maintained. Incompatible with React 19 strict mode. Rejected.

---

## Decision 2: Click vs. Drag Disambiguation

**Decision**: Apply `PointerSensor` with `activationConstraint: { distance: 8 }` on the `DndContext`

**Rationale**:
- An 8-pixel movement threshold means the drag activation is suppressed if the pointer lifts before travelling 8px — this is the idiomatic @dnd-kit pattern and covers all typical checkbox and button click gestures
- No synthetic event suppression required on individual interactive elements inside the card
- Works with the spec decision that the entire card surface is the drag zone (FR-001)

**Alternatives considered**:
- `KeyboardSensor` only: does not satisfy the pointer drag requirement
- `MouseSensor` with `activationConstraint`: is deprecated in @dnd-kit v6 in favour of `PointerSensor`; rejected

---

## Decision 3: Drop Indicator Design

**Decision**: Render a Tailwind-styled thin horizontal bar (2px, accent colour) between goal items using the `isOver` + position detection from `useSortable`

**Rationale**:
- The spec (FR-006) requires a drop-position indicator but the dragged card must retain its normal appearance (clarification Q5 — Option A: no visual change to the card itself)
- A thin divider/bar between list items is the simplest implementation of this contract: no overlay component needed, no opacity manipulation
- Implemented by passing `isDraggingOver` + insertion index from the `DndContext` `onDragOver` handler down to `GoalColumn`, which renders a conditional `<div>` gap marker

**Alternatives considered**:
- Full drag overlay (`DragOverlay` component): unnecessary — spec does not require the dragged card to look different and using an overlay adds component complexity without spec value
- Opacity/shadow on dragged card: explicitly rejected by clarification Q5 (Option A)

---

## Decision 4: Goal Order Persistence Shape

**Decision**: Extend the existing localStorage shape with an optional `goalOrder` field

```json
{
  "goals": [...],
  "goalOrder": {
    "current": ["goal_id_1", "goal_id_2"],
    "completed": ["goal_id_3"]
  }
}
```

**Rationale**:
- Single localStorage key (`doit_goals`) keeps persistence consistent with the existing feature (FR-003, Assumptions)
- `goalOrder` is optional for backward compatibility — existing saved data without the field loads correctly, displaying goals in creation-date order (FR-011 fallback)
- Per-column order arrays are simple ID lists; merging them with the goal array at read time is a single `sort` call

**Order merge algorithm at load time**:
1. Load `goals` and `goalOrder` from storage
2. For each status, partition goals into `inOrder` (ID present in goalOrder array) and `unordered` (ID not in array)
3. Sort `inOrder` by their index in the goalOrder array
4. Append `unordered` goals sorted by `createdAt` (oldest first) — covers newly added goals and backward compat
5. Return merged list

**Alternatives considered**:
- Storing a `position` integer field on each `Goal`: requires rewriting all positions on every reorder, complicates the existing `Goal` type, and creates partial-update risk. Rejected.
- Separate localStorage key: splits state management across two keys with separate load/save cycles. Rejected.

---

## Decision 5: DndContext Scope

**Decision**: Single `DndContext` at the page level wrapping both columns, with `restrictToVerticalAxis` and `restrictToParentElement` modifiers applied per column via `SortableContext`

**Rationale**:
- A single `DndContext` covers both columns in one render tree
- Modifiers restrict each item to vertical movement within its own column container — enforcing FR-005 (no cross-column drag) at the interaction layer without additional logic
- `onDragEnd` identifies which column the drag originated in from the `active` item's status, and applies `arrayMove` only to that column's order array

**Alternatives considered**:
- Separate `DndContext` per column: prevents any cross-column awareness (good for isolation) but complicates future extension. A single context with modifiers is cleaner and sufficient. Rejected.

---

## Constitution Re-check (Post Phase 1 Design)

- [x] **Clean code**: order utilities in `goal-order.ts` are pure functions with single responsibilities; no speculative abstractions
- [x] **UX simplicity**: drop indicator is the minimum viable visual feedback; no overlay, no animation complexity
- [x] **Responsive**: layout changes are Tailwind-only; existing responsive grid is unaffected
- [x] **Minimal dependencies**: @dnd-kit justified above; no additional packages required
- [x] **Zero testing**: no test artifacts produced
- [x] **Stack versions**: confirmed unchanged
