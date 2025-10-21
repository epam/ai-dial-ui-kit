import type { DialModifiedEntity } from './base-entity';

export interface DialFile extends DialModifiedEntity {
  bucket?: string;
  contentLength?: number;
  contentType?: string;
  nodeType: DialFileNodeType;
  parentPath?: string | null;
  resourceType?: DialFileResourceType;
  url?: string;
  children?: DialFile[];
  items?: DialFile[];
  path: string;
  name?: string;
  folderId: string;
  updateTime: string;
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
