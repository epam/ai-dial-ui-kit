# Group 8 (ai-dial-chat consumer validation) — blocked by a pre-existing, unrelated ai-dial-chat gap

## What was done

- Task 8.1: installed the final restructured tarball
  (`fixtures/.tarballs/epam-ai-dial-ui-kit-0.0.0.tgz`) in place of
  `@epam/ai-dial-ui-kit@^0.14.0-dev.15` in `ai-dial-chat`'s root
  `package.json`, and removed the
  `if (id.includes('@epam/ai-dial-ui-kit')) return 'ui-kit';` manual-chunk
  line from `apps/chat/vite.config.mts` (plus temporarily wired in
  `fixtures/shared/graph-report-plugin.mjs` to get static/dynamic chunk
  metadata for Task 8.3). Captured as
  `baseline/ai-dial-chat-temp.patch`. The saved patch is intentionally scoped
  to the two requested source/config changes only (`vite.config.mts` and
  `package.json`); it contains no unrelated worktree edits and passes
  `git apply --check`. Running `npm install --legacy-peer-deps` after applying
  it regenerates the temporary lockfile locally.
- Task 8.2: `npm exec nx build @epam/chat -- --skipNxCache` **failed**:

  ```
  Error: [vite]: Rolldown failed to resolve import "@floating-ui/react" from
  "C:/dial_projects/ai-dial-chat/node_modules/@epam/ai-dial-ui-kit/dist/components/Tooltip/TooltipTrigger.js".
  ```

## Root-cause isolation (A/B tested, not assumed)

`@floating-ui/react` is an `ai-dial-ui-kit` `peerDependency` (predates this
change) and is **not installed anywhere in `ai-dial-chat`**
(`node_modules/@floating-ui/` did not exist before this investigation).
Three builds were run to isolate which variable causes the failure:

| ui-kit version                       | manual `ui-kit` chunk         | Result                                                             |
| ------------------------------------ | ----------------------------- | ------------------------------------------------------------------ |
| old published `0.14.0-dev.15`        | present (today's real config) | **succeeds** (confirmed - this is production's actual daily state) |
| **new** restructured `0.0.0` tarball | removed                       | **fails** (`@floating-ui/react` unresolved)                        |
| **old** published `0.14.0-dev.15`    | removed                       | **fails identically** (same error, same module)                    |

The failure reproduces identically with the OLD, unmodified, currently-published
package - it has nothing to do with this change's `preserveModules`
restructuring. It is caused **solely** by removing the manual `ui-kit`
chunk, on top of a pre-existing gap in `ai-dial-chat`'s own dependency
declarations.

## Why Tasks 8.2/8.3 cannot be completed as scoped

Task 8.2's own manual-chunk-removal step cannot produce a passing build in
`ai-dial-chat`'s _current_ state, regardless of which `ai-dial-ui-kit`
version is installed. Fixing this would mean adding `@floating-ui/react`
as a real, permanent dependency to `ai-dial-chat` - a substantive,
non-reversible change to a different repository, which is out of scope for
a "temporary, reversible" consumer-validation probe (and out of scope for
an `ai-dial-ui-kit`-side change generally - see `design.md`'s Non-Goal:
"Deciding `ai-dial-chat`'s own manual-chunk strategy going forward").

This is not a regression this change introduced or needs to fix. It is,
however, useful negative evidence for whoever eventually removes
`ai-dial-chat`'s manual `ui-kit` chunk for real: budget for adding
`@floating-ui/react` (and re-auditing for any other ui-kit peer dependency
`ai-dial-chat` doesn't yet declare) as a prerequisite, independent of
`ai-dial-ui-kit`'s own packaging.

## Recovery note

Restoring `apps/chat/vite.config.mts` after this probe via `git apply -R`
against the stale saved patch initially reverted _all_ uncommitted changes
to that file - including unrelated, already-in-progress
`@epam/ai-dial-chat-hooks` subpath-aliasing work also present in that file
(a separate, concurrent change in that repo, unrelated to this one).
This was caught immediately (before doing anything further) and fully
recovered byte-exact via a dangling git blob
(`git hash-object` confirmed `f4bad114dcb38b7d6c87a575b824eb93a4508853`,
matching the diff observed before this investigation began: 64
insertions, 0 deletions vs. `HEAD`). Final state, verified via
`git diff --stat`: `apps/chat/vite.config.mts` and `package.json` show only
their pre-existing, unrelated diffs; `package-lock.json` is byte-identical
to `HEAD`; `node_modules/@epam/ai-dial-ui-kit` is confirmed reinstalled at
`0.14.0-dev.15`, matching both.
