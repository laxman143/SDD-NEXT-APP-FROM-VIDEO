import type { Goal, GoalPresentation } from "./goal-types";
import { getDaysLeft, isUrgent, formatGoalDate } from "@/lib/date/goal-dates";

export function getCurrentGoals(goals: Goal[]): Goal[] {
  return goals.filter((g) => g.status === "current");
}

export function getCompletedGoals(goals: Goal[]): Goal[] {
  return goals.filter((g) => g.status === "completed");
}

export function getSelectedGoal(
  goals: Goal[],
  selectedGoalId: string | null
): Goal | undefined {
  if (!selectedGoalId) return undefined;
  return goals.find((g) => g.id === selectedGoalId);
}

export function toGoalPresentation(goal: Goal): GoalPresentation {
  const daysLeft = getDaysLeft(goal.endDate);
  return {
    ...goal,
    daysLeft,
    isUrgent: goal.status === "current" && isUrgent(daysLeft),
    displayDateLabel: formatGoalDate(goal.endDate),
  };
}
