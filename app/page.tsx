"use client";

import { useEffect, useState, useCallback } from "react";
import type { Goal, GoalSelectionState } from "@/lib/goals/goal-types";
import { loadGoals, saveGoals } from "@/lib/goals/goal-storage";
import {
  createGoal,
  selectGoal,
  completeSelectedGoal,
  deleteSelectedGoal,
} from "@/lib/goals/goal-actions";
import {
  getCurrentGoals,
  getCompletedGoals,
  getSelectedGoal,
  toGoalPresentation,
} from "@/lib/goals/goal-selectors";
import { GoalColumn } from "@/components/goals/goal-column";
import { GoalActions } from "@/components/goals/goal-actions";
import { AddGoalDialog } from "@/components/goals/add-goal-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function generateId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selection, setSelection] = useState<GoalSelectionState>({
    selectedGoalId: null,
  });
  const [hydrated, setHydrated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Hydrate from local storage on mount
  useEffect(() => {
    setGoals(loadGoals());
    setHydrated(true);
  }, []);

  // Persist goals to local storage whenever they change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveGoals(goals);
  }, [goals, hydrated]);

  const handleSelectChange = useCallback(
    (goalId: string, checked: boolean) => {
      if (!checked && selection.selectedGoalId === goalId) {
        setSelection({ selectedGoalId: null });
      } else if (checked) {
        setSelection(selectGoal(selection, goalId));
      } else {
        setSelection({ selectedGoalId: null });
      }
    },
    [selection]
  );

  const handleAddGoal = useCallback(
    (title: string, endDate: string) => {
      setGoals((prev) =>
        createGoal(prev, { id: generateId(), title, endDate })
      );
    },
    []
  );

  const handleMoveToCompleted = useCallback(() => {
    setGoals((prev) => completeSelectedGoal(prev, selection));
    setSelection({ selectedGoalId: null });
  }, [selection]);

  const handleDelete = useCallback(() => {
    setGoals((prev) => deleteSelectedGoal(prev, selection));
    setSelection({ selectedGoalId: null });
  }, [selection]);

  if (!hydrated) {
    return null;
  }

  const currentGoals = getCurrentGoals(goals).map(toGoalPresentation);
  const completedGoals = getCompletedGoals(goals).map(toGoalPresentation);
  const selectedGoal = getSelectedGoal(goals, selection.selectedGoalId ?? null);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            Doit — Goal Tracker
          </h1>
          <Button onClick={() => setDialogOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Action bar — shown when a goal is selected */}
        {selectedGoal && (
          <div className="mb-4">
            <GoalActions
              selectedGoal={selectedGoal}
              onMoveToCompleted={handleMoveToCompleted}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* Two-column goal board */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GoalColumn
            title="Current Goals"
            goals={currentGoals}
            selectedGoalId={selection.selectedGoalId ?? null}
            onSelectChange={handleSelectChange}
            emptyMessage="No current goals. Add one to get started!"
            colorClass="bg-goal-current-bg"
          />
          <GoalColumn
            title="Completed Goals"
            goals={completedGoals}
            selectedGoalId={selection.selectedGoalId ?? null}
            onSelectChange={handleSelectChange}
            emptyMessage="No completed goals yet."
            colorClass="bg-goal-completed-bg"
          />
        </div>

        {/* Add Goal Dialog */}
        <AddGoalDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleAddGoal}
        />
      </div>
    </main>
  );
}
