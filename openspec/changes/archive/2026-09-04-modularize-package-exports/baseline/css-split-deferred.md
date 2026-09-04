# Optional per-feature stylesheet split (`./core.css`/`./grid.css`/`./editors.css`) — evaluated, deferred

Task 6.2 asked to decide, at implementation time, whether to add the
optional per-feature stylesheet split described in `design.md` Decision 4,
now that Groups 1-5's JS-side `preserveModules` split is proven out.

**Decision: deferred, not implemented in this change.**

Rationale:

- Decision 4 explicitly frames the split as optional ("may be introduced"),
  not required by any Goal in this change.
- No scenario in `specs/package-distribution/spec.md` requires it — the only
  scenario mentioning per-feature stylesheets ("Optional per-feature
  stylesheet is additive only") is conditioned on `WHEN an optional ...
entry is introduced`, so it simply does not trigger while none exists.
- Splitting `tailwind-entry.scss` into per-feature partials is a distinct
  piece of CSS-architecture work (deciding which selectors are
  core-vs-Grid-vs-editor, verifying Tailwind's `@apply`/utility rules don't
  cross-reference across the split) with its own risk surface, unrelated to
  this change's actual goal (making the JS module graph tree-shakeable).
  Conflating the two would risk the change's core deliverable to ship a
  nice-to-have.
- This change already fully satisfies the mandatory "no CSS removed"
  requirement (Task 6.1: `dist/index.css` rule set is byte-identical,
  1013/1013 rules, before vs. after).

This is recorded as the resolution to the corresponding bullet in
`design.md`'s Open Questions. If a future proposal wants the split, it can
build on this change's JS-side work independently - nothing here blocks it.
