"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { GoalPresentation } from "@/lib/goals/goal-types";

interface GoalItemProps {
  goal: GoalPresentation;
  isSelected: boolean;
  onSelectChange: (goalId: string, checked: boolean) => void;
}

export function GoalItem({ goal, isSelected, onSelectChange }: GoalItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors",
        isSelected
          ? "border-goal-selected-ring bg-accent/40 ring-1 ring-goal-selected-ring"
          : "border-border bg-background hover:bg-muted/40",
        goal.isUrgent && "bg-goal-urgent-bg border-goal-urgent-border"
      )}
    >
      <Checkbox
        id={`goal-${goal.id}`}
        checked={isSelected}
        onCheckedChange={(checked) =>
          onSelectChange(goal.id, checked === true)
        }
        aria-label={`Select goal: ${goal.title}`}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={`goal-${goal.id}`}
          className="block font-medium text-foreground cursor-pointer leading-snug"
        >
          {goal.title}
        </label>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
          <span>Due: {goal.displayDateLabel}</span>
          {goal.status === "current" && (
            <span
              className={cn(
                "font-medium",
                goal.isUrgent ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {goal.daysLeft < 0
                ? `${Math.abs(goal.daysLeft)}d overdue`
                : goal.daysLeft === 0
                ? "Due today"
                : `${goal.daysLeft}d left`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
