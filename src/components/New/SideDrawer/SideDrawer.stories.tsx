import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconStar } from '@tabler/icons-react';
import { useState } from 'react';

import { Button } from '@/components/New/Button/Button';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { ButtonVariant } from '@/types/button';
import { SideDrawer, type SideDrawerProps } from './SideDrawer';

const meta = {
  title: 'Components_2_0/SideDrawer',
  component: SideDrawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-height panel that slides in from the inline end over a dimmed page. A modal dialog while open; it stays mounted and `inert` while closed, so it slides out as well as in.',
      },
    },
  },
  args: { open: false, header: 'Publish', onClose: () => {} },
} satisfies Meta<SideDrawerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = (args: SideDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4">
      <Button
        label="Open drawer"
        variant={ButtonVariant.Primary}
        onClick={() => setIsOpen(true)}
      />
      <SideDrawer {...args} open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-3 p-6 dial-small-text">
          {Array.from({ length: 40 }, (_, i) => (
            <p key={i}>Paragraph {i + 1}</p>
          ))}
        </div>
      </SideDrawer>
    </div>
  );
};

export const Default: Story = { render: (args) => <Demo {...args} /> };

/** A details panel: an action in the header next to the close button. */
export const WithHeaderActions: Story = {
  render: (args) => <Demo {...args} />,
  args: {
    header: 'GPT-4o',
    headerActions: (
      <GhostIconButton
        aria-label="Add to favorites"
        icon={<IconStar stroke={DIAL_KIT_ICON_STROKE} aria-hidden="true" />}
      />
    ),
  },
};

/** A sub-view: a back button at the start of the header. */
export const WithBack: Story = {
  render: (args) => <Demo {...args} />,
  args: { header: 'Credentials', onBack: () => {} },
};
