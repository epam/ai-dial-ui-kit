# Feature pipeline (plan → implement → review → fix)

Run this workflow **in order** in **one conversation**, unless the user stops between steps.

## Phase 1 — Plan

- Output **only** a structured plan (same sections as `/plan-component`: name, props, states, dependencies, deliverables, risks).
- **Do not** write implementation code in Phase 1.

Wait for explicit user confirmation (e.g. “approved”, “go”) before Phase 2, **unless** the user already said to run the full pipeline without pauses.

## Phase 2 — Implement

- Implement strictly according to the approved plan (`/implement-from-plan` rules).
- Run **`npm run typecheck`**, **`npm run lint`**, **`npm run test`**; fix failures.

## Phase 3 — Review

- Act as reviewer **only** (`/review-changes`): correctness, API, a11y, tests, styles, churn.
- Output a **prioritized** must-fix / nice-to-have list with file references.
- **Do not** apply fixes in Phase 3.

## Phase 4 — Apply fixes

- Apply **only** must-fix items from Phase 3 (`/apply-review` rules). Include nice-to-have only if the user asked.
- Re-run **`npm run typecheck`**, **`npm run lint`**, **`npm run test`**.

End with a short summary: what shipped, what was deferred, and any follow-ups for the user.
