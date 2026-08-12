import {
  bold,
  code,
  codeEdit,
  codeLive,
  codePreview,
  divider,
  fullscreen,
  group,
  heading1,
  heading2,
  heading3,
  italic,
  link,
  orderedListCommand,
  quote,
  strikethrough,
  table,
  unorderedListCommand,
  type ICommand,
} from '@uiw/react-md-editor';
import {
  IconBold,
  IconCode,
  IconEye,
  IconItalic,
  IconLayoutColumns,
  IconLink,
  IconList,
  IconListNumbers,
  IconMaximize,
  IconPencil,
  IconQuote,
  IconStrikethrough,
  IconTable,
  IconTextSize,
} from '@tabler/icons-react';

import { DIAL_ICON_SIZE } from '@/constants/icon';

/** 16px inside the 24px round toolbar buttons, matching the other 2.0
 *  components that pair `ElementSize.Small` controls with `DIAL_ICON_SIZE.SM`.
 *  Keep this in sync with the `svg { size-[16px] }` rule in
 *  `src/styles/markdown-editor.scss`, which wins over these width/height
 *  attributes. */
export const MARKDOWN_TOOLBAR_ICON_SIZE = DIAL_ICON_SIZE.SM;

const withIcon = (command: ICommand, icon: ICommand['icon']): ICommand => ({
  ...command,
  icon,
});

/**
 * Left-hand formatting toolbar, built on top of `@uiw/react-md-editor`'s
 * built-in commands (which insert/toggle markdown syntax in the underlying
 * textarea) with icons and grouping matching the design.
 */
export const getMarkdownFormattingCommands = (): ICommand[] => [
  withIcon(bold, <IconBold size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  withIcon(italic, <IconItalic size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  withIcon(
    strikethrough,
    <IconStrikethrough size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
  ),
  divider,
  group([heading1, heading2, heading3], {
    name: 'heading',
    groupName: 'heading',
    icon: <IconTextSize size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
    buttonProps: { 'aria-label': 'Text style', title: 'Text style' },
  }),
  divider,
  withIcon(
    unorderedListCommand,
    <IconList size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
  ),
  withIcon(
    orderedListCommand,
    <IconListNumbers size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
  ),
  divider,
  withIcon(quote, <IconQuote size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  withIcon(link, <IconLink size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  withIcon(code, <IconCode size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  divider,
  withIcon(table, <IconTable size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
];

/**
 * Right-hand toolbar: the built-in edit/live/preview mode switcher, each
 * with a distinct icon so the three states stay distinguishable even before
 * the active one is highlighted, followed by fullscreen.
 */
export const getMarkdownExtraCommands = (): ICommand[] => [
  withIcon(codeEdit, <IconPencil size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  withIcon(codeLive, <IconLayoutColumns size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  withIcon(codePreview, <IconEye size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
  divider,
  withIcon(fullscreen, <IconMaximize size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
];
