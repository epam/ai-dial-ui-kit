import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconPhoto, IconUser } from '@tabler/icons-react';
import { Skeleton } from './Skeleton';
import {
  SkeletonVariant,
  SkeletonAvatarSize,
  SkeletonAvatarShape,
} from '@/types/skeleton';
import { useState, useEffect, type FC } from 'react';

const meta: Meta<typeof Skeleton> = {
  title: 'Components_2_0/Skeleton',
  component: Skeleton,
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
      options: Object.values(SkeletonVariant),
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
    color: {
      control: 'color',
      description:
        'Custom background color for skeleton elements (overrides the default design token)',
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
      <Skeleton {...args} />
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
      <Skeleton {...args} />
    </div>
  ),
};

export const WithLargeAvatar: Story = {
  args: {
    active: true,
    avatar: {
      size: SkeletonAvatarSize.Large,
      shape: SkeletonAvatarShape.Square,
    },
    paragraph: { rows: 3 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <Skeleton {...args} />
    </div>
  ),
};

export const WithSmallCircleAvatar: Story = {
  args: {
    active: true,
    avatar: {
      size: SkeletonAvatarSize.Small,
      shape: SkeletonAvatarShape.Circle,
    },
    paragraph: { rows: 2 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <Skeleton {...args} />
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
      <Skeleton {...args} />
    </div>
  ),
};

export const TextVariant: Story = {
  args: {
    variant: SkeletonVariant.Text,
    width: '200px',
    height: '20px',
    active: true,
  },
};

export const SmallTextVariant: Story = {
  args: {
    variant: SkeletonVariant.Text,
    width: '100px',
    height: '12px',
    active: true,
  },
};

export const CircularVariant: Story = {
  args: {
    variant: SkeletonVariant.Circular,
    width: 64,
    height: 64,
    active: true,
  },
};

export const RectangularVariant: Story = {
  args: {
    variant: SkeletonVariant.Rectangular,
    width: '300px',
    height: '200px',
    active: true,
  },
};

export const ImageThumbnailLoading: Story = {
  args: {
    variant: SkeletonVariant.Rectangular,
    width: 100,
    height: 100,
    active: true,
    overlay: (
      <span className="text-secondary">
        <IconPhoto size={24} aria-hidden />
      </span>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Rectangular skeleton with a centered icon overlay — use this pattern for lazy-loading image thumbnails (e.g. AttachmentCard).',
      },
    },
  },
};

export const CircularWithOverlay: Story = {
  args: {
    variant: SkeletonVariant.Circular,
    width: 40,
    height: 40,
    active: true,
    overlay: (
      <span className="text-secondary">
        <IconUser size={20} aria-hidden />
      </span>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Circular skeleton with a centered icon overlay — use this pattern for lazy-loading user avatars.',
      },
    },
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
      <Skeleton {...args} />
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
      <Skeleton loading={loading} avatar paragraph={{ rows: 4 }}>
        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-accent-primary flex items-center justify-center text-white">
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
      </Skeleton>
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
      <Skeleton avatar paragraph={{ rows: 2 }} active />
      <Skeleton avatar paragraph={{ rows: 2 }} active />
      <Skeleton avatar paragraph={{ rows: 2 }} active />
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton
            variant={SkeletonVariant.Circular}
            width={40}
            height={40}
            active
          />
          <div className="flex-1 space-y-2">
            <Skeleton
              variant={SkeletonVariant.Text}
              width="60%"
              height={16}
              active
            />
            <Skeleton
              variant={SkeletonVariant.Text}
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
      <Skeleton
        variant={SkeletonVariant.Rectangular}
        width="100%"
        height={200}
        active
        className="mb-4"
      />
      <Skeleton
        variant={SkeletonVariant.Text}
        width="80%"
        height={24}
        active
        className="mb-2"
      />
      <Skeleton
        variant={SkeletonVariant.Text}
        width="100%"
        height={16}
        active
        className="mb-2"
      />
      <Skeleton variant={SkeletonVariant.Text} width="90%" height={16} active />
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    active: true,
    color: '#a855f7',
    avatar: true,
    paragraph: { rows: 3 },
  },
  render: (args) => (
    <div className="w-[600px]">
      <Skeleton {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the `color` prop to set a custom background color on all skeleton elements. This is useful when the component is rendered on a non-standard background where the default token color would blend in.',
      },
    },
  },
};

export const CustomColorVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 rounded" style={{ backgroundColor: '#1e1b4b' }}>
        <Skeleton
          active
          color="rgba(139, 92, 246, 0.4)"
          avatar
          paragraph={{ rows: 2 }}
        />
      </div>
      <div className="p-4 rounded bg-accent-primary">
        <Skeleton
          active
          color="rgba(255,255,255,0.3)"
          paragraph={{ rows: 2 }}
        />
      </div>
      <div className="p-4 rounded">
        <div className="flex gap-3 items-center mb-3">
          <Skeleton
            variant={SkeletonVariant.Circular}
            width={40}
            height={40}
            active
            color="#f97316"
          />
          <Skeleton
            variant={SkeletonVariant.Text}
            width="50%"
            height={16}
            active
            color="#f97316"
          />
        </div>
        <Skeleton
          variant={SkeletonVariant.Rectangular}
          width="100%"
          height={100}
          active
          color="#f97316"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Custom colors applied across different variants and backgrounds.',
      },
    },
  },
};

export const AllAvatarSizes: Story = {
  render: () => (
    <div className="w-[600px] space-y-6">
      <Skeleton
        avatar={{ size: SkeletonAvatarSize.Small }}
        paragraph={{ rows: 2 }}
        active
      />
      <Skeleton
        avatar={{ size: SkeletonAvatarSize.Default }}
        paragraph={{ rows: 2 }}
        active
      />
      <Skeleton
        avatar={{ size: SkeletonAvatarSize.Large }}
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
      <Skeleton
        avatar={{
          size: SkeletonAvatarSize.Large,
          shape: SkeletonAvatarShape.Circle,
        }}
        paragraph={{ rows: 2 }}
        active
      />
      <Skeleton
        avatar={{
          size: SkeletonAvatarSize.Large,
          shape: SkeletonAvatarShape.Square,
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
          <div className="text-secondary dial-small-text">Full Name</div>
          <Skeleton variant={SkeletonVariant.Text} width="100%" height={36} />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Email</div>
          <Skeleton variant={SkeletonVariant.Text} width="100%" height={36} />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Phone</div>
          <Skeleton variant={SkeletonVariant.Text} width="70%" height={36} />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Bio</div>
          <Skeleton
            variant={SkeletonVariant.Rectangular}
            width="100%"
            height={120}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Skeleton
          variant={SkeletonVariant.Rectangular}
          width={80}
          height={36}
        />
        <Skeleton
          variant={SkeletonVariant.Rectangular}
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
        <Skeleton variant={SkeletonVariant.Circular} width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant={SkeletonVariant.Text} width="80%" height={18} />
          <Skeleton variant={SkeletonVariant.Text} width="60%" height={14} />
        </div>
      </div>

      <div className="border-t border-primary pt-4 space-y-3">
        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Status</div>
          <Skeleton variant={SkeletonVariant.Text} width="50%" height={16} />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Created</div>
          <Skeleton variant={SkeletonVariant.Text} width="70%" height={16} />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Last Modified</div>
          <Skeleton variant={SkeletonVariant.Text} width="70%" height={16} />
        </div>

        <div className="space-y-2">
          <div className="text-secondary dial-small-text">Tags</div>
          <div className="flex gap-2">
            <Skeleton
              variant={SkeletonVariant.Rectangular}
              width={60}
              height={24}
            />
            <Skeleton
              variant={SkeletonVariant.Rectangular}
              width={80}
              height={24}
            />
            <Skeleton
              variant={SkeletonVariant.Rectangular}
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
