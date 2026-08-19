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
    const { container } = render(
      <DialAnalyticsHistogram title="Distribution" values={[0.5]} />,
    );
    const xAxis = container.querySelector('[data-histogram-x-axis]');
    expect(xAxis).not.toBeNull();
    // leading zero bucket, range bands, then the exact full band -> "1"
    expect(xAxis).toHaveTextContent('0');
    expect(xAxis).toHaveTextContent('0-0.1');
    expect(xAxis).toHaveTextContent('0.1-0.2');
    expect(xAxis).toHaveTextContent('0.9-1');
    expect(xAxis).toHaveTextContent('1');
  });

  test('renders a Y-axis scaled to the dataset total, not the tallest bin', () => {
    const values = [
      0.02, 0.05, 0.07, 0.12, 0.18, 0.22, 0.25, 0.28, 0.31, 0.34, 0.41, 0.43,
      0.44, 0.48, 0.52, 0.55, 0.61, 0.68, 0.73, 0.79, 0.84, 0.88, 0.91, 0.95, 1,
      1,
    ];
    const { container } = render(
      <DialAnalyticsHistogram title="Distribution" values={values} />,
    );

    const ticks = [
      ...(container.querySelectorAll('[data-histogram-y-axis] span') ?? []),
    ].map((el) => el.textContent);
    expect(ticks).toEqual(['26', '13', '0']);
    expect(container.querySelectorAll('[data-histogram-grid]')).toHaveLength(3);

    const populated = screen.getByRole('img', { name: '4 out of 26 values' });
    expect(populated.style.height).toBe(`${(4 / 26) * 100}%`);
  });

  test('scales bars to the even Y-axis max when the dataset size is odd', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0, 0, 0]} />);

    const zero = screen.getByRole('img', { name: '3 out of 3 values' });
    expect(zero.style.height).toBe('75%');
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
    expect(
      container.querySelectorAll(
        '[aria-hidden="true"]:not([data-histogram-y-axis])',
      ).length,
    ).toBe(DEFAULT_ANALYTICS_BAR_COLOR_MAP.length);
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

    test('primary bars use a striped backgroundImage; compare bars use a solid backgroundColor', () => {
      // primary total=1, compare total=2 → different aria-labels for disambiguation
      render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          compareValues={[0.5, 0.3]}
          valueTitle="results"
        />,
      );

      // primary bar has stripes and no solid fill
      const primaryBar = screen.getByRole('img', {
        name: '1 out of 1 results',
      });
      expect(primaryBar.style.backgroundImage).toMatch(
        /repeating-linear-gradient/,
      );
      expect(primaryBar.style.backgroundColor).toBe('');

      // compare bars (aria-label "… out of 2 results") have a solid color and no stripe
      const compareBars = screen.getAllByRole('img', {
        name: '1 out of 2 results',
      });
      compareBars.forEach((bar) => {
        expect(bar.style.backgroundColor).not.toBe('');
        expect(bar.style.backgroundImage).toBe('');
      });
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
      const { container } = render(
        <DialAnalyticsHistogram
          title="Distribution"
          values={[0.5]}
          isLoading
        />,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: /out of/ })).toBeNull();
      expect(screen.getByText('Distribution')).toBeInTheDocument();
      expect(container.querySelector('[data-histogram-y-axis]')).toBeNull();
    });
  });
});
