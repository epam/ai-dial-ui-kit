import type { DialFileNodeType } from './file';

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
