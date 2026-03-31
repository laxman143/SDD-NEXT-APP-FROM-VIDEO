# Quickstart: Doit Goal Tracking Initial Page

## Prerequisites

- Node.js and npm installed.
- Project dependencies installed.

## Run

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Open app:
   - `http://localhost:3000`

## Manual Validation Scenarios (No Automated Tests)

1. Initial layout
   - Verify two columns are visible: current goals (left) and completed goals (right).
   - Verify layout remains usable on mobile, tablet, and desktop widths.

2. Add goal
   - Click add-goal action to open modal.
   - Submit with valid title + future end date.
   - Verify goal appears in current column with days-left text.

3. Validation behavior
   - Submit modal with empty title.
   - Submit modal with past end date.
   - Verify user-facing validation messages appear and goal is not created.

4. Urgency highlighting
   - Create a goal due within 3 days.
   - Verify urgency highlight styling is visually distinct from non-urgent goals.

5. Selection + explicit actions
   - Check a goal and verify it becomes selected but does not move automatically.
   - Choose Move to Completed and verify status/column update.
   - Check a goal and choose Delete; verify permanent removal.

6. Persistence
   - Refresh the page.
   - Verify current/completed states remain consistent in same browser.

## Notes

- The feature intentionally uses browser local storage only.
- Automated tests are intentionally omitted per project constitution.
