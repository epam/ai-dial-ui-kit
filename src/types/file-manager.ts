import type { DialFileNodeType } from '@/models/file';

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

export interface DialCopiedItem {
  sourceUrl: string;
  destinationUrl: string;
  overwrite?: boolean;
  nodeType: DialFileNodeType;
}

export interface DialDeletedItem {
  sourceUrl: string;
  nodeType: DialFileNodeType;
}

export interface DialUploadFileItem {
  fileContent: File;
  name: string;
}
