/* eslint-disable no-console */
import * as ts from 'typescript';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
  statSync,
} from 'fs';
import { resolve, join, dirname, relative, extname } from 'path';
import type {
  Manifest,
  ComponentEntry,
  ComponentGeneration,
  TypeEntry,
  ExportEntry,
  PropEntry,
  TypeMember,
  KitInfo,
  LazyComponentEntry,
} from './types.ts';

// ─── constants ────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const INDEX_PATH = join(SRC, 'index.ts');

/** Every component below this path belongs to generation 2.0. */
const GENERATION_2_0_DIR = 'components/New/';
/** Storybook category that marks a 2.0 component living outside that path. */
const GENERATION_2_0_CATEGORY = /^components[_ ]?2[._]0/i;
const COMPONENTS_DIR = 'components/';
const DIAL_PREFIX = 'Dial';

// ─── AST helpers ──────────────────────────────────────────────────────────────

interface WithJSDoc {
  jsDoc?: ts.JSDoc[];
}

function getJsDocs(node: ts.Node): ts.JSDoc[] {
  return (node as unknown as WithJSDoc).jsDoc ?? [];
}

function jsDocText(comment: ts.JSDoc['comment']): string {
  if (comment === undefined) return '';
  if (typeof comment === 'string') return comment;
  interface HasText {
    text?: string;
  }
  return Array.from(comment)
    .map((c) => (c as HasText).text ?? '')
    .join('');
}

interface JSDocInfo {
  description: string;
  examples: string[];
  params: Map<string, string>;
}

function extractJsDocInfo(node: ts.Node, sf: ts.SourceFile): JSDocInfo {
  const jsDocs = getJsDocs(node);
  let description = '';
  const examples: string[] = [];
  const params = new Map<string, string>();

  for (const jsDoc of jsDocs) {
    if (!description) {
      description = jsDocText(jsDoc.comment).trim();
    }

    for (const tag of jsDoc.tags ?? []) {
      if (tag.tagName.text === 'example') {
        const raw = jsDocText(tag.comment);
        const codeRe = /```(?:tsx|ts|jsx|js)?\n?([\s\S]*?)```/g;
        let m: RegExpExecArray | null;
        let found = false;
        while ((m = codeRe.exec(raw)) !== null) {
          examples.push(m[1].trim());
          found = true;
        }
        if (!found && raw.trim()) {
          examples.push(raw.trim());
        }
      }

      if (ts.isJSDocParameterTag(tag)) {
        const paramName = ts.isIdentifier(tag.name)
          ? tag.name.text
          : tag.name.getText(sf);
        const paramDesc = jsDocText(tag.comment).replace(/^-\s*/, '').trim();
        if (paramDesc) params.set(paramName, paramDesc);
      }
    }
  }

  return { description, examples, params };
}

// ─── file helpers ─────────────────────────────────────────────────────────────

// Files are parsed repeatedly (barrel resolution, then metadata extraction), so
// keep the ASTs for the lifetime of this one-shot build.
const sourceFileCache = new Map<string, ts.SourceFile>();

function readSf(filePath: string): ts.SourceFile {
  const cached = sourceFileCache.get(filePath);
  if (cached) return cached;
  const content = readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.ES2022,
    true,
  );
  sourceFileCache.set(filePath, sf);
  return sf;
}

function resolveModulePath(spec: string, fromDir: string): string | null {
  // `@/*` maps to `src/*` (tsconfig paths)
  const base = spec.startsWith('@/')
    ? resolve(SRC, spec.slice('@/'.length))
    : resolve(fromDir, spec);

  // Direct hit (spec already has extension). A directory is not a hit — it must
  // fall through to the `index` lookup below, or reading it throws EISDIR.
  if (existsSync(base) && !statSync(base).isDirectory()) return base;

  // Try common extensions
  for (const ext of ['.tsx', '.ts', '.jsx', '.js']) {
    const p = base + ext;
    if (existsSync(p)) return p;
  }

  // Try index files
  for (const ext of ['.tsx', '.ts', '.js']) {
    const p = join(base, `index${ext}`);
    if (existsSync(p)) return p;
  }

  return null;
}

function relSrc(absPath: string): string {
  return relative(SRC, absPath).replace(/\\/g, '/');
}

/** How many `export { X } from './y'` hops to follow before giving up. */
const MAX_REEXPORT_DEPTH = 3;

function declaresName(sf: ts.SourceFile, name: string): boolean {
  let found = false;

  ts.forEachChild(sf, (node) => {
    if (found) return;
    if (ts.isVariableStatement(node)) {
      found = node.declarationList.declarations.some(
        (d) => ts.isIdentifier(d.name) && d.name.text === name,
      );
    } else if (
      (ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      found = node.name.text === name;
    }
  });

  return found;
}

/**
 * Follow named re-export barrels (`export { X } from './y'`) to the file that
 * actually declares `X` — `src/index.ts` reaches some components, such as the
 * Analytics set, only through one. Returns `filePath` unchanged when there is
 * nothing to follow. `export *` barrels are not traversed; none are on the
 * public export path today.
 */
function resolveDeclaringFile(
  name: string,
  filePath: string,
  depth = 0,
): string {
  if (depth >= MAX_REEXPORT_DEPTH) return filePath;

  const sf = readSf(filePath);
  if (declaresName(sf, name)) return filePath;

  let next: string | null = null;
  const dir = dirname(filePath);

  ts.forEachChild(sf, (node) => {
    if (next) return;
    if (!ts.isExportDeclaration(node)) return;
    if (!node.moduleSpecifier || !node.exportClause) return;
    if (!ts.isNamedExports(node.exportClause)) return;
    const reExports = node.exportClause.elements.some(
      (el) => el.name.text === name,
    );
    if (!reExports) return;
    next = resolveModulePath(
      (node.moduleSpecifier as ts.StringLiteral).text,
      dir,
    );
  });

  return next ? resolveDeclaringFile(name, next, depth + 1) : filePath;
}

// ─── index.ts parsing ─────────────────────────────────────────────────────────

interface IndexExport {
  name: string;
  isTypeOnly: boolean;
  resolvedPath: string;
  section: string;
  lazyLoaderName?: string;
}

interface LazyExportDescriptor {
  loaderExportName: string;
  componentName: string;
}

function buildSectionMap(content: string): string[] {
  const lines = content.split('\n');
  const sections: string[] = [];
  let current = 'component';

  for (const line of lines) {
    const m = line.trim().match(/^\/\/\s*(.+)$/);
    if (m) {
      const s = m[1].toLowerCase();
      if (s.includes('constant')) current = 'constants';
      else if (s.includes('util')) current = 'utils';
      else if (
        s.includes('model') &&
        !s.includes('file') &&
        !s.includes('component')
      )
        current = 'models';
      else if (s.includes('type') && !s.includes('file')) current = 'types';
      else if (
        s.includes('hook') ||
        s.includes('context') ||
        s.includes('provider')
      )
        current = 'hooks';
      else current = 'component';
    }
    sections.push(current);
  }

  return sections;
}

function parseIndexFile(): IndexExport[] {
  const content = readFileSync(INDEX_PATH, 'utf-8');
  const sf = readSf(INDEX_PATH);
  const indexDir = dirname(INDEX_PATH);
  const sectionByLine = buildSectionMap(content);
  const records: IndexExport[] = [];

  ts.forEachChild(sf, (node) => {
    if (ts.isExportDeclaration(node)) {
      if (!node.moduleSpecifier || !node.exportClause) return;
      if (!ts.isNamedExports(node.exportClause)) return;

      const moduleSpec = (node.moduleSpecifier as ts.StringLiteral).text;
      const resolvedPath = resolveModulePath(moduleSpec, indexDir);
      if (!resolvedPath) {
        console.warn(`Could not resolve: ${moduleSpec}`);
        return;
      }

      const startLine = sf.getLineAndCharacterOfPosition(
        node.getStart(sf),
      ).line;
      const section = sectionByLine[startLine] ?? 'component';

      for (const element of node.exportClause.elements) {
        const isTypeOnly = node.isTypeOnly || element.isTypeOnly;
        const name = element.name.text;
        // `export { Local as Public }` — barrels re-export the local name
        const localName = element.propertyName?.text ?? name;
        records.push({
          name,
          isTypeOnly,
          resolvedPath: resolveDeclaringFile(localName, resolvedPath),
          section,
        });
      }
      return;
    }

    // Lazy component loader: `export const LazyDialX = () => import('./path')`
    if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (!hasExport) return;

      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) continue;
        const varName = decl.name.text;
        if (!varName.startsWith('Lazy')) continue;

        const init = decl.initializer;
        if (!init || !ts.isArrowFunction(init)) continue;

        // Find an `import('...')` call inside the arrow body
        const moduleSpec = findDynamicImportSpec(init.body);
        if (!moduleSpec) continue;

        const resolvedPath = resolveModulePath(moduleSpec, indexDir);
        if (!resolvedPath) {
          console.warn(`Could not resolve lazy import: ${moduleSpec}`);
          continue;
        }

        // Strip `Lazy` prefix to match the underlying component declaration
        const underlyingName = varName.slice('Lazy'.length);
        const startLine = sf.getLineAndCharacterOfPosition(
          node.getStart(sf),
        ).line;
        const section = sectionByLine[startLine] ?? 'component';

        records.push({
          name: underlyingName,
          isTypeOnly: false,
          resolvedPath,
          section,
          lazyLoaderName: varName,
        });
      }
    }
  });

  return records;
}

// Locate a dynamic `import('module')` call within an arrow function body.
function findDynamicImportSpec(body: ts.ConciseBody): string | null {
  let expr: ts.Expression | undefined;
  if (ts.isBlock(body)) {
    for (const stmt of body.statements) {
      if (ts.isReturnStatement(stmt) && stmt.expression) {
        expr = stmt.expression;
        break;
      }
    }
  } else {
    expr = body;
  }
  if (!expr) return null;

  // Unwrap potential `.then(...)` chains: import('x').then(m => m.default)
  while (
    ts.isCallExpression(expr) &&
    ts.isPropertyAccessExpression(expr.expression)
  ) {
    expr = expr.expression.expression;
  }

  if (
    ts.isCallExpression(expr) &&
    expr.expression.kind === ts.SyntaxKind.ImportKeyword &&
    expr.arguments.length > 0 &&
    ts.isStringLiteralLike(expr.arguments[0])
  ) {
    return (expr.arguments[0] as ts.StringLiteralLike).text;
  }
  return null;
}

// ─── component extraction ─────────────────────────────────────────────────────

function extractDestructuringDefaults(
  sf: ts.SourceFile,
  componentName: string,
): Map<string, string> {
  const defaults = new Map<string, string>();

  ts.forEachChild(sf, (node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== componentName)
        continue;
      const init = decl.initializer;
      if (!init || !ts.isArrowFunction(init)) continue;
      const param = init.parameters[0];
      if (!param || !ts.isObjectBindingPattern(param.name)) continue;
      for (const element of param.name.elements) {
        if (!element.initializer) continue;
        const elemName = ts.isIdentifier(element.name)
          ? element.name.text
          : element.name.getText(sf);
        defaults.set(elemName, element.initializer.getText(sf));
      }
    }
  });

  return defaults;
}

function extractProps(
  sf: ts.SourceFile,
  interfaceName: string,
  paramDescs: Map<string, string>,
  defaults: Map<string, string>,
): PropEntry[] {
  const props: PropEntry[] = [];

  ts.forEachChild(sf, (node) => {
    if (!ts.isInterfaceDeclaration(node) || node.name.text !== interfaceName)
      return;

    for (const member of node.members) {
      if (!ts.isPropertySignature(member) || !member.name) continue;
      const name = ts.isIdentifier(member.name)
        ? member.name.text
        : member.name.getText(sf);
      const type = member.type?.getText(sf) ?? 'unknown';
      const required = !member.questionToken;
      const defaultValue = defaults.get(name);
      const description = paramDescs.get(name);

      const entry: PropEntry = { name, type, required };
      if (defaultValue !== undefined) entry.defaultValue = defaultValue;
      if (description !== undefined) entry.description = description;
      props.push(entry);
    }
  });

  return props;
}

function getStoryCategory(sourceFilePath: string): string {
  const dir = dirname(sourceFilePath);

  let storyFile: string | undefined;
  try {
    storyFile = readdirSync(dir).find(
      (f) => f.endsWith('.stories.tsx') || f.endsWith('.stories.ts'),
    );
  } catch {
    // no-op
  }

  if (!storyFile) {
    // Fallback: use parent folder name
    const parts = dir.replace(/\\/g, '/').split('/');
    const idx = parts.lastIndexOf('components');
    return idx >= 0 && idx + 1 < parts.length ? parts[idx + 1] : 'Other';
  }

  const storyContent = readFileSync(join(dir, storyFile), 'utf-8');
  const titleMatch = storyContent.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  if (!titleMatch) return 'Other';

  const parts = titleMatch[1].split('/');
  // Strip leading 'DIAL' and trailing component name → keep middle categories
  const start = parts[0].toUpperCase() === 'DIAL' ? 1 : 0;
  const middle = parts.slice(start, -1);
  return middle.length > 0 ? middle.join('/') : (parts[start] ?? 'Other');
}

function buildLazyComponentEntry(
  descriptor: LazyExportDescriptor,
): LazyComponentEntry {
  return {
    loaderExportName: descriptor.loaderExportName,
    packageImport: '@epam/ai-dial-ui-kit',
    ssr: false,
    nextDynamicExample: [
      "import dynamic from 'next/dynamic';",
      `import { ${descriptor.loaderExportName} } from '@epam/ai-dial-ui-kit';`,
      '',
      `const ${descriptor.componentName} = dynamic(`,
      `  async () => (await ${descriptor.loaderExportName}()).${descriptor.componentName},`,
      '  { ssr: false },',
      ');',
    ].join('\n'),
  };
}

function appendLazyDescriptionNote(
  description: string,
  loaderExportName: string,
): string {
  const lazyNote = [
    'Lazy-loaded component.',
    'This component is not exported directly from the UI kit to avoid errors when using with SSR.',
    `Use \`${loaderExportName}\` and the manifest \`lazy\` field for dynamic import guidance.`,
  ].join(' ');

  return description ? `${description}\n\n${lazyNote}` : lazyNote;
}

/**
 * Whether an export from the `component` section of `index.ts` should be
 * documented as a component. The `Dial` prefix is being dropped as components
 * move to generation 2.0, so the prefix alone can no longer decide this —
 * anything that is a PascalCase export out of `src/components/` qualifies.
 * Enums and types that happen to live there are filtered out downstream, when
 * `buildComponentEntry` finds no component declaration and returns `null`.
 */
function isComponentExport(rec: IndexExport): boolean {
  if (rec.name.startsWith(DIAL_PREFIX)) return true;
  if (!relSrc(rec.resolvedPath).startsWith(COMPONENTS_DIR)) return false;
  return /^[A-Z][A-Za-z0-9]*$/.test(rec.name);
}

/**
 * Generation 2.0 components mostly live under `components/New/`, but a few
 * (`FabButton`, `Spinner`, `Skeleton`) sit next to the 1.0 set and declare
 * themselves through their Storybook category instead.
 */
function resolveGeneration(
  rec: IndexExport,
  category: string,
): ComponentGeneration {
  if (relSrc(rec.resolvedPath).startsWith(GENERATION_2_0_DIR)) return '2.0';
  return GENERATION_2_0_CATEGORY.test(category) ? '2.0' : '1.0';
}

/**
 * Link each 1.0 component to its 2.0 replacement, matching `DialX` → `X`.
 * Mutates the entries in place.
 */
function linkSupersededComponents(components: ComponentEntry[]): void {
  const names2_0 = new Set(
    components.filter((c) => c.generation === '2.0').map((c) => c.name),
  );

  for (const comp of components) {
    if (comp.generation !== '1.0') continue;
    if (!comp.name.startsWith(DIAL_PREFIX)) continue;
    const replacement = comp.name.slice(DIAL_PREFIX.length);
    if (names2_0.has(replacement)) comp.supersededBy = replacement;
  }
}

function buildComponentEntry(rec: IndexExport): ComponentEntry | null {
  const sf = readSf(rec.resolvedPath);
  let description = '';
  let examples: string[] = [];
  let paramDescs = new Map<string, string>();
  let found = false;

  ts.forEachChild(sf, (node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== rec.name) continue;
      found = true;
      const info = extractJsDocInfo(node, sf);
      description = info.description;
      examples = info.examples;
      paramDescs = info.params;
    }
  });

  // Fallback: function declaration (some wrapper components)
  if (!found) {
    ts.forEachChild(sf, (node) => {
      if (!ts.isFunctionDeclaration(node) || node.name?.text !== rec.name)
        return;
      found = true;
      const info = extractJsDocInfo(node, sf);
      description = info.description;
      examples = info.examples;
      paramDescs = info.params;
    });
  }

  if (!found) return null;

  const defaults = extractDestructuringDefaults(sf, rec.name);
  const propsInterfaceName = `${rec.name}Props`;
  const props = extractProps(sf, propsInterfaceName, paramDescs, defaults);
  const category = getStoryCategory(rec.resolvedPath);
  const finalDescription = rec.lazyLoaderName
    ? appendLazyDescriptionNote(description, rec.lazyLoaderName)
    : description;

  const entry: ComponentEntry = {
    name: rec.name,
    category,
    generation: resolveGeneration(rec, category),
    description: finalDescription,
    props,
    examples,
    sourceFile: relSrc(rec.resolvedPath),
  };

  if (rec.lazyLoaderName) {
    entry.lazy = buildLazyComponentEntry({
      loaderExportName: rec.lazyLoaderName,
      componentName: rec.name,
    });
  }

  return entry;
}

// ─── type extraction ──────────────────────────────────────────────────────────

function buildTypeEntry(rec: IndexExport): TypeEntry | null {
  const sf = readSf(rec.resolvedPath);
  let result: TypeEntry | null = null;

  ts.forEachChild(sf, (node) => {
    if (result) return;

    if (ts.isEnumDeclaration(node) && node.name.text === rec.name) {
      const { description } = extractJsDocInfo(node, sf);
      const members: TypeMember[] = node.members.map((member) => {
        const name = ts.isIdentifier(member.name)
          ? member.name.text
          : member.name.getText(sf);
        const value = member.initializer?.getText(sf) ?? '';
        const { description: comment } = extractJsDocInfo(member, sf);
        const entry: TypeMember = { name, value };
        if (comment) entry.comment = comment;
        return entry;
      });

      result = {
        name: rec.name,
        kind: 'enum',
        members,
        sourceFile: relSrc(rec.resolvedPath),
      };
      if (description) result.description = description;
    } else if (ts.isInterfaceDeclaration(node) && node.name.text === rec.name) {
      const { description } = extractJsDocInfo(node, sf);
      const members: TypeMember[] = [];

      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || !member.name) continue;
        const name = ts.isIdentifier(member.name)
          ? member.name.text
          : member.name.getText(sf);
        const opt = member.questionToken ? '?' : '';
        const type = member.type?.getText(sf) ?? 'unknown';
        members.push({ name: `${name}${opt}`, value: type });
      }

      result = {
        name: rec.name,
        kind: 'interface',
        members,
        sourceFile: relSrc(rec.resolvedPath),
      };
      if (description) result.description = description;
    } else if (ts.isTypeAliasDeclaration(node) && node.name.text === rec.name) {
      const { description } = extractJsDocInfo(node, sf);
      result = {
        name: rec.name,
        kind: 'type',
        sourceFile: relSrc(rec.resolvedPath),
      };
      if (description) result.description = description;
      if (node.type) result.typeBody = node.type.getText(sf);
    }
  });

  return result;
}

// ─── export entry extraction ──────────────────────────────────────────────────

function buildExportEntry(rec: IndexExport): ExportEntry {
  const sf = readSf(rec.resolvedPath);
  let description = '';
  let signature = '';

  ts.forEachChild(sf, (node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || decl.name.text !== rec.name)
          continue;
        const info = extractJsDocInfo(node, sf);
        description = info.description;

        if (decl.type) {
          signature = `${rec.name}: ${decl.type.getText(sf)}`;
        } else if (decl.initializer) {
          const init = decl.initializer;
          if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
            const params = init.parameters.map((p) => p.getText(sf)).join(', ');
            const ret = init.type?.getText(sf) ?? 'unknown';
            signature = `(${params}) => ${ret}`;
          } else {
            signature = `${rec.name} = ${init.getText(sf)}`;
          }
        }
      }
    } else if (ts.isFunctionDeclaration(node) && node.name?.text === rec.name) {
      const info = extractJsDocInfo(node, sf);
      description = info.description;
      const params = node.parameters.map((p) => p.getText(sf)).join(', ');
      const ret = node.type?.getText(sf) ?? 'void';
      signature = `function ${rec.name}(${params}): ${ret}`;
    } else if (ts.isEnumDeclaration(node) && node.name.text === rec.name) {
      const info = extractJsDocInfo(node, sf);
      description = info.description;
      const members = node.members
        .map((m) => {
          const mName = ts.isIdentifier(m.name)
            ? m.name.text
            : m.name.getText(sf);
          const mVal = m.initializer ? ` = ${m.initializer.getText(sf)}` : '';
          return `${mName}${mVal}`;
        })
        .join(', ');
      signature = `enum ${rec.name} { ${members} }`;
    }
  });

  const entry: ExportEntry = {
    name: rec.name,
    sourceFile: relSrc(rec.resolvedPath),
  };
  if (description) entry.description = description;
  if (signature) entry.signature = signature;
  return entry;
}

// ─── kit info ─────────────────────────────────────────────────────────────────

function buildKitInfo(): KitInfo {
  interface PkgJson {
    name: string;
    version: string;
    description: string;
    peerDependencies: Record<string, string>;
  }
  const pkg = JSON.parse(
    readFileSync(join(ROOT, 'package.json'), 'utf-8'),
  ) as PkgJson;

  const readme = readFileSync(join(ROOT, 'README.md'), 'utf-8');

  // Extract Next.js integration section
  const nextjsMatch = readme.match(
    /<details>\s*<summary>Next\.js Integration<\/summary>([\s\S]*?)<\/details>/,
  );
  const nextjsSection = nextjsMatch
    ? nextjsMatch[1].trim()
    : 'See README for framework setup.';

  // Extract theming section headline
  const themingLine = readme.match(/## 🎨 Theming[^\n]*/)?.[0] ?? '';

  const setupNotes = [
    '## Next.js Integration',
    nextjsSection,
    '',
    themingLine
      ? `See "${themingLine.replace(/^#+\s*/, '')}" section in README.`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    name: pkg.name,
    description: pkg.description,
    installation: `npm install ${pkg.name}`,
    cssImport: `import '${pkg.name}/styles.css'`,
    peerDependencies: pkg.peerDependencies,
    setupNotes,
  };
}

// ─── styles content ───────────────────────────────────────────────────────────

function buildStylesContent(): string {
  return readFileSync(
    join(SRC, 'mcp', 'descriptions', 'typography.md'),
    'utf-8',
  );
}

// ─── theming content ──────────────────────────────────────────────────────────

function buildThemingContent(): string {
  const tailwindConfig = readFileSync(
    join(ROOT, 'tailwind.config.js'),
    'utf-8',
  );

  // Extract CSS variable token groups from tailwind config
  const tokenGroups: string[] = [];
  const groupRe = /const (\w+)\s*=\s*\{([\s\S]*?)\n\};/g;
  let groupMatch: RegExpExecArray | null;
  while ((groupMatch = groupRe.exec(tailwindConfig)) !== null) {
    const groupName = groupMatch[1];
    const body = groupMatch[2];
    const tokenRe = /'([^']+)':\s*'var\(--([^,]+),\s*([^)]+)\)'/g;
    const tokens: string[] = [];
    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = tokenRe.exec(body)) !== null) {
      tokens.push(
        `| \`${tokenMatch[1]}\` | \`var(--${tokenMatch[2]})\` | \`${tokenMatch[3]}\` |`,
      );
    }
    if (tokens.length > 0) {
      tokenGroups.push(
        `### ${groupName}\n| Tailwind class suffix | CSS variable | Default value |\n|---|---|---|\n${tokens.join('\n')}`,
      );
    }
  }

  const staticContent = readFileSync(
    join(SRC, 'mcp', 'descriptions', 'theming.md'),
    'utf-8',
  );
  return `${staticContent}\n\n${tokenGroups.join('\n\n')}`;
}

// ─── main orchestration ───────────────────────────────────────────────────────

function buildManifest(): Manifest {
  const records = parseIndexFile();
  const components: ComponentEntry[] = [];
  const types: TypeEntry[] = [];
  const hooks: ExportEntry[] = [];
  const utils: ExportEntry[] = [];
  const constants: ExportEntry[] = [];

  const processedFiles = new Set<string>();

  for (const rec of records) {
    // Skip Props types exported from component files (covered by component.props)
    if (
      rec.isTypeOnly &&
      rec.section === 'component' &&
      rec.name.endsWith('Props')
    ) {
      continue;
    }

    // Skip duplicate processing of the same name from same file
    const key = `${rec.name}:${rec.resolvedPath}`;
    if (processedFiles.has(key)) continue;
    processedFiles.add(key);

    try {
      if (rec.section === 'component' && !rec.isTypeOnly) {
        const entry = isComponentExport(rec) ? buildComponentEntry(rec) : null;
        if (entry) {
          components.push(entry);
        } else {
          // Enums and types are exported from this section too (e.g. the 2.0
          // `NotificationVariant`); document them as types so components can
          // reference them. Anything else is a wrapper, provider, or helper.
          const typeEntry = buildTypeEntry(rec);
          if (typeEntry) types.push(typeEntry);
          else hooks.push(buildExportEntry(rec));
        }
      } else if (rec.section === 'types' || rec.section === 'models') {
        const entry = buildTypeEntry(rec);
        if (entry) types.push(entry);
      } else if (rec.section === 'hooks') {
        hooks.push(buildExportEntry(rec));
      } else if (rec.section === 'utils') {
        utils.push(buildExportEntry(rec));
      } else if (rec.section === 'constants') {
        constants.push(buildExportEntry(rec));
      } else if (rec.isTypeOnly) {
        // Standalone model type exported from anywhere
        const entry = buildTypeEntry(rec);
        if (entry) types.push(entry);
      }
    } catch (e) {
      console.warn(`Skipping ${rec.name}: ${(e as Error).message}`);
    }
  }

  linkSupersededComponents(components);

  // Emit 2.0 first so anything reading the manifest directly — or taking an
  // unranked slice of it — sees the current generation before the legacy one.
  components.sort((a, b) =>
    a.generation === b.generation ? 0 : a.generation === '2.0' ? -1 : 1,
  );

  // Deduplicate types by name (enums may appear in both 'types' and 'models' sections)
  const seenTypes = new Set<string>();
  const dedupedTypes = types.filter((t) => {
    if (seenTypes.has(t.name)) return false;
    seenTypes.add(t.name);
    return true;
  });

  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8')) as {
    version: string;
  };

  return {
    version: pkg.version,
    generatedAt: new Date().toISOString(),
    kit: buildKitInfo(),
    styles: buildStylesContent(),
    theming: buildThemingContent(),
    components,
    types: dedupedTypes,
    hooks,
    utils,
    constants,
  };
}

function main(): void {
  console.log('Generating component manifest...');

  mkdirSync(DIST, { recursive: true });

  const manifest = buildManifest();

  const outPath = join(DIST, 'components-manifest.json');
  writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf-8');

  const ext = extname(outPath);
  console.log(
    `Manifest written to ${outPath.replace(ROOT, '.').replace(/\\/g, '/')}`,
  );
  const count2_0 = manifest.components.filter(
    (c) => c.generation === '2.0',
  ).length;
  console.log(
    `  ${manifest.components.length} components (${count2_0} generation 2.0), ` +
      `${manifest.types.length} types, ` +
      `${manifest.hooks.length} hooks, ${manifest.utils.length} utils, ` +
      `${manifest.constants.length} constants${ext ? '' : ''}`,
  );
}

main();
