# Migrating the legacy `DialFileManager` — v0.15 → v0.16

## Why this changed

The file manager lives in its own package, `@epam/ai-dial-react-file-manager`,
which is where it is developed and what DIAL Chat already uses. The kit still
shipped the older copy, and the two drifted apart. Keeping both meant two
`DialFileManager` exports with the same name and different behaviour, and the
kit's copy pulled the legacy `DialGrid` and AG Grid into every consumer of the
`./file-manager` subpath. The copy in the kit is removed. The standalone package
is the only file manager.

## What changed

Every name below is gone from `@epam/ai-dial-ui-kit`, and the
`@epam/ai-dial-ui-kit/file-manager` subpath is gone with them. Each name is
exported under the same name by `@epam/ai-dial-react-file-manager`.

| Kind              | Removed from `@epam/ai-dial-ui-kit`                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Components        | `DialFileManager`, `DialFoldersTree`, `DialDestinationFolderPopup`                                                                                                                               |
| Context and hooks | `FileManagerProvider`, `useFileManagerContext`, `useDialFileManagerTabs`                                                                                                                         |
| Enums             | `DialFileManagerTabs`, `DialFileManagerActions`, `FileManagerColumnKey`                                                                                                                          |
| Column constants  | `NAME_COLUMN`, `SIZE_COLUMN`, `UPDATED_AT_COLUMN`                                                                                                                                                |
| Types             | `FileManagerGridRow`, `GridOptions`, `ToolbarOptions`, `BulkActionsToolbarOptions`, `DialCopiedItem`, `DialDeletedItem`, `DialUploadFileItem`, `DialFileManagerActionsRef`, `DialFileAcceptType` |
| Package subpath   | `@epam/ai-dial-ui-kit/file-manager`                                                                                                                                                              |

These stay in the kit: `DialFileName`, `DialFolderName`, `DialFileIcon`,
`DialSharedEntityIndicator`, `DialFile`, `DialRootFolder`, `DialFileNodeType`,
`DialFilePermission`, `DialFileResourceType`, `DialItemType`,
`wrapInRootFolder` and `useEditableItem`, plus the 2.0 `FileIcon`, `FileName`,
`FolderName`, `SharedEntityIndicator` and `TransferQueue`.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rnE "ai-dial-ui-kit/file-manager|\b(DialFileManager|DialFoldersTree|DialDestinationFolderPopup|FileManagerProvider|useFileManagerContext|useDialFileManagerTabs|DialFileManagerTabs|DialFileManagerActions|FileManagerColumnKey|NAME_COLUMN|SIZE_COLUMN|UPDATED_AT_COLUMN|FileManagerGridRow|GridOptions|ToolbarOptions|BulkActionsToolbarOptions|DialCopiedItem|DialDeletedItem|DialUploadFileItem|DialFileManagerActionsRef|DialFileAcceptType)\b" src/
```

### 2. Install the standalone package

```bash
npm install @epam/ai-dial-react-file-manager
```

### 3. Move the imports

Import the removed names from the standalone package. The kit's other names
keep their kit import.

**Before:**

```tsx
import {
  DialFileManager,
  DialFileManagerTabs,
  DialFileName,
} from '@epam/ai-dial-ui-kit';
// or
import { DialFileManager } from '@epam/ai-dial-ui-kit/file-manager';
```

**After:**

```tsx
import {
  DialFileManager,
  DialFileManagerTabs,
} from '@epam/ai-dial-react-file-manager';
import { DialFileName } from '@epam/ai-dial-ui-kit';
```

The standalone package has its own props and releases, so check its
documentation for any prop that changed since the copy in the kit was forked.

### 4. Verify

```bash
npm run typecheck
npm run test
```

## Notes

- The SVG icons used only by the old file manager (`add-child`, `add-sibling`,
  `copy-to`, `move-to`, `unshare`) are removed as well. They were never
  exported, so only a deep import into `dist/` would notice.
