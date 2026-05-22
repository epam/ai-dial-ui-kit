import type { DialFile } from '@/models/file';
import { FileManagerCreateFolderTriggerView } from '@/types/file-manager';
import { useCallback, useState } from 'react';

interface UseTriggerViewCreateFolderOptions {
  onGridAddSibling?: (files: DialFile[]) => void;
  onGridAddChild?: (files: DialFile[]) => void;
  onTreeAddSibling?: (files: DialFile[]) => void;
  onTreeAddChild?: (files: DialFile[]) => void;
}

/**
 * Manages which view ("tree" or "grid") triggered a folder creation action.
 *
 * Useful when both TreeView and GridView can initiate folder creation,
 * and the parent needs to know which source triggered it
 * to apply view-specific logic or UI updates.
 *
 * Returns the last folder creation trigger source and four handlers
 * (`onGridCreateSiblingFolder`, `onTreeCreateSiblingFolder`, `onGridCreateChildFolder`, `onTreeCreateChildFolder`) that wrap the provided `onGridAddSibling`, `onTreeAddSibling`, `onGridAddChild` and `onTreeAddChild` callbacks.
 */
export const useTriggerViewCreateFolder = ({
  onGridAddSibling,
  onGridAddChild,
  onTreeAddSibling,
  onTreeAddChild,
}: UseTriggerViewCreateFolderOptions) => {
  const [createFolderTriggerView, setCreateFolderTriggerView] =
    useState<FileManagerCreateFolderTriggerView>(
      FileManagerCreateFolderTriggerView.Grid,
    );

  const onGridCreateSiblingFolder = useCallback(
    (files: DialFile[]) => {
      onGridAddSibling?.(files);
      setCreateFolderTriggerView(FileManagerCreateFolderTriggerView.Grid);
    },
    [onGridAddSibling],
  );

  const onTreeCreateSiblingFolder = useCallback(
    (files: DialFile[]) => {
      onTreeAddSibling?.(files);
      setCreateFolderTriggerView(FileManagerCreateFolderTriggerView.Tree);
    },
    [onTreeAddSibling],
  );

  const onGridCreateChildFolder = useCallback(
    (files: DialFile[]) => {
      onGridAddChild?.(files);
      setCreateFolderTriggerView(FileManagerCreateFolderTriggerView.Grid);
    },
    [onGridAddChild],
  );

  const onTreeCreateChildFolder = useCallback(
    (files: DialFile[]) => {
      onTreeAddChild?.(files);
      setCreateFolderTriggerView(FileManagerCreateFolderTriggerView.Tree);
    },
    [onTreeAddChild],
  );

  return {
    createFolderTriggerView,
    onGridCreateSiblingFolder,
    onTreeCreateSiblingFolder,
    onGridCreateChildFolder,
    onTreeCreateChildFolder,
  };
};
