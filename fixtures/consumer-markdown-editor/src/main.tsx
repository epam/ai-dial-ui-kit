import { useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LazyDialMarkdownEditor,
  LazyMarkdownEditor,
} from '@epam/ai-dial-ui-kit';
import { LazyDialMarkdownEditorContainer } from '@epam/ai-dial-ui-kit/editors';

type LazyContainerModule = Awaited<
  ReturnType<typeof LazyDialMarkdownEditorContainer>
>;

/**
 * Markdown editor lazy-loader fixture (design.md Decision 6 / tasks.md
 * 5.2-5.3): calls both existing Markdown loaders, then renders the container
 * through the editors subpath and programmatically activates JSON mode.
 * Bundle metadata must show that UIW is lazy relative to the app and Monaco
 * is additionally separated by the container's nested dynamic import.
 */
const App = () => {
  const [Container, setContainer] = useState<ComponentType<
    Parameters<LazyContainerModule['DialMarkdownEditorContainer']>[0]
  > | null>(null);

  useEffect(() => {
    LazyDialMarkdownEditor();
    LazyMarkdownEditor();
    LazyDialMarkdownEditorContainer().then((module) => {
      setContainer(() => module.DialMarkdownEditorContainer);
    });
  }, []);

  useEffect(() => {
    if (!Container) return;
    const toggleTimer = window.setTimeout(() => {
      document
        .querySelector<HTMLInputElement>('input[type="checkbox"]')
        ?.click();
    }, 0);
    return () => window.clearTimeout(toggleTimer);
  }, [Container]);

  if (!Container) return null;
  return (
    <Container value='{"fixture": true}' switcherLabel="Use JSON editor" />
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
