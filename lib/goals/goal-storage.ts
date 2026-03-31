import type { Goal } from "./goal-types";

const STORAGE_KEY = "doit_goals";

interface RawStorageShape {
  goals: unknown[];
}

function isValidGoal(raw: unknown): raw is Goal {
  if (!raw || typeof raw !== "object") return false;
  const g = raw as Record<string, unknown>;
  return (
    typeof g.id === "string" &&
    typeof g.title === "string" &&
    typeof g.endDate === "string" &&
    (g.status === "current" || g.status === "completed") &&
    typeof g.createdAt === "string"
  );
}

export function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RawStorageShape;
    if (!Array.isArray(parsed?.goals)) return [];
    return parsed.goals.filter(isValidGoal);
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ goals }));
  } catch {
    // Storage unavailable — fail silently
  }
}
