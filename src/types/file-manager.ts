export enum DialFileManagerTabs {
  MyFiles = 'my_files',
  Shared = 'shared',
  Organization = 'organization',
}

export enum DialFileManagerActions {
  Duplicate = 'duplicate',
  Copy = 'copy',
  Move = 'move',
  Download = 'download',
  Delete = 'delete',
  Rename = 'rename',
  Info = 'info',
  Unshare = 'unshare',
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

export enum FileManagerColumnKey {
  Name = 'name',
  UpdatedAt = 'updatedAt',
  Size = 'size',
  Author = 'author',
  Actions = '__actions',
}
