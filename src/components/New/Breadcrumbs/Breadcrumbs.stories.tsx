import { IconFolder, IconSlash } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { BreadcrumbsSize } from '@/types/breadcrumbs';
import { Breadcrumbs, type BreadcrumbsItem } from './Breadcrumbs';

const FILE_PATH: BreadcrumbsItem[] = [
  { label: 'My files', href: '#' },
  { label: 'DK Test', href: '#' },
  { label: 'DK Test with nested' },
];

const DEEP_PATH: BreadcrumbsItem[] = [
  { label: 'My files', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Q3 planning', href: '#' },
  { label: 'Research', href: '#' },
  { label: 'Interviews', href: '#' },
  { label: 'Transcripts' },
];

const meta = {
  title: 'Components_2_0/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A navigation trail: where the user is, and every level they can step back to. An `<ol>` inside a named `<nav>`, with `aria-current="page"` on the last segment, which is never a control. The trail never wraps — segments truncate, and a long trail collapses its middle behind an ellipsis menu.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The trail, outermost first; the last entry is the current page',
    },
    maxVisibleItems: {
      control: { type: 'number', min: 3, max: 8 },
      description:
        'Segments drawn before the middle collapses behind an ellipsis menu',
    },
    size: {
      control: 'inline-radio',
      options: Object.values(BreadcrumbsSize),
      description:
        "The trail's type scale: `dial-small-text` or `dial-h2-text`",
    },
    separator: {
      control: false,
      description:
        'Node drawn between two segments; defaults to a right chevron',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the `<nav>`',
    },
    overflowAriaLabel: {
      control: 'text',
      description: 'Accessible name for the ellipsis button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the `<nav>`',
    },
    itemClassName: {
      control: 'text',
      description: 'Additional CSS classes applied to every segment',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: FILE_PATH, ariaLabel: 'File path' },
};

export const WithRootIcon: Story = {
  args: {
    ariaLabel: 'File path',
    items: [
      {
        label: 'My files',
        href: '#',
        icon: (
          <IconFolder
            size={DIAL_ICON_SIZE.SM}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
          />
        ),
      },
      ...FILE_PATH.slice(1),
    ],
  },
};

export const Heading: Story = {
  args: {
    items: FILE_PATH,
    ariaLabel: 'File path',
    size: BreadcrumbsSize.Heading,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`BreadcrumbsSize.Heading` draws the trail at `dial-h2-text`, for a path that doubles as the page title. The token is semibold, so every segment is — the current page included.',
      },
    },
  },
};

export const Collapsed: Story = {
  args: { items: DEEP_PATH, ariaLabel: 'File path' },
  parameters: {
    docs: {
      description: {
        story:
          'A trail longer than `maxVisibleItems` (4 by default) hides its middle behind the ellipsis. The root and the current page always stay on screen.',
      },
    },
  },
};

export const MoreVisibleSegments: Story = {
  args: { items: DEEP_PATH, maxVisibleItems: 5, ariaLabel: 'File path' },
};

export const CustomSeparator: Story = {
  args: {
    items: FILE_PATH,
    ariaLabel: 'File path',
    separator: (
      <IconSlash
        size={DIAL_ICON_SIZE.SM}
        stroke={DIAL_KIT_ICON_STROKE}
        aria-hidden="true"
      />
    ),
  },
};

export const Truncated: Story = {
  args: {
    ariaLabel: 'File path',
    items: [
      { label: 'My files', href: '#' },
      {
        label: 'A folder with a name far too long to fit the row it sits in',
        href: '#',
      },
      { label: 'Another long name that has to give way to the one before it' },
    ],
    className: 'max-w-[420px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each segment reveals its full label in a tooltip only once it is actually clipped. The root keeps its width, the middle gives way first, and the current page keeps the largest share of what is left.',
      },
    },
  },
};

export const ReadOnlyPath: Story = {
  args: {
    ariaLabel: 'Location',
    items: [
      { label: 'Shared with me' },
      { label: 'Team space' },
      { label: 'Reports' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Segments with neither `href` nor `onClick` are drawn as plain text, so the trail reads as a location rather than as navigation.',
      },
    },
  },
};

const Navigable = () => {
  const [path, setPath] = useState(['My files', 'Projects', 'Q3 planning']);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs
        ariaLabel="File path"
        items={path.map((label, index) => ({
          label,
          ...(index === path.length - 1
            ? {}
            : { onClick: () => setPath(path.slice(0, index + 1)) }),
        }))}
      />
      <button
        type="button"
        className="dial-small-text self-start text-accent"
        onClick={() => setPath([...path, `Folder ${path.length}`])}
      >
        Go deeper
      </button>
    </div>
  );
};

export const Interactive: Story = {
  args: { items: FILE_PATH },
  render: () => <Navigable />,
  parameters: {
    docs: {
      description: {
        story:
          'A router-less trail: every segment but the last carries an `onClick`, so it renders as a button and walks the path back up. Add enough levels and the middle collapses on its own.',
      },
    },
  },
};
