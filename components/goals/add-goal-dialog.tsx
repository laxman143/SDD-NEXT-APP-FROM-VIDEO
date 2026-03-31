"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidFutureOrTodayDate } from "@/lib/date/goal-dates";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, endDate: string) => void;
}

export function AddGoalDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddGoalDialogProps) {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setEndDate("");
    setTitleError(null);
    setDateError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let valid = true;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Goal title is required.");
      valid = false;
    } else {
      setTitleError(null);
    }

    if (!endDate || !isValidFutureOrTodayDate(endDate)) {
      setDateError("End date must be today or a future date.");
      valid = false;
    } else {
      setDateError(null);
    }

    if (!valid) return;

    onSubmit(trimmedTitle, endDate);
    resetForm();
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="e.g. Finish portfolio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                aria-describedby={titleError ? "title-error" : undefined}
              />
              {titleError && (
                <p id="title-error" className="text-sm text-destructive">
                  {titleError}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="goal-end-date">End Date</Label>
              <Input
                id="goal-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-describedby={dateError ? "date-error" : undefined}
              />
              {dateError && (
                <p id="date-error" className="text-sm text-destructive">
                  {dateError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
