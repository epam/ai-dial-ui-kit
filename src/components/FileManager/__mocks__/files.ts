import {
  DialFileNodeType,
  DialFileResourceType,
  DialFilePermission,
  type DialFile,
} from '@/models/file';

/**
 * Helper to build a very deep nested folder chain:
 * All files/<rootName>/Level 01/.../Level NN
 * Adds a couple of files at various depths to emulate real structures.
 */
function buildDeepBranch(
  parent: { id: string; path: string },
  rootName: string,
  levels: number,
  startIndex = 1,
): DialFile {
  const rootId = `deep-${rootName.toLowerCase().replace(/\s+/g, '-')}`;
  const deepRoot: DialFile = {
    id: rootId,
    name: rootName,
    path: `${parent.path}/${rootName}`,
    parentPath: parent.path,
    nodeType: DialFileNodeType.FOLDER,
    folderId: parent.id,
    updatedAt: '2025-01-15',
    items: [],
  };

  let current = deepRoot;
  let parentId = rootId;

  for (let i = startIndex; i < startIndex + levels; i++) {
    const id = `${rootId}-l${String(i).padStart(2, '0')}`;
    const name = `Level ${String(i).padStart(2, '0')}`;
    const path = `${current.path}/${name}`;

    const folderNode: DialFile = {
      id,
      name,
      path,
      parentPath: current.path,
      nodeType: DialFileNodeType.FOLDER,
      folderId: parentId,
      updatedAt: `2025-01-${String(15 + Math.floor(i / 2)).padStart(2, '0')}`,
      items: [],
    };

    // Insert a file at some depths (3, 6, 9, 12, 15...) to increase complexity
    if (i % 3 === 0) {
      folderNode.items!.push({
        id: `${id}-readme`,
        name: `readme-l${String(i).padStart(2, '0')}.md`,
        path: `${path}/readme-l${String(i).padStart(2, '0')}.md`,
        parentPath: path,
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'md',
        contentType: 'text/markdown',
        folderId: id,
        updatedAt: `2025-01-${String(16 + Math.floor(i / 2)).padStart(2, '0')}`,
        permissions: [DialFilePermission.READ],
        contentLength: 1024,
      });
    }
    if (i % 5 === 0) {
      folderNode.items!.push({
        id: `${id}-asset`,
        name: `asset-l${String(i).padStart(2, '0')}.png`,
        path: `${path}/asset-l${String(i).padStart(2, '0')}.png`,
        parentPath: path,
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'png',
        contentType: 'image/png',
        contentLength: 204800,
        folderId: id,
        updatedAt: `2025-01-${String(17 + Math.floor(i / 2)).padStart(2, '0')}`,
        permissions: [DialFilePermission.READ, DialFilePermission.SHARE],
      });
    }

    current.items!.push(folderNode);
    current = folderNode;
    parentId = id;
  }

  return deepRoot;
}

/** A reasonably broad tree + a very deep nested branch for stress-testing. */
export const itemsMock: DialFile[] = [
  {
    id: 'root',
    name: 'All files',
    path: 'All files',
    parentPath: '',
    nodeType: DialFileNodeType.FOLDER,
    folderId: 'root',
    updatedAt: '2025-01-01',
    items: [
      // ─────────── Design (trimmed but still realistic)
      {
        id: 'design',
        name: 'Design',
        path: 'All files/Design',
        parentPath: 'All files',
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'root',
        updatedAt: '2025-01-03',
        items: [
          {
            id: 'design-icons',
            name: 'Icons',
            path: 'All files/Design/Icons',
            parentPath: 'All files/Design',
            nodeType: DialFileNodeType.FOLDER,
            folderId: 'design',
            updatedAt: '2025-01-05',
            items: [
              {
                id: 'icons-svg',
                name: 'SVG',
                path: 'All files/Design/Icons/SVG',
                parentPath: 'All files/Design/Icons',
                nodeType: DialFileNodeType.FOLDER,
                folderId: 'design-icons',
                updatedAt: '2025-01-06',
                items: [
                  {
                    id: 'icons-svg-24',
                    name: '24px',
                    path: 'All files/Design/Icons/SVG/24px',
                    parentPath: 'All files/Design/Icons/SVG',
                    nodeType: DialFileNodeType.FOLDER,
                    folderId: 'icons-svg',
                    updatedAt: '2025-01-06',
                    items: [
                      {
                        id: 'ico-alert',
                        name: 'alert.svg',
                        path: 'All files/Design/Icons/SVG/24px/alert.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 5120,
                      },
                      {
                        id: 'ico-settings',
                        name: 'settings.svg',
                        path: 'All files/Design/Icons/SVG/24px/settings.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 61440 * 1000,
                      },
                      {
                        id: '.hidden-file',
                        name: '.hidden-file',
                        path: 'All files/Design/Icons/SVG/24px/.hidden-file',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'txt',
                        contentType: 'text/plain',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 128,
                      },
                      {
                        id: '.hidden-folder',
                        name: '.hidden-folder',
                        path: 'All files/Design/Icons/SVG/24px/.hidden-folder',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.FOLDER,
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        items: [
                          {
                            id: 'inside-hidden',
                            name: 'inside-hidden.txt',
                            path: 'All files/Design/Icons/SVG/24px/.hidden-folder/inside-hidden.txt',
                            parentPath:
                              'All files/Design/Icons/SVG/24px/.hidden-folder',
                            nodeType: DialFileNodeType.ITEM,
                            resourceType: DialFileResourceType.FILE,
                            extension: 'txt',
                            contentType: 'text/plain',
                            folderId: '.hidden-folder',
                            updatedAt: '2025-01-10',
                            contentLength: 256,
                          },
                        ],
                      },
                      {
                        id: 'ico-long-name',
                        name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.svg",
                        path: "All files/Design/Icons/SVG/24px/Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.svg",
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 12,
                      },
                      {
                        id: 'logo-svg',
                        name: 'logo.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 5120,
                      },
                      {
                        id: 'logo-extended-svg',
                        name: 'logo-extended-version-with-huge-filename-to-test-ui-behavior.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo-extended-version-with-huge-filename-to-test-ui-behavior.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 15120,
                      },
                      {
                        id: 'logo-extended-svg-2',
                        name: 'logo-extended-version-with-huge-filename-to-test-ui-behavior-2.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo-extended-version-with-huge-filename-to-test-ui-behavior-2.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 15120,
                      },
                      {
                        id: 'logo-extended-svg-3',
                        name: 'logo-extended-version-with-huge-filename-to-test-ui-behavior-3.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo-extended-version-with-huge-filename-to-test-ui-behavior-3.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 15120,
                      },
                      {
                        id: 'logo-extended-svg-4',
                        name: 'logo-extended-version-with-huge-filename-to-test-ui-behavior-4.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo-extended-version-with-huge-filename-to-test-ui-behavior-4.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 15120,
                      },
                      {
                        id: 'logo-svg-5',
                        name: 'logo-5.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo-5.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 15120,
                      },
                      {
                        id: 'logo-svg-6',
                        name: 'logo-6.svg',
                        path: 'All files/Design/Icons/SVG/24px/logo-6.svg',
                        parentPath: 'All files/Design/Icons/SVG/24px',
                        nodeType: DialFileNodeType.ITEM,
                        resourceType: DialFileResourceType.FILE,
                        extension: 'svg',
                        contentType: 'image/svg+xml',
                        folderId: 'icons-svg-24',
                        updatedAt: '2025-01-10',
                        contentLength: 15120,
                      },
                    ],
                  },
                ],
              },
              {
                id: 'icons-png',
                name: 'PNG',
                path: 'All files/Design/Icons/PNG',
                parentPath: 'All files/Design/Icons',
                nodeType: DialFileNodeType.FOLDER,
                folderId: 'design-icons',
                updatedAt: '2025-01-06',
                items: [
                  {
                    id: 'png-hero',
                    name: 'hero.png',
                    path: 'All files/Design/Icons/PNG/hero.png',
                    parentPath: 'All files/Design/Icons/PNG',
                    nodeType: DialFileNodeType.ITEM,
                    resourceType: DialFileResourceType.FILE,
                    extension: 'png',
                    contentType: 'image/png',
                    folderId: 'icons-png',
                    updatedAt: '2025-01-06',
                  },
                ],
              },
            ],
          },
          {
            id: 'design-mockups',
            name: 'Mockups',
            path: 'All files/Design/Mockups',
            parentPath: 'All files/Design',
            nodeType: DialFileNodeType.FOLDER,
            folderId: 'design',
            updatedAt: '2025-01-11',
            items: [
              {
                id: 'mock-home',
                name: 'homepage.fig',
                path: 'All files/Design/Mockups/homepage.fig',
                parentPath: 'All files/Design/Mockups',
                nodeType: DialFileNodeType.ITEM,
                resourceType: DialFileResourceType.FILE,
                extension: 'fig',
                contentType: 'application/octet-stream',
                folderId: 'design-mockups',
                updatedAt: '2025-01-12',
              },
            ],
          },
          {
            id: 'long-name-without-spaces-design-folder-to-test-ui-behavior',
            name: 'ThisIsAVeryLongFolderNameWithoutSpacesToTestTheUIBehaviorInDifferentComponents.png',
            path: '/All files/Design/ThisIsAVeryLongFolderNameWithoutSpacesToTestTheUIBehaviorInDifferentComponents',
            parentPath: '/All files/Design',
            nodeType: DialFileNodeType.ITEM,
            folderId: 'design',
            updatedAt: '2025-01-11',
            items: [],
          },
        ],
      },

      // ─────────── Hidden folder and files at root level
      {
        id: 'hidden-root-folder',
        name: '.hidden-root-folder',
        path: 'All files/.hidden-root-folder',
        parentPath: 'All files',
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'root',
        updatedAt: '2025-01-13',
        items: [
          {
            id: 'inside-hidden-root',
            name: 'inside-hidden-root.txt',
            path: 'All files/.hidden-root-folder/inside-hidden-root.txt',
            parentPath: 'All files/.hidden-root-folder',
            nodeType: DialFileNodeType.ITEM,
            resourceType: DialFileResourceType.FILE,
            extension: 'txt',
            contentType: 'text/plain',
            folderId: 'hidden-root-folder',
            updatedAt: '2025-01-13',
          },
          {
            id: '.hidden-file-in-hidden-folder',
            name: '.hidden-file-in-hidden-folder.txt',
            path: 'All files/.hidden-root-folder/.hidden-file-in-hidden-folder.txt',
            parentPath: 'All files/.hidden-root-folder',
            nodeType: DialFileNodeType.ITEM,
            resourceType: DialFileResourceType.FILE,
            extension: 'txt',
            contentType: 'text/plain',
            folderId: 'hidden-root-folder',
            updatedAt: '2025-01-13',
          },
        ],
      },

      // ─────────── Media (trimmed)
      {
        id: 'media',
        name: 'Media',
        path: 'All files/Media',
        parentPath: 'All files',
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'root',
        updatedAt: '2025-01-04',
        items: [
          {
            id: 'media-photos',
            name: 'Photos',
            path: 'All files/Media/Photos',
            parentPath: 'All files/Media',
            nodeType: DialFileNodeType.FOLDER,
            folderId: 'media',
            updatedAt: '2025-01-08',
            items: [
              {
                id: 'photos-2025',
                name: '2025',
                path: 'All files/Media/Photos/2025',
                parentPath: 'All files/Media/Photos',
                nodeType: DialFileNodeType.FOLDER,
                folderId: 'media-photos',
                updatedAt: '2025-01-14',
                items: [
                  {
                    id: 'photo-team',
                    name: 'team.jpg',
                    path: 'All files/Media/Photos/2025/team.jpg',
                    parentPath: 'All files/Media/Photos/2025',
                    nodeType: DialFileNodeType.ITEM,
                    resourceType: DialFileResourceType.FILE,
                    extension: 'jpg',
                    contentType: 'image/jpeg',
                    folderId: 'photos-2025',
                    updatedAt: '2025-01-14',
                  },
                ],
              },
            ],
          },
          {
            id: 'media-video',
            name: 'Video',
            path: 'All files/Media/Video',
            parentPath: 'All files/Media',
            nodeType: DialFileNodeType.FOLDER,
            folderId: 'media',
            updatedAt: '2025-01-09',
            items: [
              {
                id: 'video-promo',
                name: 'promo.mp4',
                path: 'All files/Media/Video/promo.mp4',
                parentPath: 'All files/Media/Video',
                nodeType: DialFileNodeType.ITEM,
                resourceType: DialFileResourceType.FILE,
                extension: 'mp4',
                contentType: 'video/mp4',
                folderId: 'media-video',
                updatedAt: '2025-01-09',
              },
            ],
          },
        ],
      },

      // ─────────── Some simple folders
      {
        id: 'f1',
        name: 'Folder 1',
        path: 'All files/Folder 1',
        parentPath: 'All files',
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'root',
        updatedAt: '2025-01-01',
        items: [
          {
            id: 'f1-notes',
            name: 'notes.txt',
            path: 'All files/Folder 1/notes.txt',
            parentPath: 'All files/Folder 1',
            nodeType: DialFileNodeType.ITEM,
            resourceType: DialFileResourceType.FILE,
            extension: 'txt',
            contentType: 'text/plain',
            folderId: 'f1',
            updatedAt: '2025-01-02',
          },
        ],
      },
      {
        id: 'f2',
        name: 'Folder 2',
        path: 'All files/Folder 2',
        parentPath: 'All files',
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'root',
        updatedAt: '2025-01-02',
        items: [
          {
            id: 'f2-a',
            name: 'Sub A',
            path: 'All files/Folder 2/Sub A',
            parentPath: 'All files/Folder 2',
            nodeType: DialFileNodeType.FOLDER,
            folderId: 'f2',
            updatedAt: '2025-01-02',
            items: [
              {
                id: 'f2-a-1',
                name: 'doc-a1.pdf',
                path: 'All files/Folder 2/Sub A/doc-a1.pdf',
                parentPath: 'All files/Folder 2/Sub A',
                nodeType: DialFileNodeType.ITEM,
                resourceType: DialFileResourceType.FILE,
                extension: 'pdf',
                contentType: 'application/pdf',
                folderId: 'f2-a',
                updatedAt: '2025-01-03',
              },
            ],
          },
        ],
      },
      {
        id: 'long-f1',
        name: 'This is a very long folder name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI',
        path: 'All files/This is a very long folder name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI',
        parentPath: 'All files',
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'root',
        updatedAt: '2025-01-01',
        items: [
          {
            id: 'long-f1-notes',
            name: 'This is a very long file name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI.txt',
            path: 'All files/This is a very long folder name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI/This is a very long file name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI.txt',
            parentPath:
              'All files/This is a very long folder name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI',
            nodeType: DialFileNodeType.ITEM,
            resourceType: DialFileResourceType.FILE,
            extension: 'txt',
            contentType: 'text/plain',
            folderId: 'f1',
            updatedAt: '2025-01-02',
          },
        ],
      },

      // ─────────── Very deep nested branches
      buildDeepBranch({ id: 'root', path: 'All files' }, 'Deep Nest', 14),
      buildDeepBranch({ id: 'root', path: 'All files' }, 'Ultra Depth', 18),
      buildDeepBranch({ id: 'root', path: 'All files' }, 'Labyrinth', 22),
    ],
  },
];
