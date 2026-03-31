# Data Model: Goal Drag-and-Drop Reordering

**Date**: 2026-03-23
**Branch**: `002-goal-drag-reorder`

---

## Unchanged Entities

The following entities from feature 001 are unchanged:

- **Goal** — no new fields; status, ID, and timestamps remain identical
- **GoalSelectionState** — no changes
- **GoalPresentation** — no changes; derived view model unchanged

---

## New Entity: GoalOrderMap

- **Purpose**: Represents the user-defined display order for goal cards within each column. Stored alongside goals in localStorage; derived purely from user drag interactions.
- **Fields**:
  - `current` (string[], required): Ordered list of goal IDs for the current-goals column, first item displayed at top.
  - `completed` (string[], required): Ordered list of goal IDs for the completed-goals column, first item displayed at top.

```typescript
export interface GoalOrderMap {
  current: string[];
  completed: string[];
}
```

---

## Updated Storage Shape (Local Storage)

The existing `doit_goals` key is extended with an optional `goalOrder` field. The field is optional to maintain backward compatibility with data saved before this feature.

```json
{
  "goals": [
    {
      "id": "goal_123",
      "title": "Finish portfolio",
      "endDate": "2026-04-01",
      "status": "current",
      "createdAt": "2026-03-23T10:00:00.000Z"
    }
  ],
  "goalOrder": {
    "current": ["goal_456", "goal_123"],
    "completed": ["goal_789"]
  }
}
```

---

## Order Management Rules

### Load / Merge

When loading from storage:

1. Read `goals` and `goalOrder` (may be absent for backward compat).
2. For each status column, partition goals into:
   - **ordered**: goals whose ID appears in the corresponding `goalOrder` array
   - **unordered**: goals whose ID does not appear (backward compat / newly added via a different session)
3. Sort `ordered` by their index position in the `goalOrder` array.
4. Sort `unordered` by `createdAt` ascending (oldest first).
5. Concatenate: `[...ordered, ...unordered]` — unordered goals always appear at the end.

### Goal Created

- Append new goal's ID to `goalOrder.current` (fulfils FR-008: new goals appear at the bottom).

### Goal Moved to Completed

- Remove goal's ID from `goalOrder.current`.
- Prepend goal's ID to `goalOrder.completed` (fulfils FR-009: newly completed goals appear at top, position 0).

### Goal Deleted

- Remove goal's ID from both `goalOrder.current` and `goalOrder.completed`.
- Remaining IDs retain their relative positions.

### Goal Reordered (drag end)

- Identify source column (current or completed) from the `active` item's status.
- Call `arrayMove(orderArray, fromIndex, toIndex)` on the corresponding `goalOrder` column array.
- Persist the updated `GoalOrderMap`.

### Drop on Same Position (No-op)

- If `fromIndex === toIndex`, skip state update and storage write (fulfils FR-010).

---

## Validation Rules

- `GoalOrderMap.current` MUST contain only IDs of goals with `status: "current"`.
- `GoalOrderMap.completed` MUST contain only IDs of goals with `status: "completed"`.
- IDs in the order arrays that no longer correspond to a loaded goal MUST be silently discarded during merge (handles deleted goals from prior sessions, stale storage).
- If `goalOrder` is absent or malformed in storage, the system MUST fall back to creation-date order silently (FR-011).

---

## State Transitions (Extended)

| Trigger | Goals State | GoalOrderMap State |
|---------|-------------|-------------------|
| Goal created | Goal added with `status: current` | ID appended to `current[]` |
| Goal moved to completed | Goal `status` → `completed` | ID removed from `current[]`, prepended to `completed[]` |
| Goal deleted | Goal removed | ID removed from whichever array contains it |
| Goal dragged to new position | No change to `Goal` records | `arrayMove` applied to the relevant column array |
| Drop on same position | No change | No change (no-op) |
| Storage read (first time / no order) | Loaded from storage | Synthesised from creation-date order |
