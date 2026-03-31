# UI Interaction Contract: Goal Drag-and-Drop Reordering

**Date**: 2026-03-23
**Branch**: `002-goal-drag-reorder`

## Scope

Defines the updated user-facing interaction contract for the goal columns, extending the contract established in feature 001. All prior contracts remain in force; this document covers additions and modifications only.

---

## Updated View Contract: GoalColumn

The `GoalColumn` component MUST:
- Wrap its goal list in a sortable context so items can be dragged and reordered within the column.
- Render a visual drop-position indicator (a thin horizontal bar, Tailwind-styled) between items to show where the dragged card will land.
- The drop indicator MUST appear between the correct items in real time as the drag position changes.
- The drop indicator MUST disappear immediately when the drag ends (drop or cancellation).
- A column with a single goal or zero goals MUST render without a drag affordance (no-op; single item cannot be reordered).

**Props additions**:

| Prop | Type | Description |
|------|------|-------------|
| `orderedIds` | `string[]` | IDs in current display order; drives `SortableContext` |
| `onReorder` | `(activeId: string, overId: string) => void` | Called when a drop is confirmed at a new position |

---

## Updated Goal Item Contract

Each `GoalItem` MUST:
- Accept drag gestures initiated anywhere on the card surface (entire card is drag zone, per clarification Q1 / FR-001).
- Retain its **normal resting appearance** while being dragged — no opacity change, no shadow change, no style modification (clarification Q5 / FR-006).
- Expose standard `@dnd-kit` accessibility attributes (`aria-*`, `role`, keyboard event listeners) on the card root element.
- Continue to expose the selection checkbox and action buttons with their existing behaviour; clicking these elements MUST NOT initiate a drag.

**Drag activation threshold**: Pointer must move ≥ 8px before drag activates. This prevents accidental drags on checkbox clicks and button presses.

---

## Drag Interaction Contract

| Interaction | Required Behaviour |
|-------------|-------------------|
| Pointer down + move ≥ 8px on card | Drag begins; drop indicator appears |
| Pointer move during drag | Drop indicator updates between goals in real time |
| Pointer release on valid target | Drop confirmed; order updated; indicator disappears |
| Pointer release outside column | Drag cancelled; goal returns to original position; indicator disappears |
| Escape key during drag | Drag cancelled; goal returns to original position; indicator disappears |
| Click (move < 8px) on card body | Normal click behaviour; drag not activated |
| Click on checkbox | Selection toggles; drag not activated |
| Click on action buttons | Action executes; drag not activated |
| Drag of only item in column | No drag activates (single-item list is a no-op) |
| Drop on own position | No-op; order and storage unchanged |
| Drag from one column to the other | Not permitted; cross-column drag is prevented by vertical + parent-element modifiers |

---

## Drop Indicator Contract

- **Visual style**: 2px horizontal bar in the app accent colour (Tailwind token), full-width within the column
- **Position**: rendered between the two items adjacent to the current insertion point
- **Timing**: appears immediately when drag activates; disappears immediately on drag end
- **Dragged card style**: unchanged from resting state (no ghost, no overlay, no opacity shift)

---

## Order Persistence Contract

- Goal display order MUST be saved to localStorage on every confirmed drop.
- On page load, goals MUST be displayed in the saved order; if no saved order exists, fall back to creation-date order (oldest first), silently.
- If localStorage is unavailable or a write fails, the order MUST fall back silently — no error is shown (FR-011).
- Newly created goals MUST appear at the bottom of the current-goals list regardless of existing order (FR-008).
- When a goal is moved to completed, it MUST appear at the top of the completed-goals column (position 0) ahead of all prior completed goals (FR-009).
- When a goal is deleted, its ID is removed from the stored order; remaining goals retain their relative positions (FR-009).

---

## Responsive Contract (Updated)

- Drag-and-drop is implemented using pointer events (mouse/trackpad).
- On touch devices, existing goal-list interactions (scroll, checkbox, action buttons) MUST continue to work correctly.
- Touch drag-reordering is a stretch goal deferred to a future iteration — it is not required by this feature.
- All Tailwind responsive utilities for column layout (`grid-cols-1 sm:grid-cols-2`) remain unchanged.

---

## Accessibility Contract

- Sortable items MUST expose `aria-roledescription` and drag handle keyboard instructions provided by `@dnd-kit` defaults.
- Keyboard drag-and-drop (Space to pick up, arrow keys to move, Space/Enter to drop, Escape to cancel) MUST function via `KeyboardSensor`.
- Screen-reader announcements for drag start, position change, and drop MUST be provided by `@dnd-kit`'s built-in announcements.
