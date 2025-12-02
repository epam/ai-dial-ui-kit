export enum DialFileManagerTabs {
  MyFiles = 'my_files',
  Shared = 'shared',
  Organization = 'organization',
}

export enum DialFileManagerActions {
  Duplicate = 'duplicate',
  Copy = 'copy',
  Move = 'move',
  Rename = 'rename',
  Download = 'download',
  Delete = 'delete',
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
