import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAnalyticsCard } from './Card';
import { AnalyticsCardVariant } from '@/types/analytics';

describe('Dial UI Kit :: DialAnalyticsCard', () => {
  test('renders title, value and description', () => {
    render(
      <DialAnalyticsCard
        title="Total requests"
        value="12,480"
        description="+12% vs last week"
      />,
    );

    expect(screen.getByText('Total requests')).toBeInTheDocument();
    expect(screen.getByText('12,480')).toBeInTheDocument();
    expect(screen.getByText('+12% vs last week')).toBeInTheDocument();
  });

  test('applies the expected typography and color classes', () => {
    render(<DialAnalyticsCard title="Users" value="3,201" description="now" />);

    expect(screen.getByText('Users').className).toMatch(
      /dial-small-text.*text-secondary/,
    );
    expect(screen.getByText('3,201').className).toMatch(
      /dial-display2-text.*text-primary/,
    );
    expect(screen.getByText('now').className).toMatch(
      /dial-tiny-text.*text-secondary/,
    );
  });

  test('renders a ReactNode description', () => {
    render(
      <DialAnalyticsCard
        title="Active users"
        value="3,201"
        description={<span data-testid="custom-desc">+8.4%</span>}
      />,
    );

    expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
    expect(screen.getByText('+8.4%')).toBeInTheDocument();
  });

  test('omits the description node when not provided', () => {
    const { container } = render(
      <DialAnalyticsCard title="Errors" value="0" />,
    );

    expect(container.querySelector('.dial-tiny-text')).toBeNull();
  });

  test('merges custom className onto the container', () => {
    const { container } = render(
      <DialAnalyticsCard title="Errors" value="0" className="u-test w-40" />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/u-test/);
    expect(card.className).toMatch(/w-40/);
    expect(card.className).toMatch(/bg-layer-3/);
  });

  describe('compact variant', () => {
    test('applies compact container, title and value styles', () => {
      const { container } = render(
        <DialAnalyticsCard
          title="Avg. latency"
          value="248ms"
          variant={AnalyticsCardVariant.Compact}
        />,
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/bg-layer-2/);
      expect(card.className).not.toMatch(/bg-layer-3/);

      expect(screen.getByText('Avg. latency').className).toMatch(
        /dial-tiny-text.*text-secondary/,
      );
      expect(screen.getByText('248ms').className).toMatch(
        /dial-body-semi-text.*text-primary/,
      );
    });

    test('never renders a description, even when provided', () => {
      const { container } = render(
        <DialAnalyticsCard
          title="Avg. latency"
          value="248ms"
          description="should not show"
          variant={AnalyticsCardVariant.Compact}
        />,
      );

      expect(screen.queryByText('should not show')).toBeNull();
      expect(container.querySelector('.dial-tiny-text')?.textContent).toBe(
        'Avg. latency',
      );
    });
  });

  describe('error state', () => {
    test('renders an error tag in place of the value', () => {
      render(
        <DialAnalyticsCard
          title="Avg. latency"
          variant={AnalyticsCardVariant.Compact}
          error
        />,
      );

      expect(screen.getByText('Avg. latency')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    test('hides the description in the error state', () => {
      render(<DialAnalyticsCard title="Revenue" description="+10%" error />);

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('+10%')).toBeNull();
    });
  });
});
