# sdd-next-app-from-video Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-23

## Active Technologies
- TypeScript / React 19.2.4 / Next.js 16.2.1 + `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (new, justified below); `tailwindcss` v4, `lucide-react` (existing) (002-goal-drag-reorder)
- Browser localStorage — existing `doit_goals` key; storage shape extended with optional `goalOrder: { current: string[], completed: string[] }` field (002-goal-drag-reorder)

- TypeScript 5 + React 19.2.4 + Next.js 16.2.1, Tailwind CSS v4 (`@theme`), shadcn/ui, date-fns (001-doit-goal-tracking)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5 + React 19.2.4: Follow standard conventions

## Recent Changes
- 002-goal-drag-reorder: Added TypeScript / React 19.2.4 / Next.js 16.2.1 + `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (new, justified below); `tailwindcss` v4, `lucide-react` (existing)

- 001-doit-goal-tracking: Added TypeScript 5 + React 19.2.4 + Next.js 16.2.1, Tailwind CSS v4 (`@theme`), shadcn/ui, date-fns

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
