# Tasks: Goal Drag-and-Drop Reordering

**Input**: Design documents from `/specs/002-goal-drag-reorder/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ui-contract.md ✓, quickstart.md ✓

**Tests**: Do not create test tasks. Automated tests are prohibited by the project constitution (Zero-Testing Directive).

**Organization**: Tasks are grouped by user story to enable independent implementation and delivery of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no prior-phase dependencies)
- **[Story]**: User story this task belongs to (US1, US2, US3)
- Exact file paths are included in every task description

---

## Phase 1: Setup

**Purpose**: Install new dependencies required for drag-and-drop.

- [ ] T001 Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` via `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

**Checkpoint**: `node_modules/@dnd-kit/` exists; `package.json` lists all three packages; `npm run dev` starts without error.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and pure utility functions that every user story depends on. MUST complete before US1, US2, or US3 work begins.

**⚠️ CRITICAL**: No user story tasks can begin until T002 and T003 are complete.

- [ ] T002 [P] Add `GoalOrderMap` interface (`{ current: string[]; completed: string[] }`) to `lib/goals/goal-types.ts`
- [ ] T003 [P] Create `lib/goals/goal-order.ts` with four pure exported functions: `mergeOrder(goals, orderIds)` (returns goals sorted by orderIds, unrecognised IDs appended by createdAt), `reorderWithinColumn(orderIds, activeId, overId)` (uses `arrayMove` from `@dnd-kit/sortable`; returns same array unchanged when positions are equal), `insertAtBottom(orderIds, newId)` (returns `[...orderIds, newId]`), `removeFromOrder(orderIds, id)` (returns array without id)

**Checkpoint**: TypeScript compiles; `GoalOrderMap` is importable; `goal-order.ts` exports all four functions with correct return types.

---

## Phase 3: User Story 1 — Reorder Goals by Dragging (Priority: P1) 🎯 MVP

**Goal**: Users can drag any goal card within a column and drop it at a new position. Order updates immediately in-memory on drop. Drop-position feedback and persistence are added in later phases.

**Independent Validation**:
1. Open app with ≥2 goals in the current-goals column
2. Click-hold and drag the lower goal above the upper goal, moving ≥8px
3. Confirm goals swap positions instantly on release
4. Confirm clicking the checkbox or action buttons does not trigger a drag

### Implementation

- [ ] T004 [P] [US1] Wire `useSortable` to the card root `<div>` in `components/goals/goal-item.tsx`: import `useSortable` from `@dnd-kit/sortable` and `CSS` from `@dnd-kit/utilities`; destructure `attributes`, `listeners`, `setNodeRef`, `transform`, `transition` from `useSortable({ id: goal.id })`; apply `ref={setNodeRef}`, `style={{ transform: CSS.Transform.toString(transform), transition }}`, and spread `{...attributes, ...listeners}` on the root div. Do NOT change any visual styling (no opacity, shadow, or class changes — card must look identical while dragging per FR-006)
- [ ] T005 [P] [US1] Add `orderedIds: string[]` and `onReorder: (activeId: string, overId: string) => void` props to `GoalColumn` in `components/goals/goal-column.tsx`; import `SortableContext` and `verticalListSortingStrategy` from `@dnd-kit/sortable`; wrap the `<ul>` in `<SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>`
- [ ] T006 [US1] Update `app/page.tsx`:
  - Import `DndContext`, `PointerSensor`, `KeyboardSensor`, `useSensor`, `useSensors` from `@dnd-kit/core`
  - Import `GoalOrderMap` from `lib/goals/goal-types`
  - Import `mergeOrder`, `reorderWithinColumn` from `lib/goals/goal-order`
  - Add `goalOrder` state: `useState<GoalOrderMap>({ current: [], completed: [] })`
  - Configure sensors: `PointerSensor` with `activationConstraint: { distance: 8 }` and `KeyboardSensor`
  - Add `handleDragEnd` that calls `reorderWithinColumn` on the correct column's order array and updates `goalOrder` state (no-op when `active.id === over?.id` or `over` is null)
  - Wrap the two-column grid in `<DndContext sensors={sensors} onDragEnd={handleDragEnd}>`
  - Derive display-ordered lists: replace raw `getCurrentGoals`/`getCompletedGoals` calls with `mergeOrder(getCurrentGoals(goals), goalOrder.current)` and `mergeOrder(getCompletedGoals(goals), goalOrder.completed)` before mapping to `GoalPresentation`
  - Pass `orderedIds={goalOrder.current}` / `orderedIds={goalOrder.completed}` and `onReorder` to each `GoalColumn`

**Checkpoint**: US1 is independently functional — goals reorder on drag-and-drop; checkbox/button clicks are unaffected; order resets on refresh (persistence added in US2).

---

## Phase 4: User Story 2 — Preserve Custom Order Across Sessions (Priority: P2)

**Goal**: User-defined goal order survives page refresh and browser restart. New goals appear at the bottom; completed goals appear at the top of the completed column; deleting a goal removes it from the stored order.

**Independent Validation**:
1. Reorder goals in both columns
2. Refresh the page — verify order is retained
3. Add a new goal — verify it appears at the bottom of current-goals
4. Move a goal to completed — verify it appears at the top of completed-goals
5. Delete a goal — verify remaining goals keep their relative order

### Implementation

- [ ] T007 [P] [US2] Extend `lib/goals/goal-storage.ts`: add `loadGoalOrder(): GoalOrderMap` (reads the optional `goalOrder` field from the existing `doit_goals` localStorage key; returns `{ current: [], completed: [] }` on any missing/invalid/error case) and `saveGoalOrder(order: GoalOrderMap): void` (writes `goalOrder` into the same `doit_goals` JSON object alongside `goals`; fails silently on error). Import `GoalOrderMap` from `lib/goals/goal-types`
- [ ] T008 [US2] Update `app/page.tsx` to load and persist `goalOrder`:
  - In the mount `useEffect`, call `loadGoalOrder()` and set `goalOrder` state alongside the existing `loadGoals()` call
  - Add a new `useEffect` that calls `saveGoalOrder(goalOrder)` whenever `goalOrder` changes (gated on `hydrated` like the existing goals effect)
- [ ] T009 [US2] Update `handleAddGoal` in `app/page.tsx` to also call `setGoalOrder(prev => ({ ...prev, current: insertAtBottom(prev.current, id) }))` after adding the goal — use the same generated `id` passed to `createGoal`. Import `insertAtBottom` from `lib/goals/goal-order`
- [ ] T010 [US2] Update `handleMoveToCompleted` in `app/page.tsx` to also update `goalOrder`: remove the completed goal's ID from `goalOrder.current` using `removeFromOrder` and prepend it to `goalOrder.completed` (i.e., `[completedId, ...prev.completed]`). Import `removeFromOrder` from `lib/goals/goal-order`
- [ ] T011 [US2] Update `handleDelete` in `app/page.tsx` to also call `setGoalOrder(prev => ({ current: removeFromOrder(prev.current, id), completed: removeFromOrder(prev.completed, id) }))` for the deleted goal's ID

**Checkpoint**: US2 fully functional — custom order survives refresh; new goals bottom-insert; completed goals top-insert; deleted goals cleanly removed from stored order.

---

## Phase 5: User Story 3 — Visual Feedback During Drag (Priority: P3)

**Goal**: A 2px Tailwind accent-coloured horizontal bar appears between goal items to show the drop landing position during drag. The bar disappears on drop or cancellation.

**Independent Validation**:
1. Drag a goal card slowly over the list
2. Verify a thin accent-coloured bar appears between the goals on either side of the cursor position as you move
3. Release the drag — verify bar disappears and goal settles into the indicated position
4. Press Escape during drag — verify bar disappears and goal returns to original position

### Implementation

- [ ] T012 [P] [US3] Add `activeId` (`string | null`, default `null`) and `overId` (`string | null`, default `null`) state to `app/page.tsx`; add `onDragStart={(e) => setActiveId(String(e.active.id))}` and `onDragOver={(e) => setOverId(e.over ? String(e.over.id) : null)}` to the `DndContext`; clear both in `handleDragEnd` (`setActiveId(null); setOverId(null)`) and add `onDragCancel={() => { setActiveId(null); setOverId(null); }}` to `DndContext`; pass `activeId` and `overId` as props to both `GoalColumn` instances
- [ ] T013 [US3] Update `components/goals/goal-column.tsx` to accept `activeId: string | null` and `overId: string | null` props; when rendering the items list, insert a `<div className="h-0.5 rounded-full bg-accent my-0.5" />` immediately before each `<li>` whose `goal.id === overId` and `activeId` is in this column's `orderedIds` and `activeId !== overId`. Remove the indicator when `activeId` is null

**Checkpoint**: US3 fully functional — 2px accent bar tracks drop position in real time; disappears on drop and cancel; dragged card retains normal appearance throughout.

---

## Phase 6: Polish & Validation

**Purpose**: End-to-end manual verification across all acceptance criteria and edge cases.

- [ ] T014 Run all 10 manual validation scenarios from `specs/002-goal-drag-reorder/quickstart.md` in a browser; address any regressions; confirm every scenario passes before marking the feature complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (packages installed); BLOCKS all user story work
- **US1 (Phase 3)**: Depends on Foundational completion
- **US2 (Phase 4)**: Depends on US1 completion (T006 establishes goalOrder state in page.tsx)
- **US3 (Phase 5)**: Depends on US1 completion (T006 establishes DndContext in page.tsx); can run in parallel with US2 after T006
- **Polish (Phase 6)**: Depends on US1, US2, US3 completion

### User Story Dependencies

- **US1 (P1)**: Requires Foundational (T002, T003) → Start of T004, T005, T006
- **US2 (P2)**: Requires US1 complete (T006) → T007 can start in parallel with US1; T008–T011 require T006 + T007
- **US3 (P3)**: Requires US1 complete (T006) → T012 can parallel T007; T013 requires T012

### Within Each Phase

- T004 and T005 are independent files — run in parallel
- T007 (storage, different file) can start in parallel with T004/T005 once Foundational is done
- T008 → T009 → T010 → T011 are sequential (all edit page.tsx)
- T012 and T013 are sequential (T013 consumes props from T012)

---

## Parallel Execution Examples

### Foundational Phase (Phase 2)

```
Parallel:
  T002 — lib/goals/goal-types.ts  (add GoalOrderMap)
  T003 — lib/goals/goal-order.ts  (create utility module)
```

### US1 Phase (Phase 3)

```
Parallel first:
  T004 — components/goals/goal-item.tsx  (useSortable hook)
  T005 — components/goals/goal-column.tsx  (SortableContext)
  
Then sequential:
  T006 — app/page.tsx  (DndContext + goalOrder state + onDragEnd)
```

### US2 + US3 (Phases 4 & 5) — can interleave after T006

```
Parallel start after T006:
  T007 — lib/goals/goal-storage.ts  (loadGoalOrder / saveGoalOrder)
  T012 — app/page.tsx  (activeId / overId tracking)

Then:
  T008 — app/page.tsx  (load + persist goalOrder)    [after T007]
  T013 — components/goals/goal-column.tsx  (indicator) [after T012]

Then sequential in page.tsx:
  T009 → T010 → T011  (handleAddGoal, handleMoveToCompleted, handleDelete)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: US1 (T004 → T005 → T006)
4. **STOP and VALIDATE**: Goals drag-reorder in-memory; order resets on refresh (expected at this stage)
5. Proceed to US2 for persistence

### Incremental Delivery

1. **US1 complete** → drag reorder works, not persistent → Demo MVP
2. **US2 complete** → order survives refresh → Full persistence
3. **US3 complete** → drop indicator visible → Polished UX
4. **Phase 6 complete** → all 10 quickstart scenarios verified → Ship
