# UI Interaction Contract: Doit Goal Tracking Initial Page

## Scope

Defines the user-facing interaction contract for the initial Doit page.
No external API endpoints are introduced in this phase.

## View Contract

- The page MUST render two columns:
  - Left: Current Goals
  - Right: Completed Goals
- The page MUST provide an add-goal trigger that opens a modal dialog.
- The modal MUST include:
  - Title input (required)
  - End date input (required)
  - Submit and cancel actions

## Goal Item Contract

Each rendered goal item MUST expose:
- A selection checkbox (selection only; no implicit completion/deletion)
- Goal title
- End-date display label
- Days-left display label (for current goals)
- Urgency visual treatment when due within 3 days

## Action Contract

When a goal is selected:
- The UI MUST expose explicit actions:
  - Move to Completed
  - Delete Permanently
- The UI MUST NOT execute completion or deletion solely from checkbox selection.

## Validation Contract

On goal creation submit:
- Empty title MUST block submission and display validation feedback.
- Past end date MUST block submission and display validation feedback.
- Valid data MUST create a current goal and close the modal.

## Persistence Contract

- Goal list state MUST be saved in browser local storage.
- Reload in same browser MUST restore current/completed state.
- No cross-browser or cross-device synchronization is required.

## Responsive Contract

- Mobile: Columns MAY stack vertically while preserving complete functionality.
- Tablet/Desktop: Two-column layout SHOULD be visible side-by-side.
- All actions (add/select/move/delete) MUST remain available across breakpoints.

## Style Contract

- Theme uses Tailwind v4 `@theme` tokens for pastel light palette.
- No ad-hoc hardcoded color system outside approved theme tokens.
