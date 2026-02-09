import { expect, it, describe } from 'vitest';
import {
  DEFAULT_CONTENT_TYPE,
  wrapInRootFolder,
} from '../flat-to-hierarchy-convertor';

const flat = [
  {
    bucket: 'public',
    name: 'public',
    nodeType: 'FOLDER',
    parentPath: '',
    updatedAt: 1760441105058,
    url: 'prompts/public/',
  },
  {
    bucket: 'public',
    name: 'Folder parent',
    nodeType: 'FOLDER',
    parentPath: null,
    updatedAt: 1760441105034,
    url: 'prompts/public/Folder parent/',
  },
  {
    bucket: 'public',
    name: 'Folder child',
    nodeType: 'FOLDER',
    parentPath: 'Folder parent/Folder child',
    updatedAt: 1760441105034,
    url: 'prompts/public/Folder parent/Folder child/',
  },
  {
    bucket: 'public',
    name: 'Prompt in parent__0.0.1',
    nodeType: 'ITEM',
    parentPath: 'Folder parent',
    updatedAt: 1760441105034,
    url: 'prompts/public/Folder parent/Prompt in parent__0.0.1',
    resourceType: 'PROMPT',
  },
  {
    bucket: 'public',
    name: 'Prompt in child',
    nodeType: 'ITEM',
    parentPath: 'Folder parent/Folder child',
    updatedAt: 1760441105034,
    url: 'prompts/public/Folder parent/Folder child/Prompt in child__0.0.1',
    resourceType: 'PROMPT',
  },
  {
    bucket: 'public',
    name: 'Folder parent 2',
    nodeType: 'FOLDER',
    parentPath: null,
    updatedAt: 1760441105034,
    url: 'prompts/public/Folder parent 2/',
  },
];

const hierarchical = [
  {
    folderId: 'root',
    id: 'root',
    name: 'Prompts',
    nodeType: 'folder',
    parentPath: '',
    path: 'prompts/public/',
    items: [
      {
        bucket: 'public',
        folderId: 'root',
        id: 'prompts/public/Folder parent/',
        items: [
          {
            bucket: 'public',
            folderId: 'root',
            id: 'prompts/public/Folder parent/Folder child/',
            items: [
              {
                bucket: 'public',
                contentLength: 0,
                contentType: DEFAULT_CONTENT_TYPE,
                extension: '',
                folderId: 'root',
                id: 'prompts/public/Folder parent/Folder child/Prompt in child__0.0.1',
                items: undefined,
                name: 'Prompt in child',
                nodeType: 'item',
                originalPath:
                  'prompts/public/Folder parent/Folder child/Prompt in child__0.0.1',
                parentPath: 'Folder parent/Folder child/',
                path: 'prompts/public/Folder parent/Folder child/Prompt in child__0.0.1',
                resourceType: 'PROMPT',
                updatedAt: '2025-10-14T11:25:05.034Z',
                url: 'prompts/public/Folder parent/Folder child/Prompt in child__0.0.1',
              },
            ],
            name: 'Folder child',
            nodeType: 'folder',
            originalPath: 'prompts/public/Folder parent/Folder child/',
            parentPath: 'Folder parent/Folder child/',
            path: 'prompts/public/Folder parent/Folder child/',
            resourceType: undefined,
            updatedAt: '2025-10-14T11:25:05.034Z',
            url: 'prompts/public/Folder parent/Folder child/',
          },
          {
            bucket: 'public',
            contentLength: 0,
            contentType: DEFAULT_CONTENT_TYPE,
            extension: '1',
            folderId: 'root',
            id: 'prompts/public/Folder parent/Prompt in parent__0.0.1',
            items: undefined,
            name: 'Prompt in parent__0.0.1',
            nodeType: 'item',
            originalPath:
              'prompts/public/Folder parent/Prompt in parent__0.0.1',
            parentPath: 'Folder parent/',
            path: 'prompts/public/Folder parent/Prompt in parent__0.0.1',
            resourceType: 'PROMPT',
            updatedAt: '2025-10-14T11:25:05.034Z',
            url: 'prompts/public/Folder parent/Prompt in parent__0.0.1',
          },
        ],
        name: 'Folder parent',
        nodeType: 'folder',
        originalPath: 'prompts/public/Folder parent/',
        parentPath: 'prompts/public/',
        path: 'prompts/public/Folder parent/',
        resourceType: undefined,
        updatedAt: '2025-10-14T11:25:05.034Z',
        url: 'prompts/public/Folder parent/',
      },
      {
        bucket: 'public',
        folderId: 'root',
        id: 'prompts/public/Folder parent 2/',
        items: [],
        name: 'Folder parent 2',
        nodeType: 'folder',
        originalPath: 'prompts/public/Folder parent 2/',
        parentPath: 'prompts/public/',
        path: 'prompts/public/Folder parent 2/',
        resourceType: undefined,
        updatedAt: '2025-10-14T11:25:05.034Z',
        url: 'prompts/public/Folder parent 2/',
      },
    ],
  },
];

describe('convertFlatToHierarchical', () => {
  it('should transform flat to hierarchical structure', () => {
    const result = wrapInRootFolder(flat);
    expect(result).toEqual(hierarchical);
  });
});
