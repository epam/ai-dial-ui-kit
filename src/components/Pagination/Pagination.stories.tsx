import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialPagination, type DialPaginationProps } from './Pagination';

const meta = {
  title: 'DIAL/Navigation/Pagination',
  component: DialPagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Page navigation control with prev/next buttons and numbered page items.',
      },
    },
  },
  argTypes: {
    page: {
      control: { type: 'number', min: 1 },
      description: 'Current active page (1-indexed)',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional classes on the nav element',
    },
  },
  args: {
    page: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
} satisfies Meta<DialPaginationProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: { page: 1, totalPages: 6 },
};

export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return <DialPagination {...args} page={page} onPageChange={setPage} />;
  },
};
