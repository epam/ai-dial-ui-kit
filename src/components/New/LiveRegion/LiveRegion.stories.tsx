import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { LiveRegionElement, LiveRegionPoliteness } from '@/types/live-region';
import { Button } from '@/components/New/Button/Button';
import { ErrorText } from '@/components/New/CaptionText/CaptionText';
import { LiveRegion } from './LiveRegion';

const meta = {
  title: 'Components_2_0/LiveRegion',
  component: LiveRegion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An always-mounted live region: the wrapper is rendered even while empty, so a screen reader announces the first message put into it. Use it for messages not tied to one control (a failed submit, an async status, no results). A field error is linked with `aria-describedby` instead (or `ErrorText` with `announce`), and `Notification` is already a live region. An empty visible region takes no space through `empty:sr-only` rather than `display: none`, which some screen readers drop from the accessibility tree.',
      },
    },
  },
  argTypes: {
    politeness: {
      control: { type: 'select' },
      options: Object.values(LiveRegionPoliteness),
      description:
        '`polite` → `role="status"` + `aria-live="polite"`; `assertive` → `role="alert"` + `aria-live="assertive"`.',
    },
    visuallyHidden: {
      control: { type: 'boolean' },
      description: 'Hide the region visually; it is still announced.',
    },
    atomic: {
      control: { type: 'boolean' },
      description: 'Sets `aria-atomic`.',
    },
    as: {
      control: { type: 'select' },
      options: Object.values(LiveRegionElement),
      description: 'The wrapper element.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the wrapper.',
    },
  },
  args: {
    children: 'Changes saved',
  },
} satisfies Meta<typeof LiveRegion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Assertive: Story = {
  args: {
    politeness: LiveRegionPoliteness.Assertive,
    children: <ErrorText text="Could not save. Try again." />,
  },
};

export const VisuallyHidden: Story = {
  args: {
    visuallyHidden: true,
    children: '3 results',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Read by a screen reader, not drawn. Inspect the DOM to see the region.',
      },
    },
  },
};

const SubmitDemo = () => {
  const [error, setError] = useState('');

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        label={error ? 'Clear error' : 'Submit'}
        onClick={() =>
          setError((current) => (current ? '' : 'Could not save. Try again.'))
        }
      />
      <LiveRegion politeness={LiveRegionPoliteness.Assertive}>
        {error && <ErrorText text={error} />}
      </LiveRegion>
    </div>
  );
};

export const MessageAppearsLater: Story = {
  render: () => <SubmitDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'The region is in the DOM from the first render; only its content changes, so the error is announced when it appears.',
      },
    },
  },
};
