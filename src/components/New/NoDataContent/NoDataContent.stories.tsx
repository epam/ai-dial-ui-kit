import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconInbox, IconZoomCancel } from '@tabler/icons-react';

import { NoDataContent, type NoDataContentProps } from './NoDataContent';

const meta = {
  title: 'Components_2_0/NoDataContent',
  component: NoDataContent,
  tags: ['empty', 'state', 'placeholder'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Message shown in place of a list, table or grid that has nothing to show. The icon is decorative and hidden from assistive tech; pass `live` where the content replaces a list the user has just filtered, so the message is announced.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' }, description: 'Headline' },
    description: {
      control: { type: 'text' },
      description: 'Secondary line under the title',
    },
    icon: { control: false, description: 'Illustration above the title' },
    live: {
      control: { type: 'boolean' },
      description: 'Announce the empty state to assistive tech',
    },
  },
  args: {
    title: 'No results found',
    description: "Sorry, we couldn't find any results for your search.",
  },
  render: (args) => (
    <div className="h-[280px] rounded-xl bg-layer-base">
      <NoDataContent {...args} />
    </div>
  ),
} satisfies Meta<NoDataContentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: {
    title: 'Nothing here yet',
    description: undefined,
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'No results found',
    icon: <IconZoomCancel size={60} stroke={0.5} aria-hidden="true" />,
  },
};

export const Announced: Story = {
  args: {
    title: 'No matching rows',
    description: 'Adjust the filters to see more.',
    icon: <IconInbox size={60} stroke={0.5} aria-hidden="true" />,
    live: true,
  },
};
