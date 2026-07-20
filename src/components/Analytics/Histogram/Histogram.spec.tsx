import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAnalyticsHistogram } from './Histogram';
import { DEFAULT_ANALYTICS_BAR_COLOR_MAP } from '@/components/Analytics/Bar/utils';

describe('Dial UI Kit :: DialAnalyticsHistogram', () => {
  test('renders the title', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0.5]} />);
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  test('renders an interval label per band, but only populated columns as images', () => {
    const { container } = render(
      <DialAnalyticsHistogram title="Distribution" values={[0.5]} />,
    );
    // every band (zero bucket + color-map bands) renders an interval label
    expect(container.querySelectorAll('.dial-caption-text')).toHaveLength(
      DEFAULT_ANALYTICS_BAR_COLOR_MAP.length + 1,
    );
    // only the single populated band is exposed as an image with a tooltip
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  test('renders an interval legend under each column', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0.5]} />);
    // leading zero bucket, range bands, then the exact full band -> "1"
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0-0.1')).toBeInTheDocument();
    expect(screen.getByText('0.1-0.2')).toBeInTheDocument();
    expect(screen.getByText('0.9-1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('renders the zero bucket with #FF4E50 color and a transparent border', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0, 0]} />);

    const zero = screen.getByRole('img', { name: '2 out of 2 values' });
    expect(zero.style.backgroundColor).toBe('rgb(255, 78, 80)');
    expect(zero.className).toMatch(/border-transparent/);
    expect(zero.style.height).toBe('100%');
  });

  test('shows counts inside populated bars when showCount is set', () => {
    render(
      <DialAnalyticsHistogram
        title="Distribution"
        values={[0.05, 0.06]}
        valueTitle="responses"
        showCount
      />,
    );

    const populated = screen.getByRole('img', {
      name: '2 out of 2 responses',
    });
    expect(populated).toHaveTextContent('2');
    // empty columns render no img/tooltip and therefore no count
    expect(
      screen.queryByRole('img', { name: '0 out of 2 responses' }),
    ).toBeNull();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  test('does not show counts by default', () => {
    render(
      <DialAnalyticsHistogram
        title="Distribution"
        values={[0.05, 0.06]}
        valueTitle="responses"
      />,
    );

    expect(
      screen.getByRole('img', { name: '2 out of 2 responses' }),
    ).toHaveTextContent('');
  });

  test('fills populated columns with the band color and renders no border or tooltip for empty ones', () => {
    const { container } = render(
      <DialAnalyticsHistogram
        title="Distribution"
        values={[0.05, 0.06]}
        valueTitle="responses"
      />,
    );

    const populated = screen.getByRole('img', {
      name: '2 out of 2 responses',
    });
    expect(populated.style.backgroundColor).toBe('rgb(242, 107, 91)'); // #F26B5B
    expect(populated.style.height).toBe('100%');
    expect(populated.className).toMatch(/border-transparent/);

    // empty bands are not exposed as images and carry no border or tooltip
    expect(
      screen.queryByRole('img', { name: '0 out of 2 responses' }),
    ).toBeNull();
    expect(screen.getAllByRole('img')).toHaveLength(1);
    // they still occupy a slot rendered as an aria-hidden spacer
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(
      DEFAULT_ANALYTICS_BAR_COLOR_MAP.length,
    );
  });

  test('exposes the share of the total as the column label/tooltip', () => {
    render(
      <DialAnalyticsHistogram
        title="Distribution"
        values={[0.05, 0.45, 1]}
        valueTitle="results"
      />,
    );

    // three populated bands (0.05, 0.45, 1), each holding one of three results
    expect(
      screen.getAllByRole('img', { name: '1 out of 3 results' }),
    ).toHaveLength(3);
  });

  test('defaults the tooltip noun to "values"', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0.05]} />);
    expect(
      screen.getByRole('img', { name: '1 out of 1 values' }),
    ).toBeInTheDocument();
  });

  describe('compare mode', () => {
    test('renders one img per populated primary band and one per populated compare band', () => {
      // primary: 0.5 → "0.4-0.5" (1 band)   compare: 0.5, 0.3 → "0.4-0.5" + "0.2-0.3" (2 bands)
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          compareValues={[0.5, 0.3]}
        />,
      );

      expect(screen.getAllByRole('img')).toHaveLength(3);
    });

    test('compare bars use a striped backgroundImage instead of a solid backgroundColor', () => {
      // primary total=1, compare total=2 → different aria-labels for disambiguation
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          compareValues={[0.5, 0.3]}
          valueTitle="results"
        />,
      );

      // compare bars (aria-label "… out of 2 results")
      const compareBars = screen.getAllByRole('img', {
        name: '1 out of 2 results',
      });
      compareBars.forEach((bar) => {
        expect(bar.style.backgroundImage).toMatch(/repeating-linear-gradient/);
        expect(bar.style.backgroundColor).toBe('');
      });

      // primary bar has a solid color and no stripe
      const primaryBar = screen.getByRole('img', {
        name: '1 out of 1 results',
      });
      expect(primaryBar.style.backgroundColor).not.toBe('');
      expect(primaryBar.style.backgroundImage).toBe('');
    });

    test('normalizes both datasets against the global max', () => {
      // primary: 1 value in "0.4-0.5";  compare: 2 values in "0.4-0.5" → globalMax=2
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          compareValues={[0.5, 0.49]}
        />,
      );

      const primary = screen.getByRole('img', { name: '1 out of 1 values' });
      const compare = screen.getByRole('img', { name: '2 out of 2 values' });

      expect(primary.style.height).toBe('50%');
      expect(compare.style.height).toBe('100%');
    });

    test('a zero-count compare column renders as an aria-hidden spacer', () => {
      // primary: 0.5 → "0.4-0.5";  compare: 0.3 → "0.2-0.3"
      // Each pair has at most one populated bar, so exactly 2 imgs total (not 4)
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          compareValues={[0.3]}
          valueTitle="items"
        />,
      );

      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    test('uses the compare dataset length as the total in compare bar aria-labels', () => {
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5, 0.51]}
          compareValues={[0.5]}
          valueTitle="responses"
        />,
      );

      // primary total=2 → but 0.5 and 0.51 are in different bands
      // compare total=1 → band "0.4-0.5" gets 1 of 1
      expect(
        screen.getByRole('img', { name: '1 out of 1 responses' }),
      ).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    test('renders a loader instead of the columns', () => {
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          isLoading
        />,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: /out of/ })).toBeNull();
      expect(screen.getByText('Distribution')).toBeInTheDocument();
    });
  });
});
