import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type {
  Manifest,
  ComponentEntry,
  TypeEntry,
  ExportEntry,
} from './types.ts';

// ─── load manifest ────────────────────────────────────────────────────────────

// __dirname is injected by Node.js in CJS (esbuild --format=cjs --platform=node)
const manifest: Manifest = JSON.parse(
  readFileSync(join(__dirname, 'components-manifest.json'), 'utf-8'),
);

// ─── changelog & migration-guides ────────────────────────────────────────────

const changelogPath = join(__dirname, 'CHANGELOG.md');
const changelogRaw = existsSync(changelogPath)
  ? readFileSync(changelogPath, 'utf-8')
  : '';

const migrationGuidesDir = join(__dirname, 'migration-guides');

/**
 * Parse the CHANGELOG into a map of version → section text.
 * Sections are delimited by `## [x.y.z]` headings.
 */
function parseChangelog(content: string): Map<string, string> {
  const map = new Map<string, string>();
  const sectionRegex = /^## \[(\d+\.\d+\.\d+)\]/gm;
  const sections: { version: string; start: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({ version: match[1], start: match.index });
  }
  for (let i = 0; i < sections.length; i++) {
    const { version, start } = sections[i];
    const end =
      i + 1 < sections.length ? sections[i + 1].start : content.length;
    map.set(version, content.slice(start, end).trim());
  }
  return map;
}

const changelogSections = parseChangelog(changelogRaw);

function parseSemver(v: string): [number, number, number] {
  const p = v.split('.').map(Number);
  return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0];
}

/** Returns true when a > b */
function semverGt(a: string, b: string): boolean {
  const [a0, a1, a2] = parseSemver(a);
  const [b0, b1, b2] = parseSemver(b);
  if (a0 !== b0) return a0 > b0;
  if (a1 !== b1) return a1 > b1;
  return a2 > b2;
}

/**
 * Returns versions from `changelogSections` that fall in the range
 * (fromVersion, toVersion] — i.e. newer than `from` and at most `to`.
 */
function versionsInRange(from: string, to: string): string[] {
  return [...changelogSections.keys()].filter(
    (v) => semverGt(v, from) && !semverGt(v, to),
  );
}

/**
 * Read all migration-guide markdown files for the given versions.
 * Returns an array of { version, filename, content } objects.
 */
function readMigrationGuides(
  versions: string[],
): { version: string; filename: string; content: string }[] {
  const guides: { version: string; filename: string; content: string }[] = [];
  if (!existsSync(migrationGuidesDir)) return guides;

  for (const version of versions) {
    const vDir = join(migrationGuidesDir, version);
    if (!existsSync(vDir)) continue;
    const files = readdirSync(vDir).filter(
      (f) => f.endsWith('.md') && !f.startsWith('_'),
    );
    for (const file of files.sort()) {
      guides.push({
        version,
        filename: file,
        content: readFileSync(join(vDir, file), 'utf-8'),
      });
    }
  }
  return guides;
}

// ─── entity kinds ─────────────────────────────────────────────────────────────

type EntityKind =
  | 'component'
  | 'hook'
  | 'util'
  | 'type'
  | 'constant'
  | 'typography'
  | 'theming';

const ENTITY_KINDS: EntityKind[] = [
  'component',
  'hook',
  'util',
  'type',
  'constant',
  'typography',
  'theming',
];

const ENTITY_HINT = ENTITY_KINDS.join(' | ');

// ─── format helpers ───────────────────────────────────────────────────────────

/** Collapse a value into something safe to put in a markdown table cell. */
function cell(value: string): string {
  return value
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

const GENERATION_GUIDANCE =
  'Components come in two generations. Generation 2.0 is the current design system — prefer it. ' +
  'Reach for a 1.0 component only when it has no 2.0 equivalent (no `supersededBy` on the entry).';

function formatComponent(comp: ComponentEntry): string {
  const lines: string[] = [
    `# ${comp.name}`,
    `**Category:** ${comp.category}`,
    `**Generation:** ${comp.generation}`,
    `**Source:** \`${comp.sourceFile}\``,
    '',
  ];

  if (comp.supersededBy) {
    lines.push(
      `> ⚠️ **Generation 1.0 — superseded by \`${comp.supersededBy}\`.** ` +
        `Use \`${comp.supersededBy}\` for new code and prefer it when touching existing code; ` +
        `see getEntityDetails(entity: "component", name: "${comp.supersededBy}"). ` +
        `Only stay on \`${comp.name}\` if the 2.0 replacement is missing something you need.`,
      '',
    );
  }

  if (comp.description) lines.push(comp.description, '');

  if (comp.lazy) {
    lines.push('## Lazy Loading', '');
    lines.push(`- Loader export: \`${comp.lazy.loaderExportName}\``);
    lines.push(`- Package import: \`${comp.lazy.packageImport}\``);
    lines.push(`- SSR disabled: ${String(comp.lazy.ssr)}`);
    lines.push('');
    lines.push('### Next.js', '');
    lines.push('```tsx', comp.lazy.nextDynamicExample, '```', '');
  }

  if (comp.props.length > 0) {
    lines.push('## Props', '');
    lines.push('| Prop | Type | Required | Default | Description |');
    lines.push('|------|------|:--------:|---------|-------------|');
    for (const prop of comp.props) {
      const req = prop.required ? '✓' : '';
      const def = prop.defaultValue ? `\`${prop.defaultValue}\`` : '—';
      lines.push(
        `| \`${prop.name}\` | \`${prop.type}\` | ${req} | ${def} | ${prop.description ?? ''} |`,
      );
    }
    lines.push('');
  }

  if (comp.examples.length > 0) {
    lines.push('## Examples', '');
    for (const ex of comp.examples) lines.push('```tsx', ex, '```', '');
  }

  const refs = collectTypeRefs(comp);
  if (refs.length > 0) {
    lines.push('## Referenced Types', '');
    for (const r of refs)
      lines.push(
        `- \`${r}\` — use getEntityDetails(entity: "type", name: "${r}")`,
      );
    lines.push('');
  }

  return lines.join('\n');
}

function formatType(t: TypeEntry): string {
  const lines: string[] = [
    `# ${t.name}`,
    `**Kind:** ${t.kind}`,
    `**Source:** \`${t.sourceFile}\``,
    '',
  ];

  if (t.description) lines.push(t.description, '');

  if (t.kind === 'type' && t.typeBody) {
    lines.push('## Type', '', '```ts', t.typeBody, '```', '');
  }

  if (t.members && t.members.length > 0) {
    if (t.kind === 'enum') {
      lines.push('## Members', '');
      lines.push('| Name | Value | Description |');
      lines.push('|------|-------|-------------|');
      for (const m of t.members) {
        lines.push(`| \`${m.name}\` | \`${m.value}\` | ${m.comment ?? ''} |`);
      }
    } else {
      lines.push('## Fields', '');
      lines.push('| Field | Type |');
      lines.push('|-------|------|');
      for (const m of t.members) {
        lines.push(`| \`${m.name}\` | \`${m.value}\` |`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatExport(e: ExportEntry): string {
  const lines: string[] = [
    `# ${e.name}`,
    `**Source:** \`${e.sourceFile}\``,
    '',
  ];
  if (e.description) lines.push(e.description, '');
  if (e.signature)
    lines.push('## Signature', '', '```ts', e.signature, '```', '');
  return lines.join('\n');
}

function collectTypeRefs(comp: ComponentEntry): string[] {
  const known = new Set(manifest.types.map((t) => t.name));
  const refs = new Set<string>();
  for (const prop of comp.props) {
    for (const m of prop.type.matchAll(/\b([A-Z][A-Za-z0-9]+)\b/g)) {
      if (known.has(m[1])) refs.add(m[1]);
    }
  }
  return [...refs].sort();
}

// ─── search ───────────────────────────────────────────────────────────────────

/**
 * Score bonus that ranks a generation 2.0 component above its 1.0 counterpart.
 * Applied only to entries that already matched, so it never pulls an unrelated
 * 2.0 component into the results.
 */
const GENERATION_2_0_BONUS = 30;

function searchComponents(query: string): ComponentEntry[] {
  // The manifest is emitted 2.0-first, so an unranked slice already prefers it.
  if (!query.trim()) return manifest.components.slice(0, 20);
  const q = query.toLowerCase();
  return manifest.components
    .map((c) => {
      let score = 0;
      const name = c.name.toLowerCase();
      const desc = c.description.toLowerCase();
      const cat = c.category.toLowerCase();
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (name.includes(q)) score = 60;
      if (desc.includes(q)) score += 20;
      if (cat.includes(q)) score += 10;
      if (score > 0 && c.generation === '2.0') score += GENERATION_2_0_BONUS;
      return { c, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.c);
}

function searchExports(pool: ExportEntry[], query: string): ExportEntry[] {
  if (!query.trim()) return pool.slice(0, 20);
  const q = query.toLowerCase();
  return pool
    .map((e) => {
      let score = 0;
      const name = e.name.toLowerCase();
      const desc = (e.description ?? '').toLowerCase();
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (name.includes(q)) score = 60;
      if (desc.includes(q)) score += 20;
      return { e, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.e);
}

function searchTypes(query: string): TypeEntry[] {
  if (!query.trim()) return manifest.types.slice(0, 20);
  const q = query.toLowerCase();
  return manifest.types
    .map((t) => {
      let score = 0;
      const name = t.name.toLowerCase();
      const desc = (t.description ?? '').toLowerCase();
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (name.includes(q)) score = 60;
      if (desc.includes(q)) score += 20;
      return { t, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.t);
}

// ─── server ───────────────────────────────────────────────────────────────────

const server = new Server(
  { name: manifest.kit.name, version: manifest.version },
  { capabilities: { tools: {} } },
);

// ─── tools ────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'searchEntity',
      description:
        'Search for UI kit entities (components, hooks, utils, types, constants) by name or description. Returns a summary list of matches. For typography and theming, returns the full reference content regardless of query.\n\nComponents come in two generations and results are ranked 2.0 first. Generation 2.0 is the current design system (exported without the `Dial` prefix — `Button`, `Input`, `Select`); generation 1.0 is the legacy set (`Dial*`). Default to the 2.0 component. A 1.0 result carries "Use instead" when a 2.0 replacement exists — pick that replacement. Only use a 1.0 component when it has no replacement listed.\n\nExamples:\n  searchEntity("component", "button") → Button (2.0) ranked above DialButton (1.0)\n  searchEntity("hook", "click") → lists hooks with "click" in name/description\n  searchEntity("typography") → returns full typography CSS class reference',
      inputSchema: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            enum: ENTITY_KINDS,
            description: 'The entity category to search in.',
            argumentHint: ENTITY_HINT,
          },
          query: {
            type: 'string',
            description:
              'Literal substring to match against name and description. Empty or omitted returns the first 20 results.',
          },
        },
        required: ['entity'],
      },
    },
    {
      name: 'getEntityDetails',
      description:
        'Get full documentation for a specific UI kit entity by exact name — props table, examples, signatures, type members, etc. For typography and theming, returns the full reference content (name not required).\n\nA component response states its generation. If it reports being superseded by a 2.0 component, look that one up instead of using the 1.0 entry.\n\nExamples:\n  getEntityDetails("component", "Button") → full props + examples for the 2.0 button\n  getEntityDetails("component", "DialButton") → 1.0 button, flagged as superseded by `Button`\n  getEntityDetails("type", "ButtonSize") → enum values\n  getEntityDetails("hook", "useClickOutside") → signature + description\n  getEntityDetails("theming") → full CSS variable and token reference',
      inputSchema: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            enum: ENTITY_KINDS,
            description: 'The entity category.',
            argumentHint: ENTITY_HINT,
          },
          name: {
            type: 'string',
            description:
              'Exact entity name (e.g. "DialButton", "useClickOutside", "ButtonSize"). Not required for typography and theming.',
          },
        },
        required: ['entity'],
      },
    },
    {
      name: 'getMigrationGuides',
      description:
        'Returns the CHANGELOG entries and step-by-step migration guides for all breaking changes introduced between two versions of @epam/ai-dial-ui-kit.\n\nPass the version you are currently on as `fromVersion` and the version you are upgrading to as `toVersion`. The tool returns the changelog section for each intermediate release plus the full text of every migration guide that applies.\n\nExamples:\n  getMigrationGuides("0.9.0", "0.10.0") → changelog + guides for 0.10.0\n  getMigrationGuides("0.8.0", "0.10.0") → changelog + guides for 0.9.0 and 0.10.0',
      inputSchema: {
        type: 'object',
        properties: {
          fromVersion: {
            type: 'string',
            description:
              'The version you are upgrading FROM (exclusive), e.g. "0.9.0".',
          },
          toVersion: {
            type: 'string',
            description:
              'The version you are upgrading TO (inclusive), e.g. "0.10.0".',
          },
        },
        required: ['fromVersion', 'toVersion'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;
  const entity = a.entity as EntityKind;

  if (!ENTITY_KINDS.includes(entity)) {
    throw new Error(
      `Unknown entity kind: "${entity}". Must be one of: ${ENTITY_HINT}`,
    );
  }

  // ── searchEntity ──────────────────────────────────────────────────────────

  if (name === 'searchEntity') {
    const query = typeof a.query === 'string' ? a.query : '';

    if (entity === 'typography') {
      return { content: [{ type: 'text', text: manifest.styles }] };
    }

    if (entity === 'theming') {
      return { content: [{ type: 'text', text: manifest.theming }] };
    }

    if (entity === 'component') {
      const results = searchComponents(query);
      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No components found matching "${query}". Try a shorter or more literal token.`,
            },
          ],
        };
      }
      const header = query
        ? `Found ${results.length} component(s) matching "${query}", best match first:`
        : `First ${results.length} components, generation 2.0 first (pass a query to filter):`;
      return {
        content: [
          {
            type: 'text',
            text: [
              header,
              '',
              GENERATION_GUIDANCE,
              '',
              '| Name | Gen | Use instead | Category | Description |',
              '|------|-----|-------------|----------|-------------|',
              ...results.map(
                (c) =>
                  `| \`${c.name}\` | ${c.generation} | ` +
                  `${c.supersededBy ? `\`${c.supersededBy}\`` : '—'} | ` +
                  `${cell(c.category)} | ${cell(c.description)} |`,
              ),
              '',
              'Use getEntityDetails(entity: "component", name: "...") for full props and examples.',
            ].join('\n'),
          },
        ],
      };
    }

    if (entity === 'type') {
      const results = searchTypes(query);
      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No types found matching "${query}". Try a shorter token.`,
            },
          ],
        };
      }
      const header = query
        ? `Found ${results.length} type(s) matching "${query}":`
        : `First ${results.length} types (pass a query to filter):`;
      return {
        content: [
          {
            type: 'text',
            text: [
              header,
              '',
              '| Name | Kind | Description |',
              '|------|------|-------------|',
              ...results.map(
                (t) =>
                  `| \`${t.name}\` | ${t.kind} | ${cell(t.description ?? '')} |`,
              ),
              '',
              'Use getEntityDetails(entity: "type", name: "...") for members and values.',
            ].join('\n'),
          },
        ],
      };
    }

    // hook | util | constant
    const pool =
      entity === 'hook'
        ? manifest.hooks
        : entity === 'util'
          ? manifest.utils
          : manifest.constants;
    const results = searchExports(pool, query);
    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No ${entity}s found matching "${query}". Try a shorter token.`,
          },
        ],
      };
    }
    const header = query
      ? `Found ${results.length} ${entity}(s) matching "${query}":`
      : `First ${results.length} ${entity}s (pass a query to filter):`;
    return {
      content: [
        {
          type: 'text',
          text: [
            header,
            '',
            '| Name | Description |',
            '|------|-------------|',
            ...results.map(
              (e) => `| \`${e.name}\` | ${cell(e.description ?? '')} |`,
            ),
            '',
            `Use getEntityDetails(entity: "${entity}", name: "...") for full signature.`,
          ].join('\n'),
        },
      ],
    };
  }

  // ── getEntityDetails ──────────────────────────────────────────────────────

  if (name === 'getEntityDetails') {
    if (entity === 'typography') {
      return { content: [{ type: 'text', text: manifest.styles }] };
    }

    if (entity === 'theming') {
      return { content: [{ type: 'text', text: manifest.theming }] };
    }

    const entityName = typeof a.name === 'string' ? a.name.trim() : '';
    if (!entityName) {
      throw new Error(`"name" is required for entity kind "${entity}"`);
    }

    if (entity === 'component') {
      const comp = manifest.components.find((c) => c.name === entityName);
      if (!comp) {
        // The `Dial` prefix is dropped in generation 2.0, so a miss is often
        // just the other generation's spelling of the same component.
        const alt = manifest.components.find(
          (c) =>
            c.name === `Dial${entityName}` ||
            c.name === entityName.replace(/^Dial/, ''),
        );
        throw new Error(
          `Component "${entityName}" not found.${
            alt
              ? ` Did you mean "${alt.name}" (generation ${alt.generation})?`
              : ''
          } Use searchEntity(entity: "component") to browse available components.`,
        );
      }
      return { content: [{ type: 'text', text: formatComponent(comp) }] };
    }

    if (entity === 'type') {
      const t = manifest.types.find((t) => t.name === entityName);
      if (!t) {
        throw new Error(
          `Type "${entityName}" not found. Use searchEntity(entity: "type") to browse available types.`,
        );
      }
      return { content: [{ type: 'text', text: formatType(t) }] };
    }

    // hook | util | constant
    const pool =
      entity === 'hook'
        ? manifest.hooks
        : entity === 'util'
          ? manifest.utils
          : manifest.constants;
    const entry = pool.find((e) => e.name === entityName);
    if (!entry) {
      throw new Error(
        `${entity.charAt(0).toUpperCase() + entity.slice(1)} "${entityName}" not found. Use searchEntity(entity: "${entity}") to browse available ${entity}s.`,
      );
    }
    return { content: [{ type: 'text', text: formatExport(entry) }] };
  }

  // ── getMigrationGuides ────────────────────────────────────────────────────

  if (name === 'getMigrationGuides') {
    const fromVersion =
      typeof a.fromVersion === 'string' ? a.fromVersion.trim() : '';
    const toVersion = typeof a.toVersion === 'string' ? a.toVersion.trim() : '';

    if (!fromVersion || !toVersion) {
      throw new Error('"fromVersion" and "toVersion" are required.');
    }

    const versions = versionsInRange(fromVersion, toVersion).sort((a, b) =>
      semverGt(a, b) ? 1 : -1,
    );

    if (versions.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No changelog entries found for versions between ${fromVersion} (exclusive) and ${toVersion} (inclusive). Either this range is already up to date or the versions are unknown.`,
          },
        ],
      };
    }

    const sections: string[] = [];

    for (const version of versions) {
      const changelogSection = changelogSections.get(version);
      if (changelogSection) sections.push(changelogSection);

      const guides = readMigrationGuides([version]);
      for (const guide of guides) {
        sections.push(
          `---\n\n<!-- Migration guide: ${guide.version}/${guide.filename} -->\n\n${guide.content}`,
        );
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: sections.join('\n\n'),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// ─── connect ──────────────────────────────────────────────────────────────────

void (async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
