# Quickstart: Goal Drag-and-Drop Reordering

**Date**: 2026-03-23
**Branch**: `002-goal-drag-reorder`

## Prerequisites

- Node.js and npm installed.
- Project dependencies installed (`npm install`).
- Feature 001 (Doit Goal Tracking Initial Page) must be merged and working.

## Install New Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Why three packages**: `@dnd-kit` is intentionally modular. `@dnd-kit/core` provides the DnD context and sensors; `@dnd-kit/sortable` provides the sortable list abstractions; `@dnd-kit/utilities` provides the `CSS.Transform` helper for applying transforms. All three are required.

## Run

```bash
npm run dev
# http://localhost:3000
```

## Implementation Overview

The following files are added or modified (see `plan.md` for full structure):

| File | Change |
|------|--------|
| `lib/goals/goal-types.ts` | Add `GoalOrderMap` type |
| `lib/goals/goal-storage.ts` | Extend load/save to include `goalOrder` |
| `lib/goals/goal-order.ts` | New — pure order utility functions |
| `components/goals/goal-column.tsx` | Add `SortableContext` + drop indicator |
| `components/goals/goal-item.tsx` | Wire `useSortable` to card root element |
| `app/page.tsx` | Add `DndContext`, `goalOrder` state, `onDragEnd` handler |

## Manual Validation Scenarios (No Automated Tests)

### 1. Basic drag-and-drop reorder

- Open the app with at least two current goals.
- Click and drag the bottom goal card to above the top goal — hold and move ≥ 8px before releasing.
- Verify the goals swap positions immediately on drop.
- Verify no checkbox or action buttons were accidentally triggered.

### 2. Drop indicator

- Start dragging a goal slowly over the list.
- Verify a thin horizontal bar (accent colour) appears between goals as the cursor passes each boundary.
- Release the drag and verify the indicator disappears.

### 3. Drag cancellation

- Start dragging a goal.
- Press Escape before releasing.
- Verify the goal returns to its original position and the indicator disappears.
- Repeat by dragging outside the column boundary and releasing — same expected result.

### 4. Persistence across sessions

- Reorder at least two goals in each column.
- Refresh the page.
- Verify both columns display goals in the custom order.
- Close and reopen the browser tab; verify order is still preserved.

### 5. New goal insertion

- With existing goals in a custom order, add a new goal via the Add Goal dialog.
- Verify the new goal appears at the bottom of the current-goals column without changing the order of existing goals.

### 6. Move-to-completed order

- With existing completed goals, select and move a current goal to completed.
- Verify the newly completed goal appears at the top of the completed-goals column.
- Verify previously completed goals shift down by one position.

### 7. Delete preserves order

- With at least three current goals in a custom order (A, B, C), delete goal B.
- Verify the remaining goals show A, C in that order (no gap, no shuffle).

### 8. Checkbox and button clicks are not dragged

- Click (do not drag) the checkbox on a goal card.
- Verify the goal becomes selected / deselected — no drag is activated.
- Click an action button (Move to Completed / Delete).
- Verify the action executes — no drag is activated.

### 9. Single-item column

- Reduce a column to one goal.
- Attempt to drag the single goal.
- Verify no visual change occurs (single item cannot be reordered).

### 10. Responsive layout

- Open on a narrow mobile viewport (≤ 640px).
- Verify goal-list scrolling still works normally (touch events not broken).
- Verify drag-reordering is not expected to work on touch (stretch goal — not in scope).
- Open on tablet and desktop viewports; verify two-column layout is intact.

## Notes

- Automated tests are intentionally omitted per project constitution (Zero-Testing Directive).
- `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` must all be on the same major version.
- The `goalOrder` field is optional in localStorage for backward compatibility. Existing saved goals without order data display in creation-date order on first load.
- Touch drag-reordering is a stretch goal deferred to a future iteration. The feature must not break touch scroll or interaction.
