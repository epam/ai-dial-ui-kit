import { createRoot } from 'react-dom/client';
import {
  Button,
  LazyDialJsonEditor,
  LazyDialMarkdownEditor,
  LazyMarkdownEditor,
} from '@epam/ai-dial-ui-kit';

/**
 * Section 9 regression fixture (isolate-heavy-feature-modules follow-up):
 * eagerly imports `Button` AND retains all three root lazy editor loaders
 * (`LazyDialJsonEditor`, `LazyDialMarkdownEditor`, `LazyMarkdownEditor` -
 * every one `src/index.ts` currently declares) from the backward-compatible
 * root `@epam/ai-dial-ui-kit` entry, AND reaches `Grid` only through a
 * dynamic `import('./grid-feature')` of a *separate* local module that
 * itself statically imports `Grid` from `@epam/ai-dial-ui-kit/grid` -
 * matching the exact reproduction shape reported in
 * `verification-report.md`'s "Consumer follow-up" section:
 * `Object.assign(window, {...})` forces genuine eager retention that a
 * bundler cannot tree-shake away (unlike merely referencing a binding in an
 * unreachable branch). See `fixtures/consumer-mixed-grid-editors-subpath`
 * for the equivalent fixture importing the loaders from `./editors` instead.
 */
Object.assign(window, {
  Button,
  LazyDialJsonEditor,
  LazyDialMarkdownEditor,
  LazyMarkdownEditor,
});

const root = document.getElementById('root');
if (root) {
  const reactRoot = createRoot(root);
  reactRoot.render(
    <Button
      label="Open Grid"
      onClick={async () => {
        const { GridFeature } = await import('./grid-feature');
        reactRoot.render(<GridFeature />);
      }}
    />,
  );
}
