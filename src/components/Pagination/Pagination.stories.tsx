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
          'Page navigation control with prev/next buttons and dot indicators. ' +
          'For 6 pages or fewer all dots are the same size. ' +
          'For 7 or more pages the active page is wide, adjacent pages (±2) are regular dots, and far pages shrink to small dots.',
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

export const FewPages: Story = {
  name: '6 pages — show all dots',
  args: { page: 1, totalPages: 6 },
};

export const ManyPagesStart: Story = {
  name: '7+ pages — active near start',
  args: { page: 2, totalPages: 10 },
};

export const ManyPagesMiddle: Story = {
  name: '7+ pages — active in middle',
  args: { page: 5, totalPages: 10 },
};

export const ManyPagesEnd: Story = {
  name: '7+ pages — active near end',
  args: { page: 9, totalPages: 10 },
};

export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return <DialPagination {...args} page={page} onPageChange={setPage} />;
  },
};
