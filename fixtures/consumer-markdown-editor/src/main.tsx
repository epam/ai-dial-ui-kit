import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMarkdownEditor } from '@epam/ai-dial-ui-kit';

/**
 * Markdown editor lazy-loader fixture: calls the Markdown loader after mount.
 * Bundle metadata must show that `@uiw/*` stays out of the initial graph and
 * is reachable only through the loader's dynamic import.
 */
const App = () => {
  useEffect(() => {
    LazyMarkdownEditor();
  }, []);

  return null;
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
