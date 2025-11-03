export enum DialFileManagerTabs {
  MyFiles = 'my_files',
  Shared = 'shared',
  Organization = 'organization',
}

export enum DialFileManagerActions {
  Copy = 'copy',
  Cut = 'cut',
  Paste = 'paste',
  Rename = 'rename',
}

export interface CopiedItem {
  sourceUrl: string;
  destinationUrl: string;
  overwrite?: boolean;
}
