import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderPath, type FolderPathProps } from './FolderPath';

const meta = {
  title: 'Components_2_0/FolderPath',
  component: FolderPath,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A read-only, non-clickable folder/location path built on top of DialBreadcrumb. Displays a leading folder icon and styles the last segment as the current/leaf item.',
      },
    },
  },
  argTypes: {
    segments: {
      control: { type: 'object' },
      description: 'Path segments to display, outermost first',
    },
    labelClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to non-leaf segments',
    },
    leafClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the last (leaf) segment',
    },
    className: {
      control: { type: 'text' },
      description:
        "Additional CSS classes applied to the breadcrumb's nav element",
    },
  },
  args: {
    segments: ['Shared with me', 'Team Space', 'Reports'],
  },
} satisfies Meta<FolderPathProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoSegments: Story = {
  args: {
    segments: ['Shared with me', 'Reports'],
  },
};

export const LongPathOverflow: Story = {
  args: {
    segments: [
      'Shared with me',
      'Organization Workspace',
      'Team Space Alpha',
      'Projects',
      'Quarterly Reports',
      'Reports 2026',
      'Final Version',
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'A path of more than three segments shows the first and the last two and collapses the rest into a non-interactive `…`. Hover it to see the full path (`Shared with me > … > Final Version`). A segment that still does not fit is truncated.',
      },
    },
  },
  render: (args) => (
    <div className="w-[300px]">
      <FolderPath {...args} />
    </div>
  ),
};
