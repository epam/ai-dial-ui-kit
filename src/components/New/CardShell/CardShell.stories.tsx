import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardShell, type CardShellProps } from './CardShell';

const meta = {
  title: 'Components/CardShell',
  component: CardShell,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A shared elevated card shell used as the base wrapper for browse-grid cards. On hover it lifts up with a stronger shadow (not demonstrated interactively in Storybook — hover the card in a live app to see it), and respects `prefers-reduced-motion` by disabling the transition and lift.',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the card container',
    },
    children: {
      control: false,
      description: 'Content rendered inside the card',
    },
  },
  args: {
    children: (
      <>
        <div className="dial-small-semi-text">Card title</div>
        <div className="dial-small-paragraph-text">Card description text.</div>
      </>
    ),
  },
} satisfies Meta<CardShellProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSize: Story = {
  args: {
    className: 'w-[280px]',
  },
};
