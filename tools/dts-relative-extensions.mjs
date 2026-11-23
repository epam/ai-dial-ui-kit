/**
 * Gives every relative import in an emitted declaration file an explicit
 * `.js` extension.
 *
 * `package.json` sets `"type": "module"`, so TypeScript reads the published
 * `.d.ts` files as ES modules. Under `moduleResolution: "node16"` /
 * `"nodenext"` a relative specifier in an ES module must name its file, and
 * `vite-plugin-dts` emits them as written in `src/` — extensionless, with the
 * `@/*` alias rewritten to an extensionless relative path. A consumer on those
 * settings then saw TS2834/TS2835 inside `node_modules`, or, with
 * `skipLibCheck`, every export silently typed as `any` (issue #1025).
 *
 * `moduleResolution: "bundler"` accepts the `.js` spelling too, so the
 * rewrite changes nothing for consumers who already resolved the types.
 */
import { existsSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

/*
 * `from '…'` covers `import … from` and `export … from`; `import('…')` is
 * what TypeScript writes for an inferred type it cannot name otherwise; a
 * bare `import '…'` is a side-effect import.
 */
const RELATIVE_SPECIFIER =
  /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"]*)\2/g;

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.d.ts'];

/**
 * @param {string} content Declaration file text.
 * @param {(specifier: string) => string} resolveSpecifier Maps one relative
 *   specifier to the spelling that should be written.
 * @returns {string}
 */
export const rewriteRelativeSpecifiers = (content, resolveSpecifier) =>
  content.replace(
    RELATIVE_SPECIFIER,
    (_match, prefix, quote, specifier) =>
      `${prefix}${quote}${resolveSpecifier(specifier)}${quote}`,
  );

/**
 * Builds a resolver that looks the specifier up next to the declaration's
 * source module.
 *
 * @param {string} sourceDir Directory of the `.ts`/`.tsx` module the
 *   declaration was emitted from.
 * @param {(path: string) => boolean} [fileExists]
 * @returns {(specifier: string) => string}
 */
export const createSpecifierResolver =
  (sourceDir, fileExists = existsSync) =>
  (specifier) => {
    const target = resolve(sourceDir, specifier);

    /*
     * `allowImportingTsExtensions` lets `src/` write `./x.ts`, and the emitter
     * copies that spelling into the declaration, where no consumer setting
     * resolves it to the emitted `./x.d.ts`.
     */
    if (/\.tsx?$/.test(specifier) && fileExists(target)) {
      return specifier.replace(/\.tsx?$/, '.js');
    }
    if (SOURCE_EXTENSIONS.some((ext) => fileExists(`${target}${ext}`))) {
      return `${specifier}.js`;
    }
    if (SOURCE_EXTENSIONS.some((ext) => fileExists(`${target}/index${ext}`))) {
      return `${specifier.replace(/\/$/, '')}/index.js`;
    }
    // Already spelled with its extension (`./x.js`, `./icon.svg`, …).
    if (/\.[cm]?js$/.test(specifier) || fileExists(target)) {
      return specifier;
    }

    // Fail the build rather than ship a specifier `nodenext` cannot resolve.
    throw new Error(
      `Cannot resolve "${specifier}" from ${sourceDir} while adding .js extensions to declarations.`,
    );
  };

/**
 * `vite-plugin-dts` `beforeWriteFile` hook. Declarations mirror the source
 * tree under `outDir` (`dist/src/a/b.d.ts` ← `src/a/b.ts`), which is how the
 * source directory of each file is recovered.
 *
 * @param {{ root: string, outDir: string }} options
 */
export const addDtsRelativeExtensions =
  ({ root, outDir }) =>
  (filePath, content) => {
    if (!/\.d\.[cm]?ts$/.test(filePath)) return undefined;

    const sourceDir = resolve(root, relative(outDir, dirname(filePath)));
    return {
      content: rewriteRelativeSpecifiers(
        content,
        createSpecifierResolver(sourceDir),
      ),
    };
  };
