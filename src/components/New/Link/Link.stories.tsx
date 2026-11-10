import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';

import { LinkVariant } from '@/types/link';
import { ElementSize } from '@/types/size';
import { Link, type LinkProps } from './Link';

const meta = {
  title: 'Components_2_0/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An underlined text link for running copy, always rendered as an `<a>`. Has all properties from the standard `AnchorHTMLAttributes<HTMLAnchorElement>`, extended with `variant`, `size` and `disabled`. For a button-shaped link use `Button` with `ButtonAppearance.Link`; on an inverted surface, `ButtonVariant.Inverted`.',
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Link content',
    },
    href: {
      control: { type: 'text' },
      description: 'Destination of the link',
    },
    variant: {
      control: { type: 'select' },
      options: Object.values(LinkVariant),
      description:
        'Color family: `primary` (accent, semibold), `neutral` (primary text, regular) or `inverted` (for an inverted surface, semibold)',
    },
    size: {
      control: { type: 'select' },
      options: [ElementSize.Standard, ElementSize.Small],
      description: 'Link size: `standard` (14/24) or `small` (12/16)',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Drops the `href`, leaves the tab order and marks the link `aria-disabled`',
    },
    target: {
      control: { type: 'select' },
      options: [undefined, '_self', '_blank'],
      description:
        'Anchor target. `_blank` adds `rel="noopener noreferrer"` unless `rel` is set',
    },
    rel: {
      control: { type: 'text' },
      description: 'Anchor `rel`',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the anchor',
    },
  },
  args: {
    children: 'Read the documentation',
    href: '#documentation',
    variant: LinkVariant.Primary,
    size: ElementSize.Standard,
    disabled: false,
  },
} satisfies Meta<LinkProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div
      className={
        args.variant === LinkVariant.Inverted
          ? 'rounded-xl bg-control-inverted p-6'
          : undefined
      }
    >
      <Link {...args} />
    </div>
  ),
};

const STATES = [
  { label: 'Default', id: 'default' },
  { label: 'Hover', id: 'hover' },
  { label: 'Active', id: 'active' },
  { label: 'Focus', id: 'focus' },
  { label: 'Disable', id: 'disable', disabled: true },
];

const COLUMNS = [
  { title: 'Primary', variant: LinkVariant.Primary },
  { title: 'Neutral', variant: LinkVariant.Neutral },
  { title: 'Inverted', variant: LinkVariant.Inverted },
];

const SIZES = [ElementSize.Standard, ElementSize.Small];

const stateId = (variant: LinkVariant, state: string, size: ElementSize) =>
  `link-${variant}-${state}-${size}`;

const pseudoIds = (state: string) =>
  COLUMNS.flatMap(({ variant }) =>
    SIZES.map((size) => `#${stateId(variant, state, size)}`),
  );

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-8 gap-y-4">
      <span />
      {COLUMNS.map(({ title }) => (
        <span key={title} className="text-center font-semibold text-primary">
          {title}
        </span>
      ))}
      {STATES.map(({ label, id, disabled }) => (
        <Fragment key={id}>
          <span className="text-sm text-secondary">{label}</span>
          {COLUMNS.map(({ title, variant }) => (
            <div
              key={title}
              className={
                variant === LinkVariant.Inverted
                  ? 'flex items-center gap-x-4 rounded-lg bg-control-inverted px-4 py-2'
                  : 'flex items-center gap-x-4 px-4 py-2'
              }
            >
              {SIZES.map((size) => (
                <Link
                  key={size}
                  id={stateId(variant, id, size)}
                  href="#link"
                  variant={variant}
                  size={size}
                  disabled={disabled}
                >
                  Link
                </Link>
              ))}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  ),
  parameters: {
    pseudo: {
      hover: pseudoIds('hover'),
      active: pseudoIds('active'),
      focusVisible: pseudoIds('focus'),
    },
    docs: {
      description: {
        story:
          'Primary, Neutral and Inverted links in their standard and small sizes, across default, hover, active, focus and disabled states. The Inverted column sits on the `bg-control-inverted` surface it is designed for.',
      },
    },
  },
};

export const Inverted: Story = {
  args: { variant: LinkVariant.Inverted },
  render: (args) => (
    <div className="flex max-w-[320px] flex-col gap-3 rounded-xl bg-control-inverted p-4 dial-small-text text-control-inverted">
      <p>
        Lets the model write and execute Python in an isolated sandbox. See{' '}
        <Link {...args} href="#sandbox">
          how the sandbox works
        </Link>
        .
      </p>
      <p className="dial-tiny-text">
        Small:{' '}
        <Link {...args} href="#limits" size={ElementSize.Small}>
          usage limits
        </Link>
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`LinkVariant.Inverted` on an inverted panel, such as a `Tooltip` or `InteractiveTooltip`.',
      },
    },
  },
};

export const InText: Story = {
  render: () => (
    <div className="flex max-w-[480px] flex-col gap-4 text-primary">
      <p className="dial-small-paragraph-text">
        Models answer from what they learned in training. To ground an answer in
        current data, enable a{' '}
        <Link href="#tools">tool such as web search</Link>, or read the{' '}
        <Link href="#guide" variant={LinkVariant.Neutral}>
          prompting guide
        </Link>{' '}
        first.
      </p>
      <p className="dial-tiny-text">
        Small text with a{' '}
        <Link href="#primary-small" size={ElementSize.Small}>
          primary link
        </Link>{' '}
        and a{' '}
        <Link
          href="#neutral-small"
          size={ElementSize.Small}
          variant={LinkVariant.Neutral}
        >
          neutral link
        </Link>
        .
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Links inside a paragraph. Each size keeps the paragraph leading of the design (24px standard, 16px small), so it matches `dial-small-paragraph-text` / `dial-tiny-text` body copy without stretching the line.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'A disabled link drops its `href`, suppresses `onClick`, leaves the tab order and is marked `aria-disabled`. It keeps `role="link"`, so assistive technology still announces it as an unavailable link.',
      },
    },
  },
};

export const NewTab: Story = {
  args: {
    href: 'https://epam.github.io/ai-dial/',
    target: '_blank',
    children: 'Open AI DIAL in a new tab',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`target="_blank"` gets `rel="noopener noreferrer"` unless `rel` is set explicitly.',
      },
    },
  },
};
