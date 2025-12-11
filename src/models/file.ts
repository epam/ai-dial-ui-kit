import type { DialModifiedEntity } from './base-entity';

export interface DialFile extends DialModifiedEntity {
  bucket?: string;
  contentLength?: number;
  contentType?: string;
  nodeType: DialFileNodeType;
  parentPath?: string | null;
  resourceType?: DialFileResourceType;
  url?: string;
  items?: DialFile[];
  path: string;
  name: string;
  folderId: string;
  // Dial Chat–specific field required to show the owner of shared files and folders
  owner?: string;
  author?: string;
  nextToken?: string;
  extension?: string;
  id?: string;
  permissions?: DialFilePermission[];
}

export enum DialFileNodeType {
  ITEM = 'item',
  FOLDER = 'folder',
}

export enum DialFileResourceType {
  FILE = 'FILE',
  PROMPT = 'PROMPT',
  CONVERSATION = 'CONVERSATION',
  APPLICATION = 'APPLICATION',
  TOOLSET = 'TOOL_SET',
}

export enum DialFilePermission {
  READ = 'READ',
  WRITE = 'WRITE',
  SHARE = 'SHARE',
}

export interface DialRootFolder extends DialFile {
  label: string;
}
