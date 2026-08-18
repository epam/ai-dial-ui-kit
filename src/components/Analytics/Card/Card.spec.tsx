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

  describe('compare mode', () => {
    test('renders both values and their sub-titles', () => {
      render(
        <DialAnalyticsCard
          title="Response time"
          compareValues={[
            { title: 'This week', value: '248ms' },
            { title: 'Last week', value: '220ms' },
          ]}
        />,
      );

      expect(screen.getByText('248ms')).toBeInTheDocument();
      expect(screen.getByText('220ms')).toBeInTheDocument();
      expect(screen.getByText('This week')).toBeInTheDocument();
      expect(screen.getByText('Last week')).toBeInTheDocument();
    });

    test('applies the variant value style to each compare value', () => {
      render(
        <DialAnalyticsCard
          title="Score"
          compareValues={[
            { title: 'A', value: '90' },
            { title: 'B', value: '85' },
          ]}
        />,
      );

      expect(screen.getByText('90').className).toMatch(
        /dial-display2-text.*text-primary/,
      );
      expect(screen.getByText('85').className).toMatch(
        /dial-display2-text.*text-primary/,
      );
    });

    test('applies compact value style in compact variant', () => {
      render(
        <DialAnalyticsCard
          title="Score"
          variant={AnalyticsCardVariant.Compact}
          compareValues={[
            { title: 'A', value: '90' },
            { title: 'B', value: '85' },
          ]}
        />,
      );

      expect(screen.getByText('90').className).toMatch(
        /dial-body-semi-text.*text-primary/,
      );
    });

    test('renders a positive delta badge with success styles and + prefix', () => {
      render(<DialAnalyticsCard title="Revenue" delta={12} value="$10K" />);

      const badge = screen.getByText('+12');
      expect(badge.className).toMatch(/bg-success/);
      expect(badge.className).toMatch(/text-success/);
    });

    test('renders a zero delta badge with success styles', () => {
      render(<DialAnalyticsCard title="Revenue" delta={0} value="$10K" />);

      const badge = screen.getByText('+0');
      expect(badge.className).toMatch(/bg-success/);
    });

    test('renders a negative delta badge with error styles', () => {
      render(<DialAnalyticsCard title="Revenue" delta={-5} value="$10K" />);

      const badge = screen.getByText('-5');
      expect(badge.className).toMatch(/bg-error/);
      expect(badge.className).toMatch(/text-error/);
    });

    test('deltaPositive=false overrides a positive delta to error styles', () => {
      render(
        <DialAnalyticsCard
          title="Response time"
          delta={12}
          deltaPositive={false}
          value="248ms"
        />,
      );

      const badge = screen.getByText('+12');
      expect(badge.className).toMatch(/bg-error/);
      expect(badge.className).toMatch(/text-error/);
    });

    test('deltaPositive=true overrides a negative delta to success styles', () => {
      render(
        <DialAnalyticsCard
          title="Error rate"
          delta={-3}
          deltaPositive={true}
          value="0.4%"
        />,
      );

      const badge = screen.getByText('-3');
      expect(badge.className).toMatch(/bg-success/);
      expect(badge.className).toMatch(/text-success/);
    });

    test('renders the delta badge alongside the title', () => {
      render(<DialAnalyticsCard title="Revenue" delta={3} value="$10K" />);

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('+3')).toBeInTheDocument();
    });

    test('appends deltaUnit to a positive time delta with inverted error styles', () => {
      render(
        <DialAnalyticsCard
          title="Response time"
          delta={9}
          deltaUnit="s"
          deltaPositive={false}
          value="248ms"
        />,
      );

      const badge = screen.getByText('+9s');
      expect(badge.className).toMatch(/bg-error/);
      expect(badge.className).toMatch(/text-error/);
    });

    test('appends deltaUnit to a negative time delta with inverted success styles', () => {
      render(
        <DialAnalyticsCard
          title="Response time"
          delta={-19}
          deltaUnit="s"
          deltaPositive={true}
          value="201ms"
        />,
      );

      const badge = screen.getByText('-19s');
      expect(badge.className).toMatch(/bg-success/);
      expect(badge.className).toMatch(/text-success/);
    });
  });

  describe('loading state', () => {
    test('renders a loader in place of the value', () => {
      render(
        <DialAnalyticsCard title="Total requests" value="12,480" isLoading />,
      );

      expect(screen.getByText('Total requests')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByText('12,480')).toBeNull();
    });

    test('hides the description while loading', () => {
      render(
        <DialAnalyticsCard
          title="Revenue"
          value="$48.2K"
          description="+10%"
          isLoading
        />,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByText('+10%')).toBeNull();
    });

    test('renders the loader in the compact variant', () => {
      render(
        <DialAnalyticsCard
          title="Avg. latency"
          value="248ms"
          variant={AnalyticsCardVariant.Compact}
          isLoading
        />,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByText('248ms')).toBeNull();
    });

    test('prioritizes the error state over the loading state', () => {
      render(<DialAnalyticsCard title="Errors" isLoading error />);

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByRole('status')).toBeNull();
    });
  });
});
