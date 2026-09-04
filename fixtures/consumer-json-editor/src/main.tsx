import { useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { LazyDialJsonEditor } from '@epam/ai-dial-ui-kit';

type LazyJsonEditorModule = Awaited<ReturnType<typeof LazyDialJsonEditor>>;

/**
 * JSON editor lazy-loader fixture:
 * calls `LazyDialJsonEditor()` the same way `MarkdownEditorContainer` does,
 * only after mount - Monaco/@monaco-editor/react must stay out of the static
 * initial graph and load only in the resulting dynamic chunk.
 */
const App = () => {
  const [Editor, setEditor] = useState<ComponentType<
    Parameters<LazyJsonEditorModule['DialJsonEditor']>[0]
  > | null>(null);

  useEffect(() => {
    LazyDialJsonEditor().then((mod) => setEditor(() => mod.DialJsonEditor));
  }, []);

  if (!Editor) return null;
  return <Editor value="{}" currentTheme="dark" onChange={() => {}} />;
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
