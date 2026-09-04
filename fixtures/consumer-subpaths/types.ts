import type { ButtonProps } from '@epam/ai-dial-ui-kit';
import type { GridProps } from '@epam/ai-dial-ui-kit/grid';
import type { FileManagerGridRow } from '@epam/ai-dial-ui-kit/file-manager';
import type {
  DialMarkdownEditorContainerProps,
  MarkdownEditorProps,
} from '@epam/ai-dial-ui-kit/editors';

type PublicTypes = [
  ButtonProps,
  GridProps,
  FileManagerGridRow,
  MarkdownEditorProps,
  DialMarkdownEditorContainerProps,
];

export const publicTypesResolve = true satisfies boolean;
export type { PublicTypes };
