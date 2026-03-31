"use client";

import { GoalItem } from "./goal-item";
import { cn } from "@/lib/utils";
import type { GoalPresentation } from "@/lib/goals/goal-types";

interface GoalColumnProps {
  title: string;
  goals: GoalPresentation[];
  selectedGoalId: string | null;
  onSelectChange: (goalId: string, checked: boolean) => void;
  emptyMessage: string;
  colorClass?: string;
}

export function GoalColumn({
  title,
  goals,
  selectedGoalId,
  onSelectChange,
  emptyMessage,
  colorClass = "bg-goal-current-bg",
}: GoalColumnProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-xl p-5 min-h-[200px]",
        colorClass
      )}
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-foreground">
        {title}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({goals.length})
        </span>
      </h2>
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {goals.map((goal) => (
            <li key={goal.id}>
              <GoalItem
                goal={goal}
                isSelected={selectedGoalId === goal.id}
                onSelectChange={onSelectChange}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
