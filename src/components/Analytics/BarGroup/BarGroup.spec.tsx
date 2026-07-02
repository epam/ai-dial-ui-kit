import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAnalyticsBarGroup } from './BarGroup';

const data = { accuracy: 0.82, recall: 0.64, precision: 0.91 };

describe('Dial UI Kit :: DialAnalyticsBarGroup', () => {
  test('renders the title and an entry count description', () => {
    render(<DialAnalyticsBarGroup title="Relevance" data={data} />);

    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('3 numeric results')).toBeInTheDocument();
  });

  test('renders a bar per entry, expanded by default', () => {
    render(<DialAnalyticsBarGroup title="Relevance" data={data} />);

    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
    expect(screen.getByText('accuracy')).toBeInTheDocument();
    expect(screen.getByText('recall')).toBeInTheDocument();
    expect(screen.getByText('precision')).toBeInTheDocument();
  });

  test('passes the value of each entry to its bar', () => {
    render(<DialAnalyticsBarGroup title="Relevance" data={{ score: 0.5 }} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0.5',
    );
  });

  test('can start collapsed and toggle open', () => {
    render(
      <DialAnalyticsBarGroup
        title="Relevance"
        data={data}
        defaultExpanded={false}
      />,
    );

    expect(screen.queryByRole('progressbar')).toBeNull();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
  });

  test('forwards maxValue to the bars', () => {
    render(
      <DialAnalyticsBarGroup
        title="Scores"
        data={{ total: 250 }}
        maxValue={1000}
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      '1000',
    );
  });

  test('handles an empty data object', () => {
    render(<DialAnalyticsBarGroup title="Empty" data={{}} />);

    expect(screen.getByText('0 numeric results')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  describe('loading state', () => {
    test('renders a loader instead of the bars', () => {
      render(<DialAnalyticsBarGroup title="Relevance" data={data} isLoading />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).toBeNull();
      expect(screen.queryByText('accuracy')).toBeNull();
    });
  });
});
