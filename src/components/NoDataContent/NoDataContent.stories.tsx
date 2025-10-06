import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconAlertTriangle } from '@tabler/icons-react';
import { NoDataContent } from './NoDataContent';

const meta: Meta<typeof NoDataContent> = {
  title: 'Components/NoDataContent',
  component: NoDataContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A contextual feedback component for displaying important messages with optional close button.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'The message to display when no data is present',
    },
  },
};
export default meta;

type Story = StoryObj<typeof NoDataContent>;

export const Default: Story = {
  args: {
    title: 'No data available',
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: 'Nothing found',
    icon: <IconAlertTriangle width={60} height={60} color="orange" />,
  },
};

export const LongMessage: Story = {
  args: {
    title:
      'No results match your search. Try adjusting your filters or check back later.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 flex flex-col gap-y-6">
      {/* Default */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">Default</div>
        <NoDataContent title="No data available" />
      </div>

      {/* With Custom Icon */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">With Custom Icon</div>
        <NoDataContent
          title="Nothing found"
          icon={<IconAlertTriangle width={60} height={60} color="orange" />}
        />
      </div>

      {/* Long Message */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">Long Message</div>
        <NoDataContent title="No results match your search. Try adjusting your filters or check back later." />
      </div>
    </div>
  ),
};
