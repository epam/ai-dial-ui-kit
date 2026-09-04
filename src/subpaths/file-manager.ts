/**
 * `@epam/ai-dial-ui-kit/file-manager` - curated subpath for `DialFileManager`
 * and its directly related types/hooks/constants.
 *
 * Re-exports the FileManager-related names from the root `src/index.ts`
 * barrel. `DialFileManager` reaches the legacy `DialGrid`
 * (src/components/FileManager/FileManager.tsx:46), so importing from this
 * subpath pulls in ag-grid-community/ag-grid-react exactly as importing
 * `DialFileManager` from the root does.
 */

export { DialFileManager } from '../components/FileManager/FileManager';
export type { FileManagerGridRow } from '../components/FileManager/FileManagerContext';
export type {
  GridOptions,
  ToolbarOptions,
  BulkActionsToolbarOptions,
} from '../components/FileManager/FileManager';
export { DialDestinationFolderPopup } from '../components/FileManager/components/DestinationFolderPopup/DestinationFolderPopup';
export { DialFoldersTree } from '../components/FileManager/components/FoldersTree/FoldersTree';

// Hooks
export { useDialFileManagerTabs } from '../components/FileManager/hooks/use-file-manager-tabs';

// Context and Provider
export { FileManagerProvider } from '../components/FileManager/FileManagerProvider';
export { useFileManagerContext } from '../components/FileManager/hooks/use-file-manager-context';

// Types
export {
  DialFileManagerTabs,
  DialFileManagerActions,
  FileManagerColumnKey,
} from '../types/file-manager';

// Models
export {
  type DialCopiedItem,
  type DialDeletedItem,
  type DialUploadFileItem,
  type DialFileManagerActionsRef,
  type DialFileAcceptType,
} from '../models/file-manager';

// Constants
export {
  NAME_COLUMN,
  SIZE_COLUMN,
  UPDATED_AT_COLUMN,
} from '../constants/file-grid-columns';
