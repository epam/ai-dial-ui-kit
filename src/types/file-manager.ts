export enum DialFileManagerTabs {
  MyFiles = 'my_files',
  Shared = 'shared',
  Organization = 'organization',
  Review = 'review',
}

export enum DialFileManagerActions {
  AddSibling = 'addSibling',
  AddChild = 'addChild',
  Duplicate = 'duplicate',
  Copy = 'copy',
  Move = 'move',
  Download = 'download',
  Delete = 'delete',
  Rename = 'rename',
  Info = 'info',
  Unshare = 'unshare',
  RemoveAccess = 'removeAccess',
  ManagePermissions = 'managePermissions',
  Preview = 'preview',
  OpenInNewTab = 'openInNewTab',
}

export enum DialFileManagerConflictActions {
  Replace = 'replace',
  Duplicate = 'duplicate',
  Cancel = 'cancel',
}

export enum DialFileManagerConflictStrategies {
  ReplaceAll = 'replaceAll',
  DuplicateAll = 'duplicateAll',
  DecideForEach = 'decideForEach',
}

export enum DestinationFolderMode {
  Copy = 'copy',
  Move = 'move',
}

export enum FileManagerRenameTriggerView {
  Tree = 'tree',
  Grid = 'grid',
}

export enum FileManagerCreateFolderTriggerView {
  Tree = 'tree',
  Grid = 'grid',
}

export enum FileManagerCreateFolderType {
  Folder = 'folder',
  Child = 'child',
  Sibling = 'sibling',
}

export enum FileManagerColumnKey {
  Name = 'name',
  UpdatedAt = 'updatedAt',
  Size = 'size',
  Author = 'author',
  // Dial Chat–specific field required to show the owner of shared files and folders
  Owner = 'owner',
  Path = 'path',
  Actions = '__actions',
  Version = 'version',
}
