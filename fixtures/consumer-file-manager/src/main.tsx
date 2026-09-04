import { createRoot } from 'react-dom/client';
import { DialFileManager } from '@epam/ai-dial-ui-kit';

/**
 * FileManager feature fixture:
 * statically imports `DialFileManager`, which reaches the legacy `DialGrid`
 * (src/components/FileManager/FileManager.tsx:46). Its feature graph must
 * include ag-grid-community/ag-grid-react but exclude every editor-only
 * dependency.
 */
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<DialFileManager {...({ items: [] } as never)} />);
}
