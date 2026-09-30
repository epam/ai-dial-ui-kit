import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '@/components/New/Button/Button';
import { ButtonVariant } from '@/types/button';
import { BottomSheet, type BottomSheetProps } from './BottomSheet';

const meta = {
  title: 'Components_2_0/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        component:
          'A panel that slides up from the bottom edge over a dimmed page — the mobile counterpart of `Popup`. A modal dialog: focus moves in and is contained, and Escape, the close button or a press on the backdrop call `onClose`.',
      },
    },
  },
  args: { open: false, title: 'Select model', onClose: () => {} },
} satisfies Meta<BottomSheetProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 30 }, (_, i) => `Option ${i + 1}`);

const Demo = (args: BottomSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4">
      <Button
        label="Open sheet"
        variant={ButtonVariant.Primary}
        onClick={() => setIsOpen(true)}
      />
      <BottomSheet {...args} open={isOpen} onClose={() => setIsOpen(false)}>
        <ul className="flex flex-col py-2">
          {rows.map((row) => (
            <li key={row} className="px-4 py-2.5 dial-small-text">
              {row}
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  );
};

export const Default: Story = { render: (args) => <Demo {...args} /> };

/** A second page of a drill-down sheet: a back button at the start of the header. */
export const WithBack: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: 'Theme', onBack: () => {} },
};

/** No header: the sheet is named by `ariaLabel` and closes from the backdrop or Escape. */
export const WithoutHeader: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: undefined, ariaLabel: 'Menu' },
};
