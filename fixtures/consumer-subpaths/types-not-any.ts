/*
 * A declaration that fails to resolve does not always error: with
 * `skipLibCheck` the unresolved export silently becomes `any`, and every use
 * of it type-checks (issue #1025). Each line below only compiles while its
 * type is real - if it decays to `any`, the `@ts-expect-error` is unused and
 * `tsc` fails.
 */
import type { ButtonProps } from '@epam/ai-dial-ui-kit';
import type { GridProps } from '@epam/ai-dial-ui-kit/grid';
import type { MarkdownEditorProps } from '@epam/ai-dial-ui-kit/editors';

// @ts-expect-error - a number is not ButtonProps
export const rootTypeIsReal: ButtonProps = 123;
// @ts-expect-error - a number is not GridProps
export const gridTypeIsReal: GridProps = 123;
// @ts-expect-error - a number is not MarkdownEditorProps
export const editorsTypeIsReal: MarkdownEditorProps = 123;
