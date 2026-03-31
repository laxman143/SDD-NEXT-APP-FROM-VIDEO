// Goal domain types
// Populated by T006

export type GoalStatus = "current" | "completed";

export interface Goal {
  id: string;
  title: string;
  endDate: string; // ISO date string e.g. "2026-04-01"
  status: GoalStatus;
  createdAt: string; // ISO datetime string
  completedAt?: string; // ISO datetime string, set when status = completed
}

export interface GoalSelectionState {
  selectedGoalId: string | null;
  selectedAt?: string; // ISO datetime string
}

export interface GoalPresentation extends Goal {
  daysLeft: number;
  isUrgent: boolean;
  displayDateLabel: string;
}
