import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagVariant } from '@/types/tag';
import { DialTag } from '../Tag/Tag';
import { IconEye } from '@tabler/icons-react';

const meta: Meta<typeof DialTag> = {
  title: 'Components/Tag',
  component: DialTag,
  tags: ['display', 'tag', 'badge'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small, labeled tag used to display categories, filters, or selections. Supports removable behavior and multiple visual variants.',
      },
    },
  },
  argTypes: {
    tag: {
      control: { type: 'text' },
      description: 'The text displayed inside the tag.',
    },
    variant: {
      control: { type: 'select' },
      options: Object.values(TagVariant),
      description: 'Visual variant defined by the TagVariant enum.',
    },
    cssClass: {
      control: { type: 'text' },
      description: 'Optional additional CSS classes for custom styling.',
    },
    remove: {
      action: 'removed',
      description:
        'Callback triggered when the remove (X) button is clicked. If not provided, the button will not be shown.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tag: 'React',
    variant: TagVariant.Default,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3 p-5 rounded-md w-[400px] justify-center">
      {Object.values(TagVariant).map((variant) => (
        <DialTag
          key={variant}
          tag={variant}
          variant={variant}
          remove={args.remove}
        />
      ))}
    </div>
  ),
};

export const WithIconBefore: Story = {
  render: (args) => (
    <DialTag
      tag="Review required"
      remove={args.remove}
      cssClass="border-[#F4CE46] bg-warning"
      iconBefore={<IconEye size={16} className="text-warning" />}
    />
  ),
};

export const DashedBorder: Story = {
  render: (args) => (
    <DialTag
      tag="Business implementation"
      remove={args.remove}
      cssClass="border-dashed rounded-[8px]"
    />
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-5 w-[450px] text-primary">
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold mb-2">Default</h4>
        <div className="flex">
          <DialTag
            tag="React"
            variant={TagVariant.Default}
            remove={() => null}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold mb-2">Unremovable</h4>
        <div className="flex">
          <DialTag tag="Storybook" variant={TagVariant.Default} />
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold mb-2">All Variants</h4>
        <div className="flex flex-wrap gap-2">
          {Object.values(TagVariant).map((variant) => (
            <DialTag
              key={variant}
              tag={variant}
              variant={variant}
              remove={() => null}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};
