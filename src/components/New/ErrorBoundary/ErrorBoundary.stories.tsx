import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { NeutralButton } from '@/components/New/Button/ButtonWrappers';

import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary';

const Crash = () => {
  throw new Error('Story crash');
};

const CrashOnDemand = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) return <Crash />;

  return (
    <div className="flex size-full items-center justify-center">
      <NeutralButton label="Throw" onClick={() => setShouldCrash(true)} />
    </div>
  );
};

const meta = {
  title: 'Components_2_0/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['error', 'crash', 'fallback', 'state', 'page'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Catches a render error in its subtree and shows a `StateScreen` with a warning badge and one focused recovery button. The crash is announced through an assertive live region mounted before it. Without `onReset` the button reloads the page; `resetKeys` clears the error when, for example, the route changes.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' }, description: 'Headline (`h1`)' },
    description: {
      control: { type: 'text' },
      description: 'Line under the title',
    },
    actionLabel: {
      control: { type: 'text' },
      description: 'Recovery button text',
    },
    icon: { control: false, description: 'Glyph in the badge' },
    children: { control: false },
  },
  args: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Try again or reload the page.',
    actionLabel: 'Try again',
    onReset: () => {},
  },
  render: (args) => (
    <div className="h-[480px] bg-layer-raised">
      <ErrorBoundary {...args}>
        <CrashOnDemand />
      </ErrorBoundary>
    </div>
  ),
} satisfies Meta<ErrorBoundaryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TryAgain: Story = {};

export const ReloadPage: Story = {
  args: { actionLabel: 'Reload', onReset: undefined },
  render: (args) => (
    <div className="h-[480px] bg-layer-raised">
      <ErrorBoundary {...args}>
        <Crash />
      </ErrorBoundary>
    </div>
  ),
};
