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
  IconColumns2,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconMaximize,
  IconQuote,
  IconSpacingHorizontal,
  IconStrikethrough,
  IconTextSize,
} from '@tabler/icons-react';

import { DIAL_ICON_SIZE } from '@/constants/icon';

export const MARKDOWN_TOOLBAR_ICON_SIZE = DIAL_ICON_SIZE.MD;

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
  withIcon(table, <IconColumns2 size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
];

/**
 * Right-hand toolbar: the built-in edit/live/preview mode switcher (all
 * three reuse the same icon in the design; only the active one is
 * highlighted via `.w-md-editor-toolbar li.active`) followed by fullscreen.
 */
export const getMarkdownExtraCommands = (): ICommand[] => [
  withIcon(
    codeEdit,
    <IconSpacingHorizontal size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
  ),
  withIcon(
    codeLive,
    <IconSpacingHorizontal size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
  ),
  withIcon(
    codePreview,
    <IconSpacingHorizontal size={MARKDOWN_TOOLBAR_ICON_SIZE} />,
  ),
  divider,
  withIcon(fullscreen, <IconMaximize size={MARKDOWN_TOOLBAR_ICON_SIZE} />),
];
