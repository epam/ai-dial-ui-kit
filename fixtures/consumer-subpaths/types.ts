import type { ButtonProps } from '@epam/ai-dial-ui-kit';
import type { GridProps } from '@epam/ai-dial-ui-kit/grid';
import type { MarkdownEditorProps } from '@epam/ai-dial-ui-kit/editors';

type PublicTypes = [ButtonProps, GridProps, MarkdownEditorProps];

export const publicTypesResolve = true satisfies boolean;
export type { PublicTypes };
