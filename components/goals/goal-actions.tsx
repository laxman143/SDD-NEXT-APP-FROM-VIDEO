"use client";

import { Button } from "@/components/ui/button";
import type { Goal } from "@/lib/goals/goal-types";

interface GoalActionsProps {
  selectedGoal: Goal | undefined;
  onMoveToCompleted: () => void;
  onDelete: () => void;
}

export function GoalActions({
  selectedGoal,
  onMoveToCompleted,
  onDelete,
}: GoalActionsProps) {
  if (!selectedGoal) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
      <span className="flex-1 min-w-0 text-sm text-foreground font-medium truncate">
        Selected:{" "}
        <span className="font-semibold">{selectedGoal.title}</span>
      </span>
      <div className="flex gap-2 shrink-0">
        {selectedGoal.status === "current" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onMoveToCompleted}
          >
            Move to Completed
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
        >
          Delete Permanently
        </Button>
      </div>
    </div>
  );
}
