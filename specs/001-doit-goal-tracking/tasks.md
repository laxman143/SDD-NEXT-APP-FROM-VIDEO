# Tasks: Doit Goal Tracking Initial Page

**Input**: Design documents from `/specs/001-doit-goal-tracking/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Do not create test tasks. Automated tests are prohibited by the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and delivery of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base scaffolding for feature delivery.

- [X] T001 Add `shadcn/ui` and `date-fns` dependencies in package.json
- [X] T002 Initialize shadcn component registry and base UI primitives in components/ui/
- [X] T003 [P] Define pastel light `@theme` tokens in app/globals.css
- [X] T004 [P] Create feature directory scaffolding in components/goals/ and lib/goals/
- [X] T005 [P] Create date utility module scaffold in lib/date/goal-dates.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared goal domain and persistence logic required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Implement Goal and selection types in lib/goals/goal-types.ts
- [X] T007 Implement local storage adapter (load/save/normalize) in lib/goals/goal-storage.ts
- [X] T008 [P] Implement date formatting + days-left + urgency helpers in lib/date/goal-dates.ts
- [X] T009 [P] Implement derived selectors for current/completed/selected goals in lib/goals/goal-selectors.ts
- [X] T010 Implement selection, complete, delete, and create action reducers in lib/goals/goal-actions.ts
- [X] T011 Create top-level goals feature state wiring in app/page.tsx (state init + hydration + persistence effect)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Create and view active goals (Priority: P1) 🎯 MVP

**Goal**: Allow users to add a goal via modal and view it in current goals with days-left and urgency behavior.

**Independent Validation**: Add a valid goal and verify current column placement, formatted date, days-left value, and urgency highlight (<=3 days).

### Implementation for User Story 1

- [X] T012 [P] [US1] Build add-goal modal form component with title/end-date validation in components/goals/add-goal-dialog.tsx
- [X] T013 [P] [US1] Build reusable goal item presentational component in components/goals/goal-item.tsx
- [X] T014 [US1] Build current-goals column component and integrate days-left/urgency display in components/goals/goal-column.tsx
- [X] T015 [US1] Integrate add-goal trigger and modal submit flow into page state in app/page.tsx
- [X] T016 [US1] Persist created goals and restore current-goals view on reload in app/page.tsx and lib/goals/goal-storage.ts

**Checkpoint**: User Story 1 is fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Complete goals from current list (Priority: P2)

**Goal**: Support selection-first flow and explicit move-to-completed action.

**Independent Validation**: Select a current goal, execute Move to Completed, and verify completed-column placement with persistence after reload.

### Implementation for User Story 2

- [X] T017 [P] [US2] Build selection-aware action bar with explicit move action in components/goals/goal-actions.tsx
- [X] T018 [US2] Wire checkbox selection behavior (no immediate status change) in components/goals/goal-item.tsx and app/page.tsx
- [X] T019 [US2] Implement move-to-completed transition wiring in app/page.tsx using lib/goals/goal-actions.ts
- [X] T020 [US2] Build completed-goals column rendering in components/goals/goal-column.tsx and connect in app/page.tsx
- [X] T021 [US2] Persist completion transitions and reload consistency in lib/goals/goal-storage.ts and app/page.tsx

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Remove goals permanently (Priority: P3)

**Goal**: Allow explicit permanent deletion for selected goals from either column.

**Independent Validation**: Select goal in current or completed column, execute Delete, and verify permanent removal after reload.

### Implementation for User Story 3

- [X] T022 [P] [US3] Add explicit delete action handling UI state in components/goals/goal-actions.tsx
- [X] T023 [US3] Implement permanent delete transition in lib/goals/goal-actions.ts
- [X] T024 [US3] Wire delete flow from selected goal to state update in app/page.tsx
- [X] T025 [US3] Persist deletion and verify removed items do not rehydrate in lib/goals/goal-storage.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinement across all stories.

- [X] T026 [P] Refine responsive two-column stacking behavior in components/goals/goal-column.tsx and app/page.tsx
- [X] T027 [P] Apply final pastel theme usage cleanup against `@theme` tokens in app/globals.css and components/goals/*.tsx
- [X] T028 Improve empty-state and validation message clarity in components/goals/add-goal-dialog.tsx and components/goals/goal-column.tsx
- [X] T029 Perform manual quickstart validation and update findings in specs/001-doit-goal-tracking/quickstart.md
- [X] T030 Update feature documentation notes in specs/001-doit-goal-tracking/plan.md and specs/001-doit-goal-tracking/contracts/ui-contract.md if behavior diverges

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational - integrates with US1 state and UI structures.
- **User Story 3 (P3)**: Can start after Foundational - integrates with US1/US2 selection and state transitions.

### Within Each User Story

- Shared logic before UI wiring.
- Selection state before explicit actions.
- State transitions before persistence verification.
- Story validation before moving to next priority when running sequentially.

### Parallel Opportunities

- T003, T004, T005 can run in parallel in Setup.
- T008 and T009 can run in parallel in Foundational.
- T012 and T013 can run in parallel in US1.
- T017 can run in parallel with preparation work in US2.
- T022 can run in parallel with transition logic prep in US3.
- T026 and T027 can run in parallel in Polish.

---

## Parallel Example: User Story 1

```bash
Task: "Build add-goal modal form component with title/end-date validation in components/goals/add-goal-dialog.tsx"
Task: "Build reusable goal item presentational component in components/goals/goal-item.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate US1 manually via quickstart scenarios.
5. Demo MVP.

### Incremental Delivery

1. Setup + Foundational establish shared architecture.
2. Add US1 for initial value.
3. Add US2 for explicit completion flow.
4. Add US3 for permanent cleanup flow.
5. Run Polish pass and manual validation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Then parallelize by story focus:
   - Developer A: US1 modal + current column UX.
   - Developer B: US2 selection and completion flow.
   - Developer C: US3 deletion and persistence checks.

---

## Notes

- Every task follows required checklist format: `- [ ] T### [P?] [US?] Description with file path`.
- No automated test tasks are included by constitution directive.
- Keep file ownership clean to reduce merge conflicts in `app/page.tsx`.
- Preserve stack/version constraints from constitution and plan.
