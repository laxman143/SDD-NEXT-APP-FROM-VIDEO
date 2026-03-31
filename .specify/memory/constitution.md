<!--
Sync Impact Report
- Version change: N/A (template) → 1.0.0
- Modified principles:
	- Template Principle 1 → I. Clean Code Mandate
	- Template Principle 2 → II. UX Simplicity First
	- Template Principle 3 → III. Responsive-By-Default Design
	- Template Principle 4 → IV. Minimal Dependency Policy
	- Template Principle 5 → V. Zero-Testing Directive (Superseding)
- Added sections:
	- Technology Stack Constraints
	- Delivery Workflow & Compliance
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ✅ README.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present in repository)
- Follow-up TODOs:
	- None
-->

# SDD Next App Constitution

## Core Principles

### I. Clean Code Mandate
All production code MUST be simple, readable, and maintainable. Functions and
components MUST have a single clear responsibility, naming MUST be explicit,
and duplicated logic MUST be consolidated before merge. Unnecessary abstraction,
dead code, and speculative patterns are prohibited.

Rationale: maintainability and predictable change velocity depend on code that is
easy to understand and modify.

### II. UX Simplicity First
User-facing flows MUST prioritize the smallest viable interaction model.
Interfaces MUST avoid unnecessary controls, steps, and visual complexity.
Feature scope MUST default to MVP behavior unless explicit requirements justify
additional interaction states.

Rationale: simple UX reduces cognitive load, defects, and implementation risk.

### III. Responsive-By-Default Design
All UI work MUST render and behave correctly on mobile, tablet, and desktop
viewports. Layouts MUST use responsive Tailwind utilities and avoid fixed,
single-breakpoint assumptions. Any feature that is not responsive is considered
incomplete.

Rationale: the product must serve users consistently across common devices.

### IV. Minimal Dependency Policy
New dependencies MUST NOT be added unless they are essential and materially
reduce complexity. Native platform capabilities and existing dependencies MUST be
used first. Any dependency change MUST include a brief justification in the
related spec/plan.

Rationale: dependency minimization lowers security, upgrade, and maintenance
costs.

### V. Zero-Testing Directive (Superseding)
No automated tests are permitted in this project. Unit tests, integration tests,
end-to-end tests, contract tests, and test scaffolding MUST NOT be added,
required, or generated. This directive supersedes any conflicting template,
agent, or workflow guidance.

Rationale: this project explicitly prioritizes implementation speed and manual
verification over automated test suites.

## Technology Stack Constraints

The project stack MUST remain aligned with `package.json`:

- `next` MUST remain on `16.2.1`
- `react` and `react-dom` MUST remain on `19.2.4`
- `tailwindcss` MUST remain on major `4` (`^4` in `package.json`)
- `@tailwindcss/postcss` MUST remain on major `4` (`^4` in `package.json`)

Any change to these versions or majors requires an explicit constitution
amendment and corresponding update to dependent templates.

## Delivery Workflow & Compliance

All specs, plans, and task breakdowns MUST include explicit checks for clean
code, UX simplicity, responsive behavior, and dependency minimization. They MUST
also explicitly state that testing tasks are prohibited.

Compliance review expectations:

- Every plan and task list MUST include a constitution compliance gate.
- Every change proposal MUST confirm stack-version compliance against
	`package.json`.
- Any detected conflict with Principle V MUST be rejected or amended before
	implementation starts.

## Governance

This constitution is the highest-priority project governance document. When other
guidance conflicts with it, this document prevails.

Amendment policy:

1. Propose changes in writing with rationale and impact.
2. Update dependent templates and runtime guidance in the same change.
3. Record a Sync Impact Report in this file for every amendment.

Versioning policy (Semantic Versioning for governance):

- MAJOR: backward-incompatible governance changes or principle removals.
- MINOR: new principle/section or materially expanded mandatory guidance.
- PATCH: wording clarifications, typo fixes, or non-semantic edits.

Compliance policy:

- Constitution checks are mandatory for planning artifacts.
- Non-compliant work items MUST be revised before execution.

**Version**: 1.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-23
