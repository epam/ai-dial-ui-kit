import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAnalyticsBar } from './Bar';

describe('Dial UI Kit :: DialAnalyticsBar', () => {
  test('renders title and value labels', () => {
    render(
      <DialAnalyticsBar title="Relevance" value={0.82} valueLabel="82%" />,
    );

    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('82%')).toBeInTheDocument();
  });

  test('defaults the value label to the raw value', () => {
    render(<DialAnalyticsBar title="Score" value={0.5} />);
    expect(screen.getByText('0.5')).toBeInTheDocument();
  });

  test('exposes progressbar a11y attributes', () => {
    render(<DialAnalyticsBar title="Score" value={250} maxValue={1000} />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '250');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '1000');
    expect(bar).toHaveAttribute('aria-label', 'Score');
  });

  test('sizes and colors the fill from the value', () => {
    const { container } = render(
      <DialAnalyticsBar title="Score" value={0.25} />,
    );

    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill.style.width).toBe('25%');
    // ratio 0.25 -> band (0.2, 0.3]
    expect(fill.style.backgroundColor).toBe('rgb(224, 140, 63)');
  });

  test('leaves the fill empty (no color) when value is 0', () => {
    const { container } = render(<DialAnalyticsBar title="Score" value={0} />);

    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill.style.width).toBe('0%');
    expect(fill.style.backgroundColor).toBe('');
  });

  test('clamps values above maxValue and uses the full color', () => {
    const { container } = render(
      <DialAnalyticsBar title="Score" value={5} maxValue={1} />,
    );

    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(fill.style.backgroundColor).toBe('rgb(48, 224, 112)');
  });

  test('prefers an explicit ariaLabel over the title', () => {
    render(
      <DialAnalyticsBar title="Score" value={0.5} ariaLabel="Quality score" />,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Quality score',
    );
  });

  describe('error state', () => {
    test('shows an error tag instead of the value and colors the bar', () => {
      const { container } = render(<DialAnalyticsBar title="Score" error />);

      expect(screen.getByText('Error')).toBeInTheDocument();

      const bar = screen.getByRole('progressbar');
      expect(bar.className).toMatch(/bg-error/);
      expect(bar).not.toHaveAttribute('aria-valuenow');
      // no colored fill element is rendered
      expect(container.querySelector('[style]')).toBeNull();
    });

    test('does not require a value', () => {
      render(<DialAnalyticsBar title="Score" error />);
      expect(screen.queryByText('NaN')).toBeNull();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });
});
