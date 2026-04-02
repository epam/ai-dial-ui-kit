import { readFileSync } from 'node:fs';
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

function formatComponent(comp: ComponentEntry): string {
  const lines: string[] = [
    `# ${comp.name}`,
    `**Category:** ${comp.category}`,
    `**Source:** \`${comp.sourceFile}\``,
    '',
  ];

  if (comp.description) lines.push(comp.description, '');

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

function searchComponents(query: string): ComponentEntry[] {
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
        'Search for UI kit entities (components, hooks, utils, types, constants) by name or description. Returns a summary list of matches. For typography and theming, returns the full reference content regardless of query.\n\nExamples:\n  searchEntity("component", "button") → lists Button-related components\n  searchEntity("hook", "click") → lists hooks with "click" in name/description\n  searchEntity("typography") → returns full typography CSS class reference',
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
        'Get full documentation for a specific UI kit entity by exact name — props table, examples, signatures, type members, etc. For typography and theming, returns the full reference content (name not required).\n\nExamples:\n  getEntityDetails("component", "DialButton") → full props + examples\n  getEntityDetails("type", "ButtonSize") → enum values\n  getEntityDetails("hook", "useClickOutside") → signature + description\n  getEntityDetails("theming") → full CSS variable and token reference',
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
        ? `Found ${results.length} component(s) matching "${query}":`
        : `First ${results.length} components (pass a query to filter):`;
      return {
        content: [
          {
            type: 'text',
            text: [
              header,
              '',
              '| Name | Category | Description |',
              '|------|----------|-------------|',
              ...results.map(
                (c) => `| \`${c.name}\` | ${c.category} | ${c.description} |`,
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
                (t) => `| \`${t.name}\` | ${t.kind} | ${t.description ?? ''} |`,
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
            ...results.map((e) => `| \`${e.name}\` | ${e.description ?? ''} |`),
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
        throw new Error(
          `Component "${entityName}" not found. Use searchEntity(entity: "component") to browse available components.`,
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

  throw new Error(`Unknown tool: ${name}`);
});

// ─── connect ──────────────────────────────────────────────────────────────────

void (async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
