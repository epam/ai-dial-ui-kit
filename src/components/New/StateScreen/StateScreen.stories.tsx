import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  IconAlertTriangle,
  IconExternalLink,
  IconLock,
  IconLockX,
} from '@tabler/icons-react';

import { NeutralButton } from '@/components/New/Button/ButtonWrappers';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';

import { StateScreen, type StateScreenProps } from './StateScreen';

const meta = {
  title: 'Components_2_0/StateScreen',
  component: StateScreen,
  tags: ['auth', 'login', 'forbidden', 'state', 'page'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A whole screen given over to one state the app cannot work past — signed out, access denied, a misconfigured provider. A round icon badge, an `h1`, a description and an action, centred in the container. For an empty list or grid inside a page, use `NoDataContent`.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' }, description: 'Headline (`h1`)' },
    description: {
      control: { type: 'text' },
      description: 'Line under the title',
    },
    icon: { control: false, description: 'Glyph in the round badge' },
    action: { control: false, description: 'The way out of the state' },
  },
  args: {
    icon: <IconLock size={DIAL_ICON_SIZE.LG} stroke={DIAL_KIT_ICON_STROKE} />,
    title: 'Log in to configure your QuickApp',
    description: 'Set up instructions, add-ons and settings.',
    action: (
      <NeutralButton
        label="Log in"
        iconAfter={
          <IconExternalLink
            aria-hidden="true"
            size={DIAL_ICON_SIZE.MD}
            stroke={DIAL_KIT_ICON_STROKE}
            className="rtl:scale-x-[-1]"
          />
        }
      />
    ),
  },
  render: (args) => (
    <div className="h-[480px] bg-layer-raised">
      <StateScreen {...args} />
    </div>
  ),
} satisfies Meta<StateScreenProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {};

export const Forbidden: Story = {
  args: {
    icon: <IconLockX size={DIAL_ICON_SIZE.LG} stroke={DIAL_KIT_ICON_STROKE} />,
    title: 'Access denied',
    description: "You don't have permission to access this application.",
    action: <NeutralButton label="Log out" />,
  },
};

export const WithoutAction: Story = {
  args: {
    icon: (
      <IconAlertTriangle
        size={DIAL_ICON_SIZE.LG}
        stroke={DIAL_KIT_ICON_STROKE}
      />
    ),
    title: 'Authentication is not configured',
    description: 'Ask your administrator to set up a login provider.',
    action: undefined,
  },
};
