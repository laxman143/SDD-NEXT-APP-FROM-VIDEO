# Feature Specification: Goal Drag-and-Drop Reordering

**Feature Branch**: `002-goal-drag-reorder`  
**Created**: 2026-03-23  
**Status**: Draft  
**Input**: User description: "drag and drop - let's make it so that users can reorder goals by dragging and dropping them above or below other goals in the list"

## Clarifications

### Session 2026-03-23

- Q: Should the drag be triggered from the entire goal card surface or only a dedicated drag handle icon? → A: Entire goal card is the drag surface.
- Q: Where should a goal appear in the completed-goals column when it is first moved there? → A: Always inserted at the top of the completed-goals column.
- Q: Is touch device drag-and-drop reordering required in this iteration? → A: Touch drag is a stretch goal — must not break on touch, but drag-reordering is not required on mobile this iteration.
- Q: What should happen when local storage is unavailable (incognito, quota exceeded, cleared)? → A: Fall back to creation-date order silently — no error shown to the user.
- Q: How should the dragged card look visually while in flight (being dragged)? → A: Card appears identical to its resting state — no opacity, shadow, or style change while dragging.

## User Scenarios *(mandatory)*

### User Story 1 - Reorder goals by dragging (Priority: P1)

As a user, I can click and drag any goal card within a column and drop it above or below another goal to change its position in the list.

**Why this priority**: This is the core deliverable of the feature — without drag-and-drop reordering, nothing else in this spec has value.

**Independent Validation**: Open the app with at least two goals in the current-goals column. Drag the bottom goal above the top goal and verify their positions are swapped.

**Acceptance Scenarios**:

1. **Given** at least two goals in the current-goals column, **When** the user drags a goal and drops it above another goal, **Then** the dragged goal appears above the target goal in the list.
2. **Given** at least two goals in the current-goals column, **When** the user drags a goal and drops it below another goal, **Then** the dragged goal appears below the target goal in the list.
3. **Given** at least two goals in the completed-goals column, **When** the user drags a goal within that column, **Then** the same reordering behavior applies.

---

### User Story 2 - Preserve custom order across sessions (Priority: P2)

As a user, my custom goal order is remembered so that refreshing the page or returning later shows goals in the same order I arranged them.

**Why this priority**: Without persistence the feature loses most of its utility — users would have to re-sort on every visit.

**Independent Validation**: Reorder goals, then refresh the page and verify the custom order is retained.

**Acceptance Scenarios**:

1. **Given** goals that have been manually reordered, **When** the user refreshes the page, **Then** goals appear in the same custom order.
2. **Given** goals that have been manually reordered, **When** the user closes and reopens the browser, **Then** goals appear in the same custom order.
3. **Given** a new goal is added after reordering, **When** the goal is created, **Then** it appears at the bottom of the list without disturbing the existing order.

---

### User Story 3 - Visual feedback during drag (Priority: P3)

As a user, I receive clear visual cues while dragging a goal so I always know where it will be dropped before releasing.

**Why this priority**: This improves usability and confidence, but the feature is functional without it.

**Independent Validation**: Drag a goal slowly over the list and verify a drop-position indicator appears between goals as the drag target changes.

**Acceptance Scenarios**:

1. **Given** the user has started dragging a goal, **When** the dragged item is held over a valid drop position, **Then** a visual indicator (e.g., highlighted gap or placeholder) shows where the goal will land.
2. **Given** the user has started dragging a goal, **When** the drag is released, **Then** the indicator disappears and the goal settles into the new position.
3. **Given** the user starts dragging and then presses Escape or releases outside a valid drop target, **Then** the goal returns to its original position unchanged.

---

### Edge Cases

- What happens when only one goal exists in a column (no reordering possible)?
- How does the system handle very fast drag-and-drop gestures?
- What happens when a goal is dragged to its current position (no-op drop)?
- How are goals ordered when they first appear (before any user reordering takes place)?
- What happens if a goal is deleted or moved to completed — does the saved order update correctly?
- How does reordering behave on touch devices (mobile/tablet)? *(Stretch goal — touch drag-reordering is not required this iteration; the goal list must remain usable on touch without breaking.)*

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to drag a goal card and drop it at a new position within the same column. The entire card surface acts as the drag zone; clicks on interactive elements (checkbox, action buttons) within the card MUST be distinguished from drag gestures and continue to function normally.
- **FR-002**: System MUST support dropping a goal above or below any other goal in the list.
- **FR-003**: System MUST persist the user-defined goal order in browser-local storage so order survives page refreshes.
- **FR-004**: System MUST apply drag-and-drop independently to both the current-goals column and the completed-goals column.
- **FR-005**: System MUST NOT allow a goal to be dragged from one column to the other via drag-and-drop (column assignment is managed through existing check/move actions).
- **FR-006**: System MUST display a visual drop-position indicator during an active drag to show where the item will land. The dragged card itself MUST retain its normal resting appearance (no opacity change, no shadow, no style modification) while in flight.
- **FR-007**: System MUST cancel the reorder and restore the goal to its original position if the drag is abandoned (e.g., Escape key, drop outside the list).
- **FR-008**: System MUST insert newly created goals at the bottom of the current-goals list without altering the existing order.
- **FR-009**: System MUST update stored order when a goal is deleted or moved to the completed column, so the remaining goals retain their relative order. When a goal transitions to the completed column, it MUST be inserted at the top (position 0) of the completed-goals order, ahead of any previously completed goals.
- **FR-010**: System MUST treat a drop onto the goal's current position as a no-op (no change to order or storage).
- **FR-011**: If local storage is unavailable or write fails, the system MUST silently fall back to displaying goals in creation-date order (oldest first) with no error message shown to the user.

### Key Entities

- **Goal Order**: A per-column ordered list of goal IDs representing the user-defined sequence. Separate orderings exist for current goals and completed goals.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can pick up and drop a goal to a new position within a single, fluid gesture — no additional confirmation step required.
- **SC-002**: The visual drop-position indicator updates in real time as the user moves the dragged item across the list, with no perceivable lag.
- **SC-003**: Custom goal order is restored correctly after a page refresh 100% of the time when local storage is available.
- **SC-004**: Drag-and-drop reordering works correctly on pointer-based (mouse/trackpad) input. Touch devices must not have their existing goal-list interactions broken; touch drag-reordering is a stretch goal deferred to a future iteration.
- **SC-005**: Cancelling a drag (via Escape or out-of-bounds release) always returns the goal to its exact original position with no side effects.

## Assumptions

- Goal order is persisted in the same browser-local storage already used for goal data, keeping persistence consistent with the existing feature. If local storage is unavailable or fails, the display falls back to creation-date order with no error shown.
- Initial display order for goals that have never been manually sorted is by creation date (oldest first), matching whatever order goals currently appear in.
- Drag-and-drop is scoped to within-column reordering only; cross-column movement continues to be controlled by the existing move-to-completed action.
