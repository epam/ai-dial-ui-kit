import { createRoot } from 'react-dom/client';
import { Button } from '@epam/ai-dial-ui-kit';

/**
 * Mandatory root ESM fixture:
 * a static import of a single basic component from the backward-compatible
 * root `@epam/ai-dial-ui-kit` entry. Its complete static initial graph must
 * exclude AG Grid and every editor-only (Monaco / `@uiw/*`) dependency.
 *
 * Deliberately avoided above: spelling out the exact forbidden package
 * specifiers `assert-static-graph.mjs` checks for. With `minify: false`
 * (needed so that tool's content-grep signal can inspect real output),
 * esbuild preserves this JSDoc comment verbatim in the emitted chunk, and a
 * comment that names its own forbidden markers becomes a false positive
 * indistinguishable from the real thing.
 */
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Button label="Hello" />);
}
