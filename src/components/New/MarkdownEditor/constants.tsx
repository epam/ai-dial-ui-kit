/*
 * `@uiw/react-md-editor` is an optional peer, so a consumer that never mounts
 * an editor does not install it — and a named value import of a package that
 * is not installed is a build error, not a runtime one: a bundler resolves
 * this module because the root entry re-exports `LazyMarkdownEditor`, sees
 * imports of names the stubbed-out optional peer does not export, and stops.
 * The commands are therefore read off the namespace inside the two getters
 * below, which run only once a consumer renders an editor — the point where
 * a missing engine is that consumer's own doing. `ICommand` stays a named
 * type import: types are erased before any bundler sees them.
 */
import * as mdEditor from '@uiw/react-md-editor';
import type { ICommand } from '@uiw/react-md-editor';
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

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';

/** 16px inside the 24px round toolbar buttons, matching the other 2.0
 *  components that pair `ElementSize.Small` controls with `DIAL_ICON_SIZE.SM`.
 *  Keep this in sync with the `svg { size-[16px] }` rule in
 *  `src/styles/markdown-editor.scss`, which wins over these width/height
 *  attributes. */
export const MARKDOWN_TOOLBAR_ICON_SIZE = DIAL_ICON_SIZE.SM;

/** Every glyph in the toolbar is the same weight and size, so the pair is
 *  spread rather than repeated at every command. */
const TOOLBAR_ICON_PROPS = {
  size: MARKDOWN_TOOLBAR_ICON_SIZE,
  stroke: DIAL_KIT_ICON_STROKE,
};

const withIcon = (command: ICommand, icon: ICommand['icon']): ICommand => ({
  ...command,
  icon,
});

/**
 * Left-hand formatting toolbar, built on top of `@uiw/react-md-editor`'s
 * built-in commands (which insert/toggle markdown syntax in the underlying
 * textarea) with icons and grouping matching the design.
 */
export const getMarkdownFormattingCommands = (): ICommand[] => {
  const {
    bold,
    code,
    divider,
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
  } = mdEditor;

  return [
    withIcon(bold, <IconBold {...TOOLBAR_ICON_PROPS} />),
    withIcon(italic, <IconItalic {...TOOLBAR_ICON_PROPS} />),
    withIcon(strikethrough, <IconStrikethrough {...TOOLBAR_ICON_PROPS} />),
    divider,
    group([heading1, heading2, heading3], {
      name: 'heading',
      groupName: 'heading',
      icon: <IconTextSize {...TOOLBAR_ICON_PROPS} />,
      buttonProps: { 'aria-label': 'Text style', title: 'Text style' },
    }),
    divider,
    withIcon(unorderedListCommand, <IconList {...TOOLBAR_ICON_PROPS} />),
    withIcon(orderedListCommand, <IconListNumbers {...TOOLBAR_ICON_PROPS} />),
    divider,
    withIcon(quote, <IconQuote {...TOOLBAR_ICON_PROPS} />),
    withIcon(link, <IconLink {...TOOLBAR_ICON_PROPS} />),
    withIcon(code, <IconCode {...TOOLBAR_ICON_PROPS} />),
    divider,
    withIcon(table, <IconTable {...TOOLBAR_ICON_PROPS} />),
  ];
};

/**
 * Right-hand toolbar: the built-in edit/live/preview mode switcher, each
 * with a distinct icon so the three states stay distinguishable even before
 * the active one is highlighted, followed by fullscreen.
 */
export const getMarkdownExtraCommands = (): ICommand[] => {
  const { codeEdit, codeLive, codePreview, divider, fullscreen } = mdEditor;

  return [
    withIcon(codeEdit, <IconPencil {...TOOLBAR_ICON_PROPS} />),
    withIcon(codeLive, <IconLayoutColumns {...TOOLBAR_ICON_PROPS} />),
    withIcon(codePreview, <IconEye {...TOOLBAR_ICON_PROPS} />),
    divider,
    withIcon(fullscreen, <IconMaximize {...TOOLBAR_ICON_PROPS} />),
  ];
};
