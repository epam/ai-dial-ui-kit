#!/usr/bin/env node
/**
 * Asserts which forbidden/required packages appear in a consumer fixture's
 * complete STATIC INITIAL module graph vs. its dynamically-loaded chunks.
 *
 * Reads <dist>/graph-report.json (written by graph-report-plugin.mjs during
 * the fixture's own `vite build`) and:
 *   1. Computes staticChunks = every entry chunk that is NOT itself a
 *      dynamic entry, plus everything transitively reachable via `imports`
 *      (never via `dynamicImports`).
 *   2. Computes dynamicChunks = every other chunk (isDynamicEntry, or only
 *      reachable via a dynamicImports edge).
 *   3. For each package key in --forbidden: fails if found in staticChunks
 *      (via moduleIds path match - the bundler-metadata signal - or via a
 *      content grep for stable markers - the second signal, needed for
 *      packages the dependency bundles into its own opaque output, like
 *      AG Grid, where no separate resolved module id survives).
 *   4. For each package key in --require: fails if NOT found anywhere in
 *      staticChunks (moduleIds or content grep).
 *   5. For each package key in --dynamic-require: fails if not found in
 *      dynamicChunks, or if found in staticChunks (it must be lazy-only).
 *   6. For each parent:child marker pair in --dynamic-after: fails unless a
 *      chunk containing child is reachable from a chunk containing parent
 *      only after crossing a dynamicImports edge. This verifies nested lazy
 *      boundaries rather than merely checking that both chunks are dynamic
 *      relative to the application entry.
 *   7. For each package key in --forbidden-everywhere: fails if found in
 *      EITHER staticChunks OR dynamicChunks - i.e. the package must be
 *      completely absent from the build, not merely absent from the
 *      static initial graph. Use this instead of --forbidden when a
 *      fixture also has its own dynamic import boundary (e.g. a mixed
 *      eager-root + lazy-feature fixture) and the requirement is that an
 *      unrelated feature (an editor dependency, say) never appears even in
 *      the *other* feature's lazy chunk - plain --forbidden only checks the
 *      static graph and would miss that.
 *   8. Independently of the above (always, when the fixture has an
 *      `index.html`): parses every `<script type="module" src="...">` and
 *      `<link rel="modulepreload" href="...">` tag, re-runs every
 *      `--forbidden`/`--forbidden-everywhere` package against exactly that
 *      set, and fails if the HTML entry and the graph-report closure
 *      disagree about which chunks are initial. This is a second signal
 *      independent of Rollup's own self-reported `imports`/`isEntry`
 *      metadata - the actual thing a real browser fetches on load.
 *   9. Always reports the static closure's initial JS and CSS byte totals
 *      (raw and gzip) as a final measurement, independent of the
 *      pass/fail checks above.
 *
 * Usage:
 *   node assert-static-graph.mjs --dist <path> \
 *     [--forbidden pkg1,pkg2] [--forbidden-everywhere pkg5] \
 *     [--require pkg3] [--dynamic-require pkg4] \
 *     [--dynamic-after ParentMarker:child-package]
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { gzipSync } from 'node:zlib';

/** Stable content markers per package - the second signal (grep), used both
 * as a backup for externalized packages and as the ONLY viable signal for
 * packages a dependency bundles into its own opaque output (no separate
 * resolved module id reaches the fixture's bundler in that case). */
const MARKERS = {
  'ag-grid-community': [
    'ag-grid-community',
    'ModuleRegistry',
    'AllCommunityModule',
  ],
  'ag-grid-react': ['ag-grid-react', 'AgGridReact'],
  '@monaco-editor/react': ['@monaco-editor/react'],
  'monaco-editor': ['monaco-editor'],
  '@uiw/react-md-editor': ['@uiw/react-md-editor'],
  '@uiw/react-markdown-preview': ['@uiw/react-markdown-preview'],
  MarkdownEditorContainer: ['MarkdownEditorContainer'],
  SchemaAdditionalPropertiesEditor: ['SchemaAdditionalPropertiesEditor'],
};
const LOCAL_MODULE_MARKERS = new Set([
  'MarkdownEditorContainer',
  'SchemaAdditionalPropertiesEditor',
]);

const parseArgs = (argv) => {
  const out = {
    dist: null,
    forbidden: [],
    forbiddenEverywhere: [],
    require: [],
    dynamicRequire: [],
    dynamicAfter: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dist') out.dist = argv[++i];
    else if (arg === '--forbidden')
      out.forbidden = argv[++i].split(',').filter(Boolean);
    else if (arg === '--forbidden-everywhere')
      out.forbiddenEverywhere = argv[++i].split(',').filter(Boolean);
    else if (arg === '--require')
      out.require = argv[++i].split(',').filter(Boolean);
    else if (arg === '--dynamic-require')
      out.dynamicRequire = argv[++i].split(',').filter(Boolean);
    else if (arg === '--dynamic-after') {
      out.dynamicAfter = argv[++i]
        .split(',')
        .filter(Boolean)
        .map((pair) => {
          const separator = pair.indexOf(':');
          if (separator < 1 || separator === pair.length - 1) {
            throw new Error(
              `Invalid --dynamic-after pair "${pair}"; expected ParentMarker:child-package.`,
            );
          }
          return {
            parent: pair.slice(0, separator),
            child: pair.slice(separator + 1),
          };
        });
    }
  }
  return out;
};

const loadReport = (distDir) => {
  const reportPath = resolvePath(distDir, 'graph-report.json');
  if (!existsSync(reportPath)) {
    throw new Error(
      `graph-report.json not found at ${reportPath} - did the fixture's vite.config include graphReportPlugin()?`,
    );
  }
  return JSON.parse(readFileSync(reportPath, 'utf8'));
};

/** Returns { staticChunks: Set<fileName>, dynamicChunks: Set<fileName> }. */
const partitionChunks = (chunks) => {
  const staticChunks = new Set();
  const visit = (fileName) => {
    if (staticChunks.has(fileName)) return;
    const chunk = chunks[fileName];
    if (!chunk) return;
    staticChunks.add(fileName);
    for (const imported of chunk.imports) visit(imported);
  };

  for (const [fileName, chunk] of Object.entries(chunks)) {
    if (chunk.isEntry && !chunk.isDynamicEntry) visit(fileName);
  }

  const dynamicChunks = new Set(
    Object.keys(chunks).filter((fileName) => !staticChunks.has(fileName)),
  );

  return { staticChunks, dynamicChunks };
};

const findPackageInChunks = ({ distDir, chunks, chunkNames, pkg }) => {
  const hits = [];
  for (const fileName of chunkNames) {
    const chunk = chunks[fileName];
    if (!chunk) continue;

    const moduleHit = chunk.moduleIds.some((id) => {
      const normalizedId = id.replaceAll('\\', '/');
      return (
        normalizedId.includes(`/node_modules/${pkg}/`) ||
        (LOCAL_MODULE_MARKERS.has(pkg) && normalizedId.includes(pkg))
      );
    });
    if (moduleHit) hits.push({ fileName, signal: 'module-id' });

    const filePath = resolvePath(distDir, fileName);
    if (existsSync(filePath) && !LOCAL_MODULE_MARKERS.has(pkg)) {
      const content = readFileSync(filePath, 'utf8');
      const markers = MARKERS[pkg] ?? [pkg];
      const markerHit = markers.some((marker) => content.includes(marker));
      if (markerHit) hits.push({ fileName, signal: 'content-grep' });
    }
  }
  return hits;
};

const staticClosure = (chunks, startNames) => {
  const visited = new Set();
  const visit = (fileName) => {
    if (visited.has(fileName)) return;
    const chunk = chunks[fileName];
    if (!chunk) return;
    visited.add(fileName);
    for (const imported of chunk.imports) visit(imported);
  };
  for (const fileName of startNames) visit(fileName);
  return visited;
};

const chunksReachableAfterDynamicImport = (chunks, startNames) => {
  const parentStaticClosure = staticClosure(chunks, startNames);
  const visited = new Set();
  const visit = (fileName) => {
    if (visited.has(fileName)) return;
    const chunk = chunks[fileName];
    if (!chunk) return;
    visited.add(fileName);
    for (const imported of chunk.imports) visit(imported);
    for (const imported of chunk.dynamicImports) visit(imported);
  };

  for (const fileName of parentStaticClosure) {
    const chunk = chunks[fileName];
    for (const imported of chunk?.dynamicImports ?? []) visit(imported);
  }
  return { parentStaticClosure, dynamicDescendants: visited };
};

/**
 * Reads `<distDir>/index.html` and returns the set of chunk file names (as
 * they appear as keys in `chunks`, i.e. relative to `distDir`) referenced by
 * every `<script type="module" src="...">` and `<link rel="modulepreload"
 * href="...">` tag - the actual set a real browser fetches on page load,
 * independent of Rollup's own self-reported `imports`/`isEntry` graph
 * metadata. Returns `null` (skip the cross-check) if there is no
 * `index.html` - some fixtures build a library, not a page.
 */
const readHtmlPreloadedFiles = (distDir) => {
  const htmlPath = resolvePath(distDir, 'index.html');
  if (!existsSync(htmlPath)) return null;

  const html = readFileSync(htmlPath, 'utf8');
  const files = new Set();
  // Matches both attribute orders and either quote style Vite emits.
  const tagRe =
    /<(?:script[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["']|link[^>]*\brel=["']modulepreload["'][^>]*\bhref=["']([^"']+)["'])[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const href = (m[1] ?? m[2] ?? '').replace(/^\.?\//, '');
    if (href) files.add(href);
  }
  return files;
};

/** Sums raw and gzip byte sizes for `chunkNames`, split by JS vs CSS. */
const measureChunks = (distDir, chunkNames) => {
  const totals = { jsRaw: 0, jsGzip: 0, cssRaw: 0, cssGzip: 0 };
  for (const fileName of chunkNames) {
    const filePath = resolvePath(distDir, fileName);
    if (!existsSync(filePath)) continue;
    const buf = readFileSync(filePath);
    const gzipLen = gzipSync(buf, { level: 9 }).length;
    if (fileName.endsWith('.css')) {
      totals.cssRaw += buf.length;
      totals.cssGzip += gzipLen;
    } else {
      totals.jsRaw += buf.length;
      totals.jsGzip += gzipLen;
    }
  }
  return totals;
};

const main = () => {
  const {
    dist,
    forbidden,
    forbiddenEverywhere,
    require: requirePkgs,
    dynamicRequire,
    dynamicAfter,
  } = parseArgs(process.argv.slice(2));
  if (!dist) {
    console.error(
      'Usage: node assert-static-graph.mjs --dist <path> [--forbidden a,b] [--forbidden-everywhere e] [--require c] [--dynamic-require d] [--dynamic-after Parent:child]',
    );
    process.exit(1);
  }

  const distDir = resolvePath(process.cwd(), dist);
  const chunks = loadReport(distDir);
  const { staticChunks, dynamicChunks } = partitionChunks(chunks);

  let failed = false;

  for (const pkg of forbidden) {
    const hits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: staticChunks,
      pkg,
    });
    if (hits.length > 0) {
      failed = true;
      console.error(
        `FORBIDDEN package "${pkg}" found in static initial graph:`,
      );
      for (const h of hits)
        console.error(`  - ${h.fileName} (signal: ${h.signal})`);
    } else {
      console.log(`OK: "${pkg}" absent from static initial graph.`);
    }
  }

  for (const pkg of forbiddenEverywhere) {
    const hits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: Object.keys(chunks),
      pkg,
    });
    if (hits.length > 0) {
      failed = true;
      console.error(
        `FORBIDDEN-EVERYWHERE package "${pkg}" found in the build (static or dynamic):`,
      );
      for (const h of hits)
        console.error(`  - ${h.fileName} (signal: ${h.signal})`);
    } else {
      console.log(`OK: "${pkg}" absent from the entire build.`);
    }
  }

  for (const pkg of requirePkgs) {
    const hits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: staticChunks,
      pkg,
    });
    if (hits.length === 0) {
      failed = true;
      console.error(
        `REQUIRED package "${pkg}" was NOT found in static initial graph (expected present).`,
      );
    } else {
      console.log(
        `OK: "${pkg}" present in static initial graph (${hits.map((h) => h.fileName).join(', ')}).`,
      );
    }
  }

  for (const pkg of dynamicRequire) {
    const staticHits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: staticChunks,
      pkg,
    });
    const dynamicHits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: dynamicChunks,
      pkg,
    });
    if (staticHits.length > 0) {
      failed = true;
      console.error(
        `"${pkg}" expected to be LAZY-ONLY but found in static initial graph:`,
      );
      for (const h of staticHits)
        console.error(`  - ${h.fileName} (signal: ${h.signal})`);
    } else if (dynamicHits.length === 0) {
      failed = true;
      console.error(
        `"${pkg}" expected in a dynamic chunk but was not found anywhere.`,
      );
    } else {
      console.log(
        `OK: "${pkg}" present only in dynamic chunk(s) (${dynamicHits.map((h) => h.fileName).join(', ')}).`,
      );
    }
  }

  for (const { parent, child } of dynamicAfter) {
    const allChunkNames = Object.keys(chunks);
    const parentHits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: allChunkNames,
      pkg: parent,
    });
    const childHits = findPackageInChunks({
      distDir,
      chunks,
      chunkNames: allChunkNames,
      pkg: child,
    });
    const parentChunks = new Set(parentHits.map(({ fileName }) => fileName));
    const childChunks = new Set(childHits.map(({ fileName }) => fileName));

    if (parentChunks.size === 0 || childChunks.size === 0) {
      failed = true;
      console.error(
        `Nested lazy boundary ${parent}:${child} could not be checked: ` +
          `${parentChunks.size === 0 ? `parent marker "${parent}" missing` : ''}` +
          `${parentChunks.size === 0 && childChunks.size === 0 ? '; ' : ''}` +
          `${childChunks.size === 0 ? `child marker "${child}" missing` : ''}.`,
      );
      continue;
    }

    const { parentStaticClosure, dynamicDescendants } =
      chunksReachableAfterDynamicImport(chunks, parentChunks);
    const eagerChildChunks = [...childChunks].filter((fileName) =>
      parentStaticClosure.has(fileName),
    );
    const lazyChildChunks = [...childChunks].filter((fileName) =>
      dynamicDescendants.has(fileName),
    );

    if (eagerChildChunks.length > 0 || lazyChildChunks.length === 0) {
      failed = true;
      console.error(
        `Nested lazy boundary ${parent}:${child} is invalid. ` +
          `Eager child chunks: ${eagerChildChunks.join(', ') || '(none)'}; ` +
          `child chunks reachable after a dynamic edge: ${lazyChildChunks.join(', ') || '(none)'}.`,
      );
    } else {
      console.log(
        `OK: "${child}" is reachable from "${parent}" only after a dynamic import (${lazyChildChunks.join(', ')}).`,
      );
    }
  }

  // Cross-check against the actual HTML entry: an independent signal from
  // Rollup's own self-reported graph metadata. A real browser only ever
  // eagerly fetches what index.html's <script type="module"> and
  // <link rel="modulepreload"> tags name - if any forbidden package is
  // reachable from THIS set, it is initially loaded regardless of what the
  // graph-report's `imports` edges say.
  const htmlPreloaded = readHtmlPreloadedFiles(distDir);
  if (htmlPreloaded) {
    const combinedForbidden = [...forbidden, ...forbiddenEverywhere];
    for (const pkg of combinedForbidden) {
      const hits = findPackageInChunks({
        distDir,
        chunks,
        chunkNames: htmlPreloaded,
        pkg,
      });
      if (hits.length > 0) {
        failed = true;
        console.error(
          `FORBIDDEN package "${pkg}" reachable from an HTML <script>/<link modulepreload> entry:`,
        );
        for (const h of hits)
          console.error(`  - ${h.fileName} (signal: ${h.signal})`);
      }
    }
    const unaccounted = [...htmlPreloaded].filter(
      (f) => !staticChunks.has(f) && chunks[f],
    );
    if (unaccounted.length > 0) {
      failed = true;
      console.error(
        `HTML references chunk(s) the graph-report closure did not classify as static: ${unaccounted.join(', ')}. ` +
          'This means index.html and graph-report.json disagree about the initial graph - investigate before trusting either signal alone.',
      );
    } else {
      console.log(
        `OK: every HTML <script>/<link modulepreload> entry (${htmlPreloaded.size}) is accounted for in the static closure.`,
      );
    }
  }

  console.log(
    `\nStatic chunks (${staticChunks.size}): ${[...staticChunks].join(', ')}`,
  );
  console.log(
    `Dynamic chunks (${dynamicChunks.size}): ${[...dynamicChunks].join(', ') || '(none)'}`,
  );

  const { jsRaw, jsGzip, cssRaw, cssGzip } = measureChunks(
    distDir,
    staticChunks,
  );
  console.log(
    `\nInitial JS:  ${jsRaw} raw / ${jsGzip} gzip bytes\n` +
      `Initial CSS: ${cssRaw} raw / ${cssGzip} gzip bytes`,
  );

  if (failed) {
    console.error('\nFAIL');
    process.exit(1);
  }
  console.log('\nPASS');
};

main();
