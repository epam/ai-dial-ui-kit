import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconInbox, IconZoomCancel } from '@tabler/icons-react';

import { OutlinedButton } from '@/components/New/Button/ButtonWrappers';

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
          'Message shown in place of a list, table or grid that has nothing to show: an illustration, a title, a description and an optional action. Use "No [entities] yet" / "[Entities] will appear here once [condition]." for an empty default state, and "No [entities] found" / "Try a different search term or check your filters." after a search or filter. The icon is decorative and hidden from assistive tech; pass `live` where the content replaces a list the user has just filtered, so the message is announced.',
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
    action: { control: false, description: 'Way forward under the text' },
    live: {
      control: { type: 'boolean' },
      description: 'Announce the empty state to assistive tech',
    },
  },
  args: {
    title: 'No chats found',
    description: 'Try a different search term or check your filters.',
  },
  render: (args) => (
    <div className="h-[360px] max-w-[320px] rounded-xl bg-layer-base">
      <NoDataContent {...args} />
    </div>
  ),
} satisfies Meta<NoDataContentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    title: 'No chats yet',
    description: 'Chats will appear here once you start one.',
    action: <OutlinedButton label="New chat" />,
  },
};

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
