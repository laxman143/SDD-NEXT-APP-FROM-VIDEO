# Data Model: Doit Goal Tracking Initial Page

## Entity: Goal

- Purpose: Represents a user goal shown in either current or completed column.
- Fields:
  - `id` (string, required): Stable unique identifier.
  - `title` (string, required, 1..120 chars): Goal title entered in modal.
  - `endDate` (string, required, ISO date): User-selected target date.
  - `status` (enum, required): `current` | `completed`.
  - `createdAt` (string, required, ISO datetime): Creation timestamp.
  - `completedAt` (string, optional, ISO datetime): Set when moved to completed.

## Entity: GoalSelectionState

- Purpose: Tracks the currently checked goal awaiting explicit action.
- Fields:
  - `selectedGoalId` (string | null): ID of selected goal.
  - `selectedAt` (string, optional, ISO datetime): Timestamp for selection event.

## Derived View Model: GoalPresentation

- Purpose: Drives UI rendering and urgency highlighting.
- Fields:
  - `daysLeft` (number): Whole-day difference from current local date to `endDate`.
  - `isUrgent` (boolean): `true` when `daysLeft <= 3` for current goals.
  - `displayDateLabel` (string): Formatted date label via `date-fns`.

## Validation Rules

- `title` MUST be non-empty after trim.
- `endDate` MUST be a valid local date and not in the past at creation time.
- `status` MUST be one of `current` or `completed` in storage.
- `completedAt` MUST exist only when `status = completed`.
- `selectedGoalId` MUST reference an existing goal in memory before action.

## Relationships

- A single `GoalSelectionState` references zero or one `Goal`.
- `GoalPresentation` is derived from a `Goal` plus current local date context.

## State Transitions

- `create`: no record → `current`
- `select`: `current` or `completed` + unchecked → selected state only (no status change)
- `complete`: selected `current` → `completed`
- `delete`: selected `current` or selected `completed` → removed from storage
- `unselect`: selected state → none (no goal status change)

## Storage Shape (Local Storage)

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
  ]
}
```
