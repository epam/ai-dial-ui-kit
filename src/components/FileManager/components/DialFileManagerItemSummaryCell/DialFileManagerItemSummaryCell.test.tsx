import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialFileManagerItemSummaryCell } from './DialFileManagerItemSummaryCell';
import { DialFileNodeType } from '@/models/file';

const baseProps = {
  id: '1',
  name: 'Example File.txt',
  nodeType: DialFileNodeType.ITEM,
  size: 15000,
  updatedAt: '2025-07-20T00:00:00Z',
};

describe('Dial UI Kit :: FileManagerItemSummaryCell', () => {
  test('renders file name', () => {
    render(<DialFileManagerItemSummaryCell {...baseProps} />);
    expect(screen.getByText('Example File.txt')).toBeInTheDocument();
  });

  test('renders size', () => {
    render(<DialFileManagerItemSummaryCell {...baseProps} />);
    expect(screen.getByText('15 KB')).toBeInTheDocument();
  });

  test('renders ISO date via DialDateCellRenderer', () => {
    render(
      <DialFileManagerItemSummaryCell
        {...baseProps}
        dateLocale="en-US"
        dateOptions={{ timeZone: 'UTC' }}
      />,
    );

    const formatted = screen.getByText('7/20/2025');
    expect(formatted).toBeInTheDocument();

    const timeEl = formatted.closest('time');
    expect(timeEl).toBeInTheDocument();
    expect(timeEl).toHaveAttribute('dateTime', '2025-07-20T00:00:00.000Z');
  });

  test('renders numeric timestamp correctly', () => {
    render(
      <DialFileManagerItemSummaryCell
        {...baseProps}
        updatedAt={'1752969600000'}
        dateLocale="en-US"
        dateOptions={{ timeZone: 'UTC' }}
      />,
    );

    expect(screen.getByText('7/20/2025')).toBeInTheDocument();
  });
});
