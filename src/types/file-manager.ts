import type { DialFileNodeType } from '@/models/file';

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
  Delete = 'delete',
}

export interface DialCopiedItem {
  sourceUrl: string;
  destinationUrl: string;
  overwrite?: boolean;
  nodeType: DialFileNodeType;
}
