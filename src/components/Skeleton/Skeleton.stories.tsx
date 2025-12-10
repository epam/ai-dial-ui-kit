import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialSkeleton } from './Skeleton';
import {
  DialSkeletonVariant,
  DialSkeletonAvatarSize,
  DialSkeletonAvatarShape,
} from '@/types/skeleton';
import { useState, useEffect, type FC } from 'react';

const meta: Meta<typeof DialSkeleton> = {
  title: 'Feedback/Skeleton',
  component: DialSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Whether to show the loading animation',
    },
    loading: {
      control: 'boolean',
      description: 'Display the skeleton when true',
    },
    variant: {
      control: 'select',
      options: Object.values(DialSkeletonVariant),
      description: 'Skeleton variant',
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: true,
  },
  render: (args) => (
    <div className="w-[600px]">
      <DialSkeleton {...args} />
    </div>
  ),
};

export const WithAvatar: Story = {
  args: {
    active: true,
    avatar: true,
    paragraph: { rows: 4 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <DialSkeleton {...args} />
    </div>
  ),
};

export const WithLargeAvatar: Story = {
  args: {
    active: true,
    avatar: {
      size: DialSkeletonAvatarSize.Large,
      shape: DialSkeletonAvatarShape.Square,
    },
    paragraph: { rows: 3 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <DialSkeleton {...args} />
    </div>
  ),
};

export const WithSmallCircleAvatar: Story = {
  args: {
    active: true,
    avatar: {
      size: DialSkeletonAvatarSize.Small,
      shape: DialSkeletonAvatarShape.Circle,
    },
    paragraph: { rows: 2 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <DialSkeleton {...args} />
    </div>
  ),
};

export const CustomParagraphWidths: Story = {
  args: {
    active: true,
    avatar: true,
    showTitle: true,
    paragraph: {
      rows: 4,
      width: ['100%', '95%', '80%', '50%'],
    },
  },
  render: (args) => (
    <div className="w-[600px]">
      <DialSkeleton {...args} />
    </div>
  ),
};

export const TextVariant: Story = {
  args: {
    variant: DialSkeletonVariant.Text,
    width: '200px',
    height: '20px',
    active: true,
  },
};

export const SmallTextVariant: Story = {
  args: {
    variant: DialSkeletonVariant.Text,
    width: '100px',
    height: '12px',
    active: true,
  },
};

export const CircularVariant: Story = {
  args: {
    variant: DialSkeletonVariant.Circular,
    width: 64,
    height: 64,
    active: true,
  },
};

export const RectangularVariant: Story = {
  args: {
    variant: DialSkeletonVariant.Rectangular,
    width: '300px',
    height: '200px',
    active: true,
  },
};

export const WithoutAnimation: Story = {
  args: {
    active: false,
    avatar: true,
    showTitle: true,
    paragraph: { rows: 3 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <DialSkeleton {...args} />
    </div>
  ),
};

const LoadingComponent: FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[600px]">
      <DialSkeleton loading={loading} avatar paragraph={{ rows: 4 }}>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white">
            JD
          </div>
          <div className="flex-1">
            <h3 className="text-primary font-semibold mb-2">John Doe</h3>
            <p className="text-secondary">
              This is the actual content that appears after loading is complete.
              The skeleton was displayed during the 3-second loading period.
            </p>
          </div>
        </div>
      </DialSkeleton>
    </div>
  );
};

export const ConditionalLoading: Story = {
  render: () => <LoadingComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows skeleton while loading, then displays actual content after 3 seconds.',
      },
    },
  },
};

export const MultipleSkeletons: Story = {
  render: () => (
    <div className="w-[600px] space-y-6">
      <DialSkeleton avatar paragraph={{ rows: 2 }} active />
      <DialSkeleton avatar paragraph={{ rows: 2 }} active />
      <DialSkeleton avatar paragraph={{ rows: 2 }} active />
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <DialSkeleton
            variant={DialSkeletonVariant.Circular}
            width={40}
            height={40}
            active
          />
          <div className="flex-1 space-y-2">
            <DialSkeleton
              variant={DialSkeletonVariant.Text}
              width="60%"
              height={16}
              active
            />
            <DialSkeleton
              variant={DialSkeletonVariant.Text}
              width="40%"
              height={12}
              active
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-[300px] border border-primary rounded p-4">
      <DialSkeleton
        variant={DialSkeletonVariant.Rectangular}
        width="100%"
        height={200}
        active
        className="mb-4"
      />
      <DialSkeleton
        variant={DialSkeletonVariant.Text}
        width="80%"
        height={24}
        active
        className="mb-2"
      />
      <DialSkeleton
        variant={DialSkeletonVariant.Text}
        width="100%"
        height={16}
        active
        className="mb-2"
      />
      <DialSkeleton
        variant={DialSkeletonVariant.Text}
        width="90%"
        height={16}
        active
      />
    </div>
  ),
};

export const AllAvatarSizes: Story = {
  render: () => (
    <div className="w-[600px] space-y-6">
      <DialSkeleton
        avatar={{ size: DialSkeletonAvatarSize.Small }}
        paragraph={{ rows: 2 }}
        active
      />
      <DialSkeleton
        avatar={{ size: DialSkeletonAvatarSize.Default }}
        paragraph={{ rows: 2 }}
        active
      />
      <DialSkeleton
        avatar={{ size: DialSkeletonAvatarSize.Large }}
        paragraph={{ rows: 2 }}
        active
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates all avatar sizes: small (32px), default (40px), and large (64px).',
      },
    },
  },
};

export const AllAvatarShapes: Story = {
  render: () => (
    <div className="w-[600px] space-y-6">
      <DialSkeleton
        avatar={{
          size: DialSkeletonAvatarSize.Large,
          shape: DialSkeletonAvatarShape.Circle,
        }}
        paragraph={{ rows: 2 }}
        active
      />
      <DialSkeleton
        avatar={{
          size: DialSkeletonAvatarSize.Large,
          shape: DialSkeletonAvatarShape.Square,
        }}
        paragraph={{ rows: 2 }}
        active
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates avatar shapes: circle and square.',
      },
    },
  },
};

export const FormLoadingState: Story = {
  render: () => (
    <div className="w-[400px] border border-primary rounded p-6 space-y-6">
      <h2 className="text-primary text-lg font-semibold">User Profile</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-secondary dial-small">Full Name</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="100%"
            height={36}
          />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small">Email</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="100%"
            height={36}
          />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small">Phone</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="70%"
            height={36}
          />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small">Bio</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Rectangular}
            width="100%"
            height={120}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <DialSkeleton
          variant={DialSkeletonVariant.Rectangular}
          width={80}
          height={36}
        />
        <DialSkeleton
          variant={DialSkeletonVariant.Rectangular}
          width={80}
          height={36}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state for a form with various input types.',
      },
    },
  },
};

export const DetailsPanelLoadingState: Story = {
  render: () => (
    <div className="w-[320px] border border-primary rounded p-4 space-y-4">
      <div className="flex items-center gap-3">
        <DialSkeleton
          variant={DialSkeletonVariant.Circular}
          width={48}
          height={48}
        />
        <div className="flex-1 space-y-2">
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="80%"
            height={18}
          />
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="60%"
            height={14}
          />
        </div>
      </div>

      <div className="border-t border-primary pt-4 space-y-3">
        <div className="space-y-2">
          <div className="text-secondary dial-small">Status</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="50%"
            height={16}
          />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small">Created</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="70%"
            height={16}
          />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small">Last Modified</div>
          <DialSkeleton
            variant={DialSkeletonVariant.Text}
            width="70%"
            height={16}
          />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small">Tags</div>
          <div className="flex gap-2">
            <DialSkeleton
              variant={DialSkeletonVariant.Rectangular}
              width={60}
              height={24}
            />
            <DialSkeleton
              variant={DialSkeletonVariant.Rectangular}
              width={80}
              height={24}
            />
            <DialSkeleton
              variant={DialSkeletonVariant.Rectangular}
              width={70}
              height={24}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Skeleton loading state for a details panel with avatar, labels, and tags.',
      },
    },
  },
};
