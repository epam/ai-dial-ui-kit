# MCP Server for @epam/ai-dial-ui-kit

An MCP (Model Context Protocol) server that gives AI agents fast, structured access to the UI kit's component library — shipped inside the npm package, zero extra setup.

## Why

Storybook documents components for humans. The MCP server documents them for AI agents. When an AI assistant needs to build a UI with your components, it can:

- **Discover all available components** — Button, Input, Dropdown, FileManager, Form, etc.
- **Land on the current generation** — 2.0 components rank first, and legacy 1.0 components point at their replacement
- **Read exact props and types** — required fields, defaults, enums, component-specific behaviors
- **Access code examples** — copy-paste usage patterns for common scenarios
- **Query theming & typography** — available design tokens, CSS classes, color variables

This lets agents generate accurate, type-safe, on-brand component code without guessing or hallucinating APIs.

## Quick Start

### 1. Install the peer dependency

```bash
npm install @modelcontextprotocol/sdk
```

### 2. Add to MCP configuration
Add the following code to mcp file servers root according to the tool you use:

```json
{
    "ai-dial-ui-kit": {
      "command": "node",
      "args": ["./node_modules/@epam/ai-dial-ui-kit/dist/mcp-server.cjs"]
    }
}
```

| Tool | MCP config location | Root field name |
|---|---|---|
| Claude Code CLI | `.mcp.json` | mcpServers |
| Cursor | `.cursor/mcp.json` | mcpServers |
| GitHub Copilot | `.vscode/mcp.json` | servers|

Example of the full config (for Claude Code)
```json
{
  "mcpServers": {
     "ai-dial-ui-kit": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/@epam/ai-dial-ui-kit/dist/mcp-server.cjs"]
    }
  }
}
```

### 3. Restart your AI agent

The MCP server is now available. Agents can discover and use components.

### 4. Add instruction to use the mcp

Place the following instruction in your instructions file (AGENTS.md, CLAUDE.md, or project-specific `.instructions.md`):

```markdown
## When working with @epam/ai-dial-ui-kit

When implementing or modifying components, forms, or UI built with `@epam/ai-dial-ui-kit`, the `ai-dial-ui-kit` MCP server enables you to discover components, read exact prop signatures, access code examples, and understand design tokens and available utilities.

## Component-First Development

**Always prefer UI kit components over raw HTML elements.** Before reaching for native `<button>`, `<input>`, `<select>`, or other HTML elements:

1. **Look for a UI kit component** — search the MCP server for one that fits the use case
2. **Use raw elements only as last resort** — If and only if no UI kit component meets the requirements, use native HTML (and document why)

## Generation 2.0 First

The kit ships two generations of components. **Generation 2.0 is the current design system — default to it.**

- 2.0 components are exported **without** the `Dial` prefix: `Button`, `Input`, `Select`, `Popup`.
- 1.0 components are the legacy `Dial*` set. Most have a 2.0 replacement.
- `searchEntity("component", …)` ranks 2.0 above 1.0 and reports a **Use instead** column; `getEntityDetails` states the generation and flags a superseded component.
- Reach for a 1.0 component **only** when it has no 2.0 replacement (nothing in **Use instead**) — e.g. `DialGrid`, `DialFileManager`, `DialTabs`.
- Do not mix generations for the same control in one screen.

## MCP Tools

Use these two tools for all UI kit discovery and documentation needs: `searchEntity(entity, query?)` and `getEntityDetails(entity, name?)`. If you need to look up **ANYTHING** about the ui kit, use the MCP server. **Never** use rg/ls commands for the ui kit module inspection.

> **Note:** Do not use `grep`, `glob`, `find`, or similar file system tools to discover components. The MCP tools provide accurate, structured metadata. File system searches miss examples, miss type information, and are slower.

## Breaking Changes & Migration

When you encounter type errors after a package upgrade, or when a prop no longer exists on a component:

1. Check `CHANGELOG.md` for a `### Breaking Changes` entry matching the new version.
2. Follow the linked migration guide in `migration-guides/<version>/`.
3. Use `getEntityDetails("component", "DialXxx")` to confirm the current prop signature before applying the fix.
```

## How It Works

### Tools

| Tool | Purpose |
|---|---|
| `searchEntity` | Search any entity category by name/description. Returns a summary list. |
| `getEntityDetails` | Fetch full documentation for a specific entity by exact name. |

Both tools accept an `entity` enum parameter:

| Value | Content |
|---|---|
| `component` | React components — props, examples, categories, generation. 2.0 components (no `Dial` prefix) rank first; 1.0 components report their 2.0 replacement |
| `hook` | React hooks and context providers — signatures, descriptions |
| `util` | Utility functions — signatures, descriptions |
| `type` | Exported TypeScript types, interfaces, and enums — members, values |
| `constant` | Exported constants — values, descriptions |
| `typography` | Full CSS utility class reference (`.dial-h1-text`, `.dial-small-text`, etc.) |
| `theming` | Full theme token system — CSS variable names, color tokens, Tailwind mapping |

## Example: Building a File Upload Form

```
User: "Build a file upload form with validation and error messages"

Agent:
  1. Calls searchEntity("component", "file upload")
  2. Finds DialFileInput, DialFormItem (1.0, no 2.0 replacement) and Notification (2.0)
  3. Calls getEntityDetails("component", "DialFileInput")  → props, examples
  4. Calls getEntityDetails("component", "DialFormItem")   → how to wire up validation
  5. Calls getEntityDetails("component", "Notification")   → error display
  6. Calls getEntityDetails("component", "Button")         → the 2.0 submit button
  7. Generates complete form code with types and error handling
```

## Example: Migrating After a Breaking Change

```
User: "After upgrading @epam/ai-dial-ui-kit the `menu` prop on DialDropdown no longer exists"

Agent:
  1. Reads CHANGELOG.md → finds Breaking Changes entry for the new version
  2. Follows link to migration-guides/<version>/dropdown-menu-prop-flatten.md
  3. Calls getEntityDetails("component", "DialDropdown") → confirms new flat prop names
  4. Applies the migration: menu={{ items }} → items={items}, etc.
```

## Distribution

The MCP server ships **inside `@epam/ai-dial-ui-kit`**:

- `dist/mcp-server.cjs` — compiled Node.js server
- `dist/components-manifest.json` — pre-built component metadata

`@modelcontextprotocol/sdk` is an **optional peer dependency** — not auto-installed. Users who want to use the MCP server install it explicitly.

## Architecture

The manifest is **generated at build time** by parsing `src/index.ts` (source of truth for public exports):

1. **Parse exports** — enumerate components, types, hooks, utils, constants. Named re-export barrels are followed to the declaring file
2. **Extract metadata** — for each export:
   - Props: from TypeScript interfaces + JSDoc `@param` tags
   - Description: from JSDoc first paragraph
   - Examples: from JSDoc `@example` fenced code blocks
   - Category: from paired `.stories.tsx` file's `title` field
   - Generation: `2.0` for anything under `src/components/New/`, or whose Storybook category is `Components_2_0` (that covers 2.0 components living outside that folder, e.g. `FabButton`, `Spinner`, `Skeleton`)
3. **Link generations** — a 1.0 `DialX` gets `supersededBy: "X"` when a 2.0 `X` exists; 2.0 entries are emitted first
4. **Build manifest** — write `dist/components-manifest.json`
5. **Compile server** — bundle `src/mcp/server.ts` → `dist/mcp-server.cjs`

### Adding a 2.0 component

Put it under `src/components/New/<Name>/`, export it from `src/index.ts` **without** the `Dial` prefix, and title its story `Components_2_0/<Name>`. Generation, ranking, and the `supersededBy` link on the 1.0 counterpart are then derived automatically — there is no list to maintain.

See [Manifest Schema](#manifest-schema) for details.

## Manifest Schema

```ts
interface Manifest {
  version: string;
  generatedAt: string;
  kit: {
    name: string;
    installation: string;        // "npm install @epam/ai-dial-ui-kit"
    cssImport: string;           // "import '@epam/ai-dial-ui-kit/styles.css'"
    peerDependencies: Record<string, string>;
    setupNotes: string;          // Next.js / Vite integration notes
  };
  styles: string;                // typography CSS class reference (markdown)
  theming: string;               // theming/token reference (markdown)
  components: ComponentEntry[];
  types: TypeEntry[];
  hooks: ExportEntry[];
  utils: ExportEntry[];
  constants: ExportEntry[];
}

interface ComponentEntry {
  name: string;                  // "DialButton"
  category: string;              // from stories title
  generation: '1.0' | '2.0';     // 2.0 = current design system, prefer it
  supersededBy?: string;         // on 1.0 only: the 2.0 replacement, e.g. "Button"
  description: string;           // first JSDoc paragraph
  props: {
    name: string;
    type: string;                // TypeScript type
    required: boolean;
    defaultValue?: string;
    description?: string;        // from JSDoc @param
  }[];
  examples: string[];            // TSX from JSDoc @example
  sourceFile: string;            // path in src/
  lazy?: {
    loaderExportName: string;    // "LazyDialJsonEditor"
    packageImport: string;       // "@epam/ai-dial-ui-kit"
    ssr: false;                  // intended for client-only dynamic imports
    nextDynamicExample: string;  // copyable Next.js dynamic() snippet
  };
}

interface TypeEntry {
  name: string;
  kind: 'enum' | 'interface' | 'type';
  description?: string;
  members?: { name: string; value: string; comment?: string }[];
  typeBody?: string;             // RHS for type aliases
  sourceFile: string;
}

interface ExportEntry {
  name: string;
  description?: string;          // from JSDoc
  signature?: string;            // type signature
  sourceFile: string;
}
```

## Troubleshooting

**MCP server won't start: "Cannot find module `@modelcontextprotocol/sdk`"**
- Install the peer dependency: `npm install @modelcontextprotocol/sdk`

**Manifest not generated or is stale**
- Ensure `npm run build:manifest` runs as part of the build
- When developing locally, run `npm run build:manifest` after modifying components

**Component doesn't appear in discoveries**
- Verify it's exported from `src/index.ts`
- Check that the component file has a JSDoc comment on the component declaration
- Run `npm run build:manifest` to regenerate
- **To improve discoverability**: add search aliases in the JSDoc description. For example, if the component is `DialFileInput`, add "FileUpload|FilePicker" to the description so agents can find it by those terms

**Props table is empty for a component**
- Component must define a `{ComponentName}Props` interface (e.g., `DialButtonProps`)
- Add JSDoc `@param` tags on the component declaration for descriptions

**Component reports the wrong generation, or an agent keeps picking the 1.0 one**
- A 2.0 component must either live under `src/components/New/` or carry a `Components_2_0/...` Storybook title — otherwise it is classified as 1.0
- The `supersededBy` link is derived from names: a 1.0 `DialX` links to a 2.0 `X`. If the 2.0 replacement is named differently, no link is produced
- Run `npm run build:manifest` and check the summary line — it reports how many components are generation 2.0

**Agents confuse similar components or pick the wrong one**
- Improve JSDoc descriptions to clearly distinguish purpose and use cases
- Example: for `DialInput` vs `DialTextarea`, explicitly describe when to use each (single-line vs multi-line, character limits, resize behavior, etc.)
- Add `@example` blocks showing common, realistic usage patterns that highlight the differences

## Files

```
src/mcp/
  README.md               ← this file
  types.ts                ← manifest schema types
  generate-manifest.ts    ← build-time manifest generator
  server.ts               ← MCP server entry point
```

## Build Scripts

```jsonc
// package.json:
"build:manifest": "tsx src/mcp/generate-manifest.ts",
"build:mcp":      "esbuild src/mcp/server.ts --bundle --platform=node --format=cjs --external:@modelcontextprotocol/sdk --outfile=dist/mcp-server.cjs",
"build":          "<existing> && npm run build:manifest && npm run build:mcp"
```
