/* eslint-disable no-console */
import * as ts from 'typescript';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from 'fs';
import { resolve, join, dirname, relative, extname } from 'path';
import type {
  Manifest,
  ComponentEntry,
  TypeEntry,
  ExportEntry,
  PropEntry,
  TypeMember,
  KitInfo,
} from './types.ts';

// ─── constants ────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const INDEX_PATH = join(SRC, 'index.ts');

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

function readSf(filePath: string): ts.SourceFile {
  const content = readFileSync(filePath, 'utf-8');
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2022, true);
}

function resolveModulePath(spec: string, fromDir: string): string | null {
  const base = resolve(fromDir, spec);

  // Direct hit (spec already has extension)
  if (existsSync(base)) return base;

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

// ─── index.ts parsing ─────────────────────────────────────────────────────────

interface IndexExport {
  name: string;
  isTypeOnly: boolean;
  resolvedPath: string;
  section: string;
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
    if (!ts.isExportDeclaration(node)) return;
    if (!node.moduleSpecifier || !node.exportClause) return;
    if (!ts.isNamedExports(node.exportClause)) return;

    const moduleSpec = (node.moduleSpecifier as ts.StringLiteral).text;
    const resolvedPath = resolveModulePath(moduleSpec, indexDir);
    if (!resolvedPath) {
      console.warn(`Could not resolve: ${moduleSpec}`);
      return;
    }

    const startLine = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line;
    const section = sectionByLine[startLine] ?? 'component';

    for (const element of node.exportClause.elements) {
      const isTypeOnly = node.isTypeOnly || element.isTypeOnly;
      const name = element.name.text;
      records.push({ name, isTypeOnly, resolvedPath, section });
    }
  });

  return records;
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

  return {
    name: rec.name,
    category,
    description,
    props,
    examples,
    sourceFile: relSrc(rec.resolvedPath),
  };
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
        // Only Dial* names are components; others (wrappers, providers) go to hooks
        if (rec.name.startsWith('Dial')) {
          const entry = buildComponentEntry(rec);
          if (entry) components.push(entry);
        } else {
          hooks.push(buildExportEntry(rec));
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
  console.log(
    `  ${manifest.components.length} components, ${manifest.types.length} types, ` +
      `${manifest.hooks.length} hooks, ${manifest.utils.length} utils, ` +
      `${manifest.constants.length} constants${ext ? '' : ''}`,
  );
}

main();
