# Feature Specification: Doit Goal Tracking Initial Page

**Feature Branch**: `001-doit-goal-tracking`  
**Created**: 2026-03-23  
**Status**: Draft  
**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achiev the goal and right one where completed goals are . each goal can be 'checked' using a checkbox and then either moved to the completed column or permanently deleted. To add new goals , a user can click on a button to open a new goal from in a model ( tittle and end date fields). Goal reaching there end date (with in 3 days) are highlited. lets use a modern light theme for fun paster colours."

## Clarifications

### Session 2026-03-23

- Q: How should goal data persistence work for this initial feature? → A: Browser local persistence only.
- Q: How should checking a goal work before moving/deleting? → A: Checking selects a goal, then user explicitly chooses Move to Completed or Delete.

## User Scenarios *(mandatory)*

### User Story 1 - Create and view active goals (Priority: P1)

As a user, I can add a new goal using a modal form and immediately see it in the active-goals column with the remaining number of days until its end date.

**Why this priority**: Goal creation and visibility are the core value of the app. Without this, no other behavior is meaningful.

**Independent Validation**: Open the app, add a goal with title and end date, and verify it appears in the current-goals column with correct remaining days.

**Acceptance Scenarios**:

1. **Given** no existing goals, **When** the user opens the add-goal modal and submits a valid title and end date, **Then** the new goal appears in the current-goals column.
2. **Given** an active goal with a future end date, **When** the goal is displayed, **Then** the UI shows the number of days left to achieve it.

---

### User Story 2 - Complete goals from current list (Priority: P2)

As a user, I can check a goal and move it from the current-goals column to the completed-goals column.

**Why this priority**: Marking progress is the main day-to-day interaction after goal creation.

**Independent Validation**: Mark an active goal as completed and verify it is no longer in current goals and is present in completed goals.

**Acceptance Scenarios**:

1. **Given** a goal in the current-goals column, **When** the user checks it and confirms moving it, **Then** it appears in the completed-goals column and is removed from current goals.
2. **Given** a completed goal, **When** the page is refreshed, **Then** the goal remains in the completed-goals column.

---

### User Story 3 - Remove goals permanently (Priority: P3)

As a user, I can permanently delete a goal so it no longer appears in either column.

**Why this priority**: Deletion is important for cleanup, but it is secondary to creating and completing goals.

**Independent Validation**: Delete a goal and verify it is removed and cannot be found in current or completed goals.

**Acceptance Scenarios**:

1. **Given** a goal in either column, **When** the user chooses permanent delete and confirms, **Then** the goal is removed from the app.

### Edge Cases

- What happens when a user submits the modal with an empty title?
- What happens when a user selects an end date in the past?
- How does the system handle a goal with end date equal to today (0 days left)?
- How does the system handle invalid or missing date data when loading saved goals?
- How does the system handle very long goal titles?
- What happens if a user tries to complete and delete the same goal in rapid succession?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display two visible goal columns on the initial page: current goals on the left and completed goals on the right.
- **FR-002**: System MUST provide an action to open an add-goal modal from the initial page.
- **FR-003**: System MUST require both title and end date when creating a goal.
- **FR-004**: System MUST create a new goal in current-goals state after valid submission.
- **FR-005**: System MUST show remaining days for each current goal based on the goal end date.
- **FR-006**: System MUST allow a user to check a goal to mark it as selected, without immediate state change.
- **FR-007**: System MUST provide explicit actions for a selected goal: Move to Completed or permanent Delete.
- **FR-008**: System MUST visually highlight goals whose end date is within 3 calendar days.
- **FR-009**: System MUST apply a modern light theme with pastel styling across the goal page and modal.
- **FR-010**: System MUST preserve goal state (current/completed/deleted) using browser local persistence and show consistent results after reload in the same browser.
- **FR-011**: System MUST prevent creation when required fields are missing and show clear, user-facing validation feedback.
- **FR-012**: System MUST calculate days-left values using whole-day precision and display non-negative values for current goals.
- **FR-013**: System MUST ensure checking alone never completes or deletes a goal until the user confirms an explicit action.

### Key Entities *(include if feature involves data)*

- **Goal**: A user-defined target with title, end date, status (current/completed), created timestamp, and optional completed timestamp.
- **GoalStatus**: Classification state for a goal (`current`, `completed`, `deleted`) used to determine column placement and visibility.
- **GoalDisplayState**: Derived presentation attributes for each current goal, including days-left value and urgency highlight flag.

### Assumptions & Dependencies

- The initial page covers a single-user personal goal list and does not include multi-user sharing.
- Persistence scope is single-device and single-browser only for this feature.
- Date calculations use the user’s local calendar day.
- Permanent deletion is irreversible in this feature scope.
- Visual highlight priority is determined only by the 3-day threshold and not by custom user settings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can add a new goal (title + end date) and see it in current goals within 30 seconds.
- **SC-002**: 95% of users can move an active goal to completed goals in 10 seconds or less.
- **SC-003**: 100% of current goals with end date within 3 days are visibly distinguishable from non-urgent goals.
- **SC-004**: 100% of successfully deleted goals are absent from both columns after page reload.
- **SC-005**: At least 90% of users in acceptance review rate the page visual style as clear and modern.
