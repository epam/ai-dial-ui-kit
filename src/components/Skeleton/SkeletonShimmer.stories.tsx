import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
import { Skeleton } from './Skeleton';
import { SkeletonShimmer } from './SkeletonShimmer';
import { SkeletonVariant } from '@/types/skeleton';
import { useSkeletonTiming } from '@/hooks/use-skeleton-timing';

const meta: Meta<typeof SkeletonShimmer> = {
  title: 'Components_2_0/SkeletonShimmer',
  component: SkeletonShimmer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Run the shimmer. When false the skeleton is static.',
    },
    label: {
      control: 'text',
      description:
        'Text announced to assistive technology while loading, from a live region next to the container.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BAR = 'rounded-xl bg-layer-sunken';
const BAR_LIGHT = 'rounded-xl bg-layer-base';

const ListItem: FC = () => (
  <div className="flex gap-3">
    <Skeleton
      variant={SkeletonVariant.Circular}
      width={24}
      height={24}
      className="shrink-0 bg-layer-sunken"
    />
    <div className="flex flex-1 flex-col gap-3">
      <Skeleton
        variant={SkeletonVariant.Text}
        width="70%"
        height={20}
        className={BAR}
      />
      <Skeleton
        variant={SkeletonVariant.Text}
        width="45%"
        height={20}
        className={BAR_LIGHT}
      />
    </div>
  </div>
);

const ListSkeleton: FC = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Skeleton
        variant={SkeletonVariant.Text}
        width="69%"
        height={20}
        className={BAR}
      />
      <Skeleton
        variant={SkeletonVariant.Text}
        width="53%"
        height={20}
        className={BAR_LIGHT}
      />
    </div>
    {Array.from({ length: 5 }, (_, i) => (
      <ListItem key={i} />
    ))}
  </div>
);

export const Default: Story = {
  args: { active: true, label: 'Loading' },
  render: (args) => (
    <SkeletonShimmer {...args} className="w-[560px] bg-layer-raised">
      <ListSkeleton />
    </SkeletonShimmer>
  ),
};

export const Static: Story = {
  args: { active: false },
  render: (args) => (
    <SkeletonShimmer {...args} className="w-[560px] bg-layer-raised">
      <ListSkeleton />
    </SkeletonShimmer>
  ),
};

const TimingDemo: FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    showPlaceholder,
    showSkeleton,
    placeholderClassName,
    showContent,
    contentClassName,
  } = useSkeletonTiming(loading);

  return (
    <div className="flex w-[560px] flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded border border-primary px-3 py-1"
          onClick={() => setLoading(true)}
        >
          Start loading
        </button>
        <button
          type="button"
          className="rounded border border-primary px-3 py-1"
          onClick={() => setLoading(false)}
        >
          Finish
        </button>
      </div>
      <div>
        {showPlaceholder && (
          <SkeletonShimmer
            label={showSkeleton ? 'Loading items' : undefined}
            className={placeholderClassName}
          >
            <ListSkeleton />
          </SkeletonShimmer>
        )}
        {showContent && (
          <div className={contentClassName}>
            {loading ? null : 'Content is ready.'}
          </div>
        )}
      </div>
    </div>
  );
};

export const WithTiming: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Start loading and finish within 400 ms: no skeleton appears. Finish later: the skeleton stays at least 500 ms, then the content fades in.',
      },
    },
  },
  render: () => <TimingDemo />,
};
