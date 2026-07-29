import type { Meta, StoryObj } from '@storybook/react-vite';
import { Highlight, type HighlightProps } from './Highlight';

const meta = {
  title: 'Components_2.0/Highlight',
  component: Highlight,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Renders text with the first case-insensitive occurrence of a search query wrapped in a highlight mark, with ellipsis truncation and a tooltip when overflowing.',
      },
    },
  },
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Full text to display',
    },
    query: {
      control: { type: 'text' },
      description:
        'Search query; the first case-insensitive match is highlighted',
    },
    markClassName: {
      control: { type: 'text' },
      description: 'Optional class name for the highlighted segment',
    },
    className: {
      control: { type: 'text' },
      description: 'Optional class name forwarded to the tooltip container',
    },
    maxLines: {
      control: { type: 'number' },
      description:
        'Maximum number of lines to display before truncating. Use `1` for single-line ellipsis truncation.',
    },
  },
  args: {
    text: 'The quick brown fox jumps over the lazy dog',
    query: 'brown fox',
  },
} satisfies Meta<HighlightProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMatch: Story = {
  args: {
    query: 'zebra',
  },
};

export const SingleLineTruncated: Story = {
  args: {
    text: 'The quick brown fox jumps over the lazy dog while running through the forest',
    query: 'forest',
    maxLines: 1,
    className: 'max-w-[220px]',
  },
};

export const MultiLineTruncated: Story = {
  args: {
    text: 'The quick brown fox jumps over the lazy dog while running through the forest, chasing butterflies and enjoying the sunshine on a warm afternoon.',
    query: 'butterflies',
    maxLines: 3,
    className: 'max-w-[220px]',
  },
};

export const CustomMarkStyle: Story = {
  args: {
    markClassName: 'text-error bg-error/10',
  },
};
