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

export interface DialFileManagerActionsRef {
  createFolder: () => void;
}

export type DialFileAcceptType =
  | `${string}/${string}` // MIME (wildcard)
  | `.${string}`; // extension
