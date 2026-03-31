import type { Goal, GoalSelectionState } from "./goal-types";

/**
 * Creates a new goal with status "current".
 * Caller is responsible for providing a stable unique id.
 */
export function createGoal(
  goals: Goal[],
  payload: { id: string; title: string; endDate: string }
): Goal[] {
  const newGoal: Goal = {
    id: payload.id,
    title: payload.title.trim(),
    endDate: payload.endDate,
    status: "current",
    createdAt: new Date().toISOString(),
  };
  return [...goals, newGoal];
}

/**
 * Selects a goal by id. Selecting the same goal again deselects it.
 */
export function selectGoal(
  selection: GoalSelectionState,
  goalId: string
): GoalSelectionState {
  if (selection.selectedGoalId === goalId) {
    return { selectedGoalId: null };
  }
  return { selectedGoalId: goalId, selectedAt: new Date().toISOString() };
}

/**
 * Moves the currently selected goal (must be "current") to "completed".
 */
export function completeSelectedGoal(
  goals: Goal[],
  selection: GoalSelectionState
): Goal[] {
  if (!selection.selectedGoalId) return goals;
  return goals.map((g) =>
    g.id === selection.selectedGoalId && g.status === "current"
      ? { ...g, status: "completed", completedAt: new Date().toISOString() }
      : g
  );
}

/**
 * Permanently removes the currently selected goal from the list.
 */
export function deleteSelectedGoal(
  goals: Goal[],
  selection: GoalSelectionState
): Goal[] {
  if (!selection.selectedGoalId) return goals;
  return goals.filter((g) => g.id !== selection.selectedGoalId);
}
