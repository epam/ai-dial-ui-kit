import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAnalyticsHistogram } from './Histogram';
import { DEFAULT_ANALYTICS_BAR_COLOR_MAP } from '@/components/Analytics/Bar/utils';

describe('Dial UI Kit :: DialAnalyticsHistogram', () => {
  test('renders the title', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0.5]} />);
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  test('renders the zero bucket plus one column per color-map band', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0.5]} />);
    expect(screen.getAllByRole('img')).toHaveLength(
      DEFAULT_ANALYTICS_BAR_COLOR_MAP.length + 1,
    );
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

  test('renders the zero bucket with no color and a secondary border', () => {
    render(<DialAnalyticsHistogram title="Distribution" values={[0, 0]} />);

    const zero = screen.getByRole('img', { name: '2 out of 2 values' });
    expect(zero.style.backgroundColor).toBe('');
    expect(zero.className).toMatch(/border-secondary/);
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
    // empty columns do not render a count
    const empty = screen.getAllByRole('img', {
      name: '0 out of 2 responses',
    })[0];
    expect(empty).toHaveTextContent('');
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

  test('fills populated columns with the band color and outlines empty ones', () => {
    render(
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

    // index 0 is the zero bucket (border-secondary); index 1 is the first empty band
    const empty = screen.getAllByRole('img', {
      name: '0 out of 2 responses',
    })[1];
    expect(empty.style.backgroundColor).toBe('');
    expect(empty.style.height).toBe('0%');
    expect(empty.className).toMatch(/border-primary/);
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
});
