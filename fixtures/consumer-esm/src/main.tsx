import { createRoot } from 'react-dom/client';
import { Button } from '@epam/ai-dial-ui-kit';

/**
 * Mandatory root ESM fixture:
 * a static import of a single basic component from the backward-compatible
 * root `@epam/ai-dial-ui-kit` entry. Its complete static initial graph must
 * exclude ag-grid-community, ag-grid-react, @monaco-editor/react,
 * monaco-editor, @uiw/react-md-editor, and @uiw/react-markdown-preview.
 */
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Button label="Hello" />);
}
