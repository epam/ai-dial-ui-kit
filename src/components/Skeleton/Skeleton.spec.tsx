import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialSkeleton } from './Skeleton';
import {
  DialSkeletonVariant,
  DialSkeletonAvatarSize,
  DialSkeletonAvatarShape,
} from '@/types/skeleton';

describe('Dial UI Kit :: DialSkeleton', () => {
  it('renders default skeleton', () => {
    const { container } = render(<DialSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows children when loading is false', () => {
    render(
      <DialSkeleton loading={false}>
        <div data-testid="content">Loaded Content</div>
      </DialSkeleton>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Loaded Content')).toBeInTheDocument();
  });

  it('shows skeleton when loading is true', () => {
    render(
      <DialSkeleton loading={true}>
        <div data-testid="content">Loaded Content</div>
      </DialSkeleton>,
    );
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders with avatar', () => {
    const { container } = render(<DialSkeleton avatar />);
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders with square avatar', () => {
    const { container } = render(
      <DialSkeleton avatar={{ shape: DialSkeletonAvatarShape.Square }} />,
    );
    const avatarElement = container.querySelector('.rounded');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders with circle avatar', () => {
    const { container } = render(
      <DialSkeleton avatar={{ shape: DialSkeletonAvatarShape.Circle }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders without title', () => {
    const { container } = render(<DialSkeleton showTitle={false} />);
    const elements = container.querySelectorAll('.h-4');
    // Should have only paragraph rows, no title
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders with custom paragraph rows', () => {
    const { container } = render(<DialSkeleton paragraph={{ rows: 5 }} />);
    const paragraphContainer = container.querySelector(
      '.flex.flex-col.gap-3:last-child',
    );
    const rows = paragraphContainer?.querySelectorAll('.h-4');
    expect(rows?.length).toBe(5);
  });

  it('applies animation class when active', () => {
    const { container } = render(<DialSkeleton active />);
    const animatedElement = container.querySelector('.animate-pulse');
    expect(animatedElement).toBeInTheDocument();
  });

  it('does not apply animation class when not active', () => {
    const { container } = render(<DialSkeleton active={false} />);
    const animatedElement = container.querySelector('.animate-pulse');
    expect(animatedElement).not.toBeInTheDocument();
  });

  it('renders text variant with custom dimensions', () => {
    const { container } = render(
      <DialSkeleton
        variant={DialSkeletonVariant.Text}
        width="200px"
        height="20px"
      />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('20px');
  });

  it('renders circular variant', () => {
    const { container } = render(
      <DialSkeleton
        variant={DialSkeletonVariant.Circular}
        width={64}
        height={64}
      />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('rounded-full');
    expect(element.style.width).toBe('64px');
    expect(element.style.height).toBe('64px');
  });

  it('renders rectangular variant', () => {
    const { container } = render(
      <DialSkeleton
        variant={DialSkeletonVariant.Rectangular}
        width="300px"
        height="200px"
      />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('rounded');
    expect(element.style.width).toBe('300px');
    expect(element.style.height).toBe('200px');
  });

  it('renders default variant', () => {
    const { container } = render(
      <DialSkeleton variant={DialSkeletonVariant.Default} />,
    );
    // Default variant should render complex skeleton with title and paragraph
    expect(container.querySelector('.flex.gap-4')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<DialSkeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with large avatar size', () => {
    const { container } = render(
      <DialSkeleton avatar={{ size: DialSkeletonAvatarSize.Large }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('renders with small avatar size', () => {
    const { container } = render(
      <DialSkeleton avatar={{ size: DialSkeletonAvatarSize.Small }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('renders with default avatar size', () => {
    const { container } = render(
      <DialSkeleton avatar={{ size: DialSkeletonAvatarSize.Default }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('renders with numeric avatar size', () => {
    const { container } = render(<DialSkeleton avatar={{ size: 50 }} />);
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '50px', height: '50px' });
  });

  it('renders with custom title width', () => {
    const { container } = render(<DialSkeleton showTitle={{ width: '50%' }} />);
    const titleElement = container.querySelector('.h-4');
    expect(titleElement).toHaveStyle({ width: '50%' });
  });

  it('renders with custom paragraph widths array', () => {
    const { container } = render(
      <DialSkeleton paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }} />,
    );
    const paragraphContainer = container.querySelector(
      '.flex.flex-col.gap-3:last-child',
    );
    const rows = paragraphContainer?.querySelectorAll('.h-4');

    expect(rows?.[0]).toHaveStyle({ width: '100%' });
    expect(rows?.[1]).toHaveStyle({ width: '80%' });
    expect(rows?.[2]).toHaveStyle({ width: '60%' });
  });

  it('renders without paragraph', () => {
    const { container } = render(<DialSkeleton paragraph={false} />);
    const paragraphContainer = container.querySelector(
      '.flex.flex-col.gap-3:last-child',
    );
    expect(paragraphContainer).not.toBeInTheDocument();
  });

  it('forwards HTML attributes', () => {
    const { container } = render(
      <DialSkeleton data-testid="skeleton" role="status" />,
    );
    expect(container.firstChild).toHaveAttribute('data-testid', 'skeleton');
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });

  it('uses default paragraph widths when not specified', () => {
    const { container } = render(<DialSkeleton paragraph={{ rows: 3 }} />);
    const paragraphContainer = container.querySelector(
      '.flex.flex-col.gap-3:last-child',
    );
    const rows = paragraphContainer?.querySelectorAll('.h-4');

    // First and second rows should be 100%, last row should be 61%
    expect(rows?.[0]).toHaveStyle({ width: '100%' });
    expect(rows?.[1]).toHaveStyle({ width: '100%' });
    expect(rows?.[2]).toHaveStyle({ width: '61%' });
  });

  it('renders all skeleton variants', () => {
    const variants = [
      DialSkeletonVariant.Default,
      DialSkeletonVariant.Text,
      DialSkeletonVariant.Circular,
      DialSkeletonVariant.Rectangular,
    ];

    variants.forEach((variant) => {
      const { container } = render(
        <DialSkeleton variant={variant} width={100} height={100} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
