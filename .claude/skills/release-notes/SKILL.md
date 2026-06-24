---
name: release-notes
description: Use when the user asks to enhance, refine, polish, or "look at" the release notes for a tag of @epam/ai-dial-ui-kit — typically a freshly cut stable release (e.g. `0.11.0`). Reads the CI-generated notes off the GitHub release, classifies and rewrites each bullet in this project's editorial voice, and saves a draft to `.claude/release-notes/`. Also identifies whether CHANGELOG.md needs updating for breaking changes. Never edits GitHub directly.
allowed-tools: Read Grep Glob Bash(gh release view:*) Bash(gh release list:*) Bash(gh pr view:*) Bash(gh pr list:*) Bash(gh pr diff:*) Bash(git log:*) Bash(git show:*) Bash(git diff:*) Bash(git tag:*) Bash(git rev-parse:*) Bash(date:*) Write(.claude/release-notes/*)
argument-hint: '[tag]'
arguments: tag
model: opus
effort: xhigh
context: fork
agent: general-purpose
---

# @epam/ai-dial-ui-kit — release-notes enhancer

The CI publishes a release for every tag with bullets that are the raw PR titles. Those bullets carry noise — conventional-commit prefixes (`feat(scope):`, `fix(area):`), cross-project issue refs from consumer repos (ai-dial-chat, ai-dial-admin-frontend), repeated scope prefixes, tooling/internal items under `## Other`, and a `## Tests` section that has zero consumer impact. The stable releases at `https://github.com/epam/ai-dial-ui-kit/releases` are what those raw notes look like after a human editorial pass. This skill reproduces that pass.

You are running in a forked, isolated context. Read and research freely — only the final summary you return reaches the main conversation. All file writes happen in this fork; the draft lands at `.claude/release-notes/<tag>-draft.md`.

## When to use

- "Enhance the release notes for `0.11.0`"
- "Look at the latest release notes and refine them"
- "The CI just published `<tag>`, make it readable"
- "Polish the release notes for the current tag"

Do **not** trigger on requests like "what changed in 0.10.0?" — that is a recall question, not a notes-editing task.

## Inputs

`tag` = `$tag` — the GitHub release tag to enhance (e.g. `0.11.0`, `0.10.0`). If empty, pick the most recent tag from `gh release list --limit 5` and confirm with the user before editing.

## Workflow

### 1. Resolve target and reference styles

1. `gh release view <tag> --json body,name,tagName` — capture the raw CI notes.
2. `gh release list --limit 10` — locate the previous stable tag.
3. `gh release view <prev-tag> --json body` — style anchor. Match their terseness; one line per bullet.
4. `git log <prev-tag>..<tag> --oneline` — full commit list for the range, to spot commits the CI dropped.

### 2. Pull source context for each bullet

For every bullet in the raw notes:

1. Parse out the trailing `(Issue #<issue>) (#<PR>)` or just `(#<PR>)`. Canonical reference order is `#<issue> (#<PR>)`.
2. `gh pr view <PR> --json title,body,labels` — read the PR body for the _why_ and _what-it-replaces_; the title is too compressed.
3. For bullets without a PR number, find the commit with `git log <prev-tag>..<tag> --oneline | grep -i <keywords>` and `git show <hash>` — fold into a related entry rather than leaving standalone.

**Cross-project issue refs:** This repo's PRs sometimes cite issue numbers from `ai-dial-chat` or `ai-dial-admin-frontend` (e.g. `Issue #2352`, `Issue #3188`). Keep the PR ref (`#<PR>`) but drop or omit the external issue ref unless it adds meaningful context for a component library consumer.

**Grouping related PRs:** When multiple PRs are clearly follow-ups on the same feature or component (e.g. `Add SchemaRenderer`, `Add flat sections variant to SchemaRenderer`, `Support hidden fields in schema renderer`), fold them into one bullet with all PR refs at the end: `(#648, #659, #674)`. Large releases require aggressive grouping to stay readable.

### 3. Check CHANGELOG.md for breaking changes

Before writing the draft, read `CHANGELOG.md`:

```bash
gh release view <tag> --json tagName
# then:
# Read CHANGELOG.md and look for the ## [<tag>] section
```

- If `## [<tag>]` has a `### Breaking Changes` subsection, confirm each breaking change appears in the draft with a `[Breaking]` prefix and a link to its migration guide.
- If breaking changes exist in the raw release notes but are **not** in `CHANGELOG.md`, note this in the editorial file as an open question — the user needs to add the CHANGELOG entry and migration guide before the release is complete.
- Check `migration-guides/README.md` to confirm migration guides exist for each breaking change.

### 4. Classify each bullet

The raw CI's `## Features` / `## Fixes` / `## Tests` / `## Other` partition is unreliable. Reclassify by actual consumer impact:

| Where CI put it                        | Where it belongs | Rule                                         |
| -------------------------------------- | ---------------- | -------------------------------------------- |
| `Other` starting with `feat(...)`      | `Features`       | A feat that lost its slot to a scope prefix. |
| `Other` starting with `fix(...)`       | `Fixes`          | Same, for fix.                               |
| `Tests` — any entry                    | **Drop**         | Zero consumer impact.                        |
| Multiple PRs on the same new component | one folded entry | Cite PR numbers in parens.                   |
| `Other` for a security dep bump (CVE)  | `Fixes`          | Security items are consumer-relevant.        |

**Drop these entirely** — no consumer-visible effect:

- All `## Tests` entries (test updates, expectation changes, coverage).
- Agent/tooling scaffolding (`chore: add code-reviewer agent`, `chore: add figma mcp`, `add postToolUse hook`).
- CI-only changes (`chore(ci): align workflows`, `Upgrade CI template version`).
- `[skip ci]` items that are infrastructure-only (Storybook build env var changes, CI config).
- Dependabot bumps for `github-actions` group or dev-only non-security deps.
- Pure internal refactors, renames, test-only changes, `Merge remote-tracking` commits.

**Keep in `Other`** — items consumers or maintainers care about:

- Security-adjacent dependency bumps (`bump dompurify`, `bump follow-redirects`, CVEs).
- Peer dependency changes or runtime dependency upgrades.
- Significant dev tooling that affects contributors (e.g. new Storybook features).

**Flag as `[Breaking]`** — items that require consumer code changes:

- Renamed/removed props, changed component behavior, removed exports, altered CSS token names.
- Always link to the migration guide: `(#<PR>) — see [migration guide](migration-guides/<version>/<guide>.md)`.

If unsure whether to keep a bullet: _would a consumer of `@epam/ai-dial-ui-kit` reading these notes care?_ If no, drop it.

### 5. Rewrite each kept bullet

Raw form: `* feat(scope): description (Issue #NNN) (#NNN)`. Rewrite to:

```
* <Active-voice description of what changed> — <brief why-it-matters> (#<PR>)
```

Rules in order of importance:

1. **One line per bullet.** No multi-paragraph descriptions.
2. **Drop the conventional prefix** (`feat:`, `fix:`, `chore:`, `feat(scope):`). Replace with prose.
3. **Drop scope-as-noun repetition.** Don't start the bullet with the scope name.
4. **Use a `—` em-dash for the "why" clause**, not a hyphen or colon.
5. **Backticks for code identifiers**: prop names (`items`), component names (`DialDropdown`), enum values, CSS classes.
6. **Preserve PR refs at the end** in `(#<PR>)` form. For grouped entries list all PRs: `(#648, #659, #674)`. Omit cross-project issue numbers (see §2 above).
7. **Prefix with `[Breaking]`** for breaking changes; include the migration guide link.
8. **Flag regressions explicitly**: `(regression fix)` for items restoring previously-working behavior.
9. **Quote CVE IDs verbatim** for security upgrades.
10. **For new components**, lead with the component name in backticks: `` `DialFabButton` added — ... ``.

#### Example transformations (this project's patterns)

```
# Grouping multiple related PRs for the same new component:
- * (SchemaRenderer) add new render types and rename  to DialSchemaRenderer (#655)
- * Add flat sections variant to SchemaRenderer (#659)
- * Support hidden fields in schema renderer (#674)
- * Remove left border and fields summary for the schema renderer (#662)
+ * `DialSchemaRenderer` added — renders structured JSON schemas with flat/nested sections, hidden field support, and top-level validation (#655, #659, #662, #674)

# Dropping prefix and em-dashing the why:
- * [Dropdown, Select] Add ability to support children for menu items (#658)
+ * `DialDropdown` and `DialSelect` menu items now accept children — enables custom content inside dropdown options (#658)

# New component, active voice:
- * add Fab Button (#698)
- * add fab to index (#700)
+ * `DialFabButton` added — floating action button for primary contextual actions (#698, #700)

# Folding follow-up fix into feature:
- * add Progress bar and Pagination (#690)
+ * `DialProgressBar` and `DialPagination` added (#690)

# Breaking change with migration link:
- * (DialDropdown) flatten menu prop (#NNN)
+ * [Breaking] `DialDropdown` — `menu` prop replaced with flat props (`items`, `onItemClick`, `menuHeader`, `menuFooter`) (#NNN) — see [migration guide](migration-guides/0.11.0/dropdown-menu-prop-flatten.md)

# Dropping noise from Tests:
- * Format expectation for button class names in DropdownIcon tests (#699)  ← drop entirely

# Dropping CI/tooling noise from Other:
- * add code-reviewer agent and commands for enhanced code review process (#693) [skip ci]  ← drop
- * Chore/add figma mcp (#682)  ← drop
- * Upgrade CI template version (#665)  ← drop

# Keeping security dep bump in Other:
- * bump ip-address and express-rate-limit (#663)
+ * Upgrade `ip-address` and `express-rate-limit` dependencies (#663)

# Dropping github-actions dependabot bumps:
- * bump dependabot/fetch-metadata from 3.0.0 to 3.1.0 in the github-actions group (#647) [skip ci]  ← drop
```

### 6. Save the draft (and optional editorial companion)

Write:

- **`.claude/release-notes/<tag>-draft.md`** — the final notes, ready to paste into the GitHub release body. No preamble or commentary — just headings and bullets.
- **`.claude/release-notes/<tag>-editorial-notes.md`** _(optional, only when useful)_ — non-obvious calls worth surfacing:
  - Grouping decisions (which PRs were folded and why).
  - Items dropped, with one-line reason each.
  - Open questions (missing CHANGELOG entry for a breaking change, ambiguous classification, cross-project issue refs dropped).

### 7. Verify nothing was pushed to GitHub

This skill **never** runs `gh release edit`, `gh release create`, or any write operation against the repo. Drafts only.

## Output format

The file saved to `.claude/release-notes/<tag>-draft.md` follows this shape exactly (including `---` separators, which match the CI format):

```markdown
## Features

- <one bullet per change or group>

---

## Fixes

- <one bullet per change>

---

## Other

- <only consumer- or maintainer-relevant items>
```

Omit any section that has no entries. Do **not** include a `## Tests` section. Section order: `Features` → `Fixes` → `Other`.

Breaking changes appear at the **top of `Features`** (or `Fixes` if it is only a behavioral correction), prefixed with `[Breaking]`.

## Return to the main conversation

Return a short summary — five lines or fewer:

- The draft path (`.claude/release-notes/<tag>-draft.md`).
- Counts of bullets per section after enhancement and grouping.
- Groupings that happened (e.g. "folded 6 SchemaRenderer PRs into 2 bullets").
- Reclassifications (e.g. "moved 3 from Other → Features").
- Items dropped (count, with one example).
- Whether any breaking changes were found, and if their CHANGELOG.md entries and migration guides exist.
- Any open questions (missing migration guide, ambiguous item, unrecognized component).

Example:

> Drafted `.claude/release-notes/0.10.0-draft.md`. 8 Features (grouped from 14 raw), 12 Fixes (grouped from 19 raw), 4 Other. Folded 6 SchemaRenderer PRs into 2 bullets; folded 2 FabButton PRs into 1. Reclassified 2 items (Other → Features). Dropped 9 items (Tests section, CI tooling, github-actions dependabot bumps). No breaking changes detected. Open: `(radio) fix disabled state` has no PR number — left as-is with a note in editorial file.

## Safety rails

- **Never edit GitHub.** No `gh release edit`, no `gh release create`. Drafts only.
- **Never invent items.** Every kept bullet maps to a PR or a commit hash in the range.
- **Never silently drop a PR reference.** The bullet ends with the canonical `(#<PR>)` refs.
- **Don't promote cross-project issue numbers** into the draft — they confuse component library consumers.
- **Match the terseness of the predecessor's notes.**

## Maintenance

If you notice a pattern in the raw CI notes that this skill doesn't handle (a new CI section, a recurring rewrite the user keeps requesting, a new conventional-commit scope that misroutes items), surface it in your return summary and offer to update this `SKILL.md`. The user can confirm before any edit lands.
