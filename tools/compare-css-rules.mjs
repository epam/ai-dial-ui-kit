#!/usr/bin/env node
/**
 * Compares two built CSS files' rule sets via a `postcss` AST walk (not a
 * byte diff), per openspec/changes/modularize-package-exports/tasks.md
 * Task 6.1: asserts the "after" file's selectors are a superset of (or
 * equal to) the "before" file's - no existing rule was dropped by the
 * module-layout restructuring, even though the CSS build
 * (`tailwindcss -i tailwind-entry.scss`) is driven by content-scanning
 * `src/**`, not by the JS chunking strategy those tasks changed.
 *
 * Usage:
 *   node tools/compare-css-rules.mjs --before <path> --after <path>
 */
import { readFileSync } from 'node:fs';
import postcss from 'postcss';

const parseArgs = (argv) => {
  const out = { before: null, after: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--before') out.before = argv[++i];
    else if (argv[i] === '--after') out.after = argv[++i];
  }
  return out;
};

/** Every rule's selector, normalized to its raw text (order-independent). */
const extractSelectors = (cssPath) => {
  const css = readFileSync(cssPath, 'utf8');
  const root = postcss.parse(css, { from: cssPath });
  const selectors = new Set();
  root.walkRules((rule) => {
    selectors.add(rule.selector);
  });
  return selectors;
};

const main = () => {
  const { before, after } = parseArgs(process.argv.slice(2));
  if (!before || !after) {
    console.error(
      'Usage: node tools/compare-css-rules.mjs --before <path> --after <path>',
    );
    process.exit(1);
  }

  const beforeSelectors = extractSelectors(before);
  const afterSelectors = extractSelectors(after);

  const missing = [...beforeSelectors].filter((s) => !afterSelectors.has(s));

  console.log(`before: ${beforeSelectors.size} rules (${before})`);
  console.log(`after:  ${afterSelectors.size} rules (${after})`);

  if (missing.length > 0) {
    console.error(
      `\nFAIL: ${missing.length} rule(s) present in "before" are missing from "after":`,
    );
    for (const s of missing) console.error(`  - ${s}`);
    process.exit(1);
  }

  console.log(
    `\nOK: "after" is a superset of "before" (0 missing; +${
      afterSelectors.size - beforeSelectors.size
    } new).`,
  );
};

main();
