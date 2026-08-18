import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialAnalyticsBarGroup } from './BarGroup';

const data = { accuracy: 0.82, recall: 0.64, precision: 0.91 };

describe('Dial UI Kit :: DialAnalyticsBarGroup', () => {
  test('renders the title without a default description', () => {
    render(<DialAnalyticsBarGroup title="Relevance" data={data} />);

    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.queryByText('3 numeric results')).toBeNull();
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

    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  describe('description', () => {
    test('renders a custom string description instead of the count', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={data}
          description="Updated just now"
        />,
      );

      expect(screen.getByText('Updated just now')).toBeInTheDocument();
      expect(screen.queryByText('3 numeric results')).toBeNull();
    });

    test('renders a custom node description', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={data}
          description={<span data-testid="custom-desc">Live</span>}
        />,
      );

      expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
    });
  });

  describe('onBarClick', () => {
    test('renders each bar as a button and forwards key and value on click', () => {
      const onBarClick = vi.fn();
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          onBarClick={onBarClick}
        />,
      );

      const barButton = screen.getByRole('button', { name: /accuracy/i });
      fireEvent.click(barButton);

      expect(onBarClick).toHaveBeenCalledTimes(1);
      expect(onBarClick).toHaveBeenCalledWith('accuracy', 0.82);
    });

    test('does not wrap bars in buttons when onBarClick is omitted', () => {
      render(<DialAnalyticsBarGroup title="Relevance" data={data} />);

      // Only the accordion header is a button.
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });

  describe('inline mode', () => {
    test('applies text-secondary to bar titles by default', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ score: 0.5 }}
          inline
        />,
      );

      expect(screen.getByText('score').className).toMatch(/text-secondary/);
    });
  });

  describe('compare mode', () => {
    test('renders two progressbars per entry', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82, recall: 0.64 }}
          compareData={{ accuracy: 0.64, recall: 0.82 }}
        />,
      );

      expect(screen.getAllByRole('progressbar')).toHaveLength(4);
    });

    test('renders the entry title', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
        />,
      );

      expect(screen.getByText('accuracy')).toBeInTheDocument();
    });

    test('renders a positive delta badge with success styles', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ score: 0.64 }}
          compareData={{ score: 0.82 }}
        />,
      );

      const badge = screen.getByText('+0.18');
      expect(badge.className).toMatch(/bg-success/);
      expect(badge.className).toMatch(/text-success/);
    });

    test('renders a negative delta badge with error styles', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ score: 0.82 }}
          compareData={{ score: 0.64 }}
        />,
      );

      const badge = screen.getByText('-0.18');
      expect(badge.className).toMatch(/bg-error/);
      expect(badge.className).toMatch(/text-error/);
    });

    test('rounds the compare-mode delta to 3 decimal places', () => {
      render(
        <DialAnalyticsBarGroup
          title="DeepEval: Answer Relevancy"
          data={{ score: 0.917 }}
          compareData={{ score: 1 }}
        />,
      );

      const badge = screen.getByText('+0.083');
      expect(badge.className).toMatch(/bg-success/);
    });

    test('hides the delta badge when the rounded delta is zero', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ score: 0.5 }}
          compareData={{ score: 0.5 }}
        />,
      );

      expect(screen.queryByText('+0')).toBeNull();
      expect(screen.queryByText(/^[-+]/)).toBeNull();
    });

    test('renders compareLabels as bar titles', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ score: 0.82 }}
          compareData={{ score: 0.64 }}
          compareLabels={['This week', 'Last week']}
        />,
      );

      expect(screen.getByText('This week')).toBeInTheDocument();
      expect(screen.getByText('Last week')).toBeInTheDocument();
    });

    test('shows missing keys with an em dash and no delta badge', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82, onlyCurrent: 0.5 }}
          compareData={{ accuracy: 0.64, onlyPrevious: 0.7 }}
        />,
      );

      expect(screen.getByText('onlyCurrent')).toBeInTheDocument();
      expect(screen.getByText('onlyPrevious')).toBeInTheDocument();
      // accuracy×2 + onlyCurrent + onlyPrevious — missing sides have no progressbar
      expect(screen.getAllByRole('progressbar')).toHaveLength(4);
      expect(screen.getAllByText('—')).toHaveLength(2);
      expect(screen.getByText('-0.18')).toBeInTheDocument();
      expect(screen.queryByText('NaN')).toBeNull();
    });

    test('hides the delta badge when either side is explicitly null', () => {
      render(
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ score: null, other: 0.5 }}
          compareData={{ score: 0.64, other: null }}
        />,
      );

      expect(screen.getAllByText('—')).toHaveLength(2);
      expect(screen.queryByText(/^[+-]\d/)).toBeNull();
      expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });
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
