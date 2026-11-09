import { createRoot } from 'react-dom/client';
import { Button } from '@epam/ai-dial-ui-kit';
import { LazyMarkdownEditor } from '@epam/ai-dial-ui-kit/editors';

/**
 * Companion to `fixtures/consumer-mixed-grid-editor-loader`: the identical
 * scenario, except the editor loader is imported from
 * `@epam/ai-dial-ui-kit/editors` instead of the root. Confirms the
 * `./editors` subpath stays safe after the Section 9 shared-leaf-module
 * refactor (both entries re-export the same leaf module - see
 * `src/subpaths/editors.ts`'s comment).
 */
Object.assign(window, {
  Button,
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
