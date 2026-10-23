import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AnalyticsBarGroup } from './BarGroup';

const data = { accuracy: 0.82, recall: 0.64, precision: 0.91 };

describe('Dial UI Kit :: AnalyticsBarGroup', () => {
  test('renders the title without a default description', () => {
    render(<AnalyticsBarGroup title="Relevance" data={data} />);

    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.queryByText('3 numeric results')).toBeNull();
  });

  test('renders a bar per entry, expanded by default', () => {
    render(<AnalyticsBarGroup title="Relevance" data={data} />);

    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
    expect(screen.getByText('accuracy')).toBeInTheDocument();
    expect(screen.getByText('recall')).toBeInTheDocument();
    expect(screen.getByText('precision')).toBeInTheDocument();
  });

  test('passes the value of each entry to its bar', () => {
    render(<AnalyticsBarGroup title="Relevance" data={{ score: 0.5 }} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0.5',
    );
  });

  test('can start collapsed and toggle open', () => {
    render(
      <AnalyticsBarGroup
        title="Relevance"
        data={data}
        defaultExpanded={false}
      />,
    );

    // The 2.0 accordion keeps collapsed content mounted but inert.
    const header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getAllByRole('progressbar')[0].closest('[inert]'),
    ).not.toBeNull();

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
    expect(screen.getAllByRole('progressbar')[0].closest('[inert]')).toBeNull();
  });

  test('forwards maxValue to the bars', () => {
    render(
      <AnalyticsBarGroup
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
    render(<AnalyticsBarGroup title="Empty" data={{}} />);

    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  describe('description', () => {
    test('renders a custom string description instead of the count', () => {
      render(
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
      render(<AnalyticsBarGroup title="Relevance" data={data} />);

      // Only the accordion header is a button.
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    test('in compare mode wraps the whole entry and forwards key and value on click', () => {
      const onBarClick = vi.fn();
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
          onBarClick={onBarClick}
        />,
      );

      const entryButton = screen.getByRole('button', { name: /accuracy/i });
      fireEvent.click(entryButton);

      expect(onBarClick).toHaveBeenCalledTimes(1);
      expect(onBarClick).toHaveBeenCalledWith('accuracy', 0.82);
    });

    test('in compare mode forwards null when the data key is missing', () => {
      const onBarClick = vi.fn();
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ other: 0.5 }}
          compareData={{ accuracy: 0.64 }}
          onBarClick={onBarClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /accuracy/i }));

      expect(onBarClick).toHaveBeenCalledTimes(1);
      expect(onBarClick).toHaveBeenCalledWith('accuracy', null);
    });

    test('in compare mode does not wrap entries when onBarClick is omitted', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
        />,
      );

      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    test('in compare mode marks the entry as a group and applies default pair hover on the shared bars container when onBarClick is set', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
          onBarClick={vi.fn()}
        />,
      );

      const entryButton = screen.getByRole('button', { name: /accuracy/i });
      expect(entryButton.className).toMatch(/\bgroup\b/);

      const progressbars = screen.getAllByRole('progressbar');
      expect(progressbars).toHaveLength(2);
      const barsContainer = progressbars[0].parentElement
        ?.parentElement as HTMLElement;
      expect(progressbars[1].parentElement?.parentElement).toBe(barsContainer);
      expect(barsContainer.className).toMatch(
        /group-hover:bg-accent-primary-alpha/,
      );
      expect(barsContainer.className).toMatch(
        /group-focus-visible:bg-accent-primary-alpha/,
      );
      for (const bar of progressbars) {
        expect((bar.parentElement as HTMLElement).className).not.toMatch(
          /group-hover:bg-accent-primary-alpha/,
        );
      }
    });

    test('in compare mode without onBarClick still marks the entry as a group but omits default pair hover', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
        />,
      );

      const label = screen.getByText('accuracy');
      expect(label.closest('.group')).not.toBeNull();

      const progressbars = screen.getAllByRole('progressbar');
      const barsContainer = progressbars[0].parentElement
        ?.parentElement as HTMLElement;
      expect(barsContainer.className).not.toMatch(
        /group-hover:bg-accent-primary-alpha/,
      );
    });

    test('in compare mode applies barClassName to the shared bars container', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
          onBarClick={vi.fn()}
          barClassName="group-hover:bg-layer-4"
        />,
      );

      const progressbars = screen.getAllByRole('progressbar');
      const barsContainer = progressbars[0].parentElement
        ?.parentElement as HTMLElement;
      expect(progressbars[1].parentElement?.parentElement).toBe(barsContainer);
      expect(barsContainer.className).toMatch(/group-hover:bg-layer-4/);
    });

    test('in single-bar mode barClassName hover still lands on the bar and the button is not a group', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          onBarClick={vi.fn()}
          barClassName="hover:bg-layer-4"
        />,
      );

      const barButton = screen.getByRole('button', { name: /accuracy/i });
      expect(barButton.className).not.toMatch(/\bgroup\b/);

      const barContainer = screen.getByRole('progressbar')
        .parentElement as HTMLElement;
      expect(barContainer.className).toMatch(/hover:bg-layer-4/);
    });
  });

  describe('inline mode', () => {
    test('applies text-secondary to bar titles by default', () => {
      render(
        <AnalyticsBarGroup title="Relevance" data={{ score: 0.5 }} inline />,
      );

      expect(screen.getByText('score').className).toMatch(/text-secondary/);
    });
  });

  describe('compare mode', () => {
    test('renders two progressbars per entry', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82, recall: 0.64 }}
          compareData={{ accuracy: 0.64, recall: 0.82 }}
        />,
      );

      expect(screen.getAllByRole('progressbar')).toHaveLength(4);
    });

    test('renders the entry title', () => {
      render(
        <AnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82 }}
          compareData={{ accuracy: 0.64 }}
        />,
      );

      expect(screen.getByText('accuracy')).toBeInTheDocument();
    });

    test('renders a positive delta badge with success styles', () => {
      render(
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
        <AnalyticsBarGroup
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
      render(<AnalyticsBarGroup title="Relevance" data={data} isLoading />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).toBeNull();
      expect(screen.queryByText('accuracy')).toBeNull();
    });
  });
});
