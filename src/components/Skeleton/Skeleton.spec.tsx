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
        <div role="contentinfo">Loaded Content</div>
      </DialSkeleton>,
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Loaded Content')).toBeInTheDocument();
  });

  it('shows skeleton when loading is true', () => {
    render(
      <DialSkeleton loading={true}>
        <div role="contentinfo">Loaded Content</div>
      </DialSkeleton>,
    );
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
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
    const mainContainer = container.querySelector('.flex.gap-4');
    expect(mainContainer).toBeInTheDocument();

    const paragraphContainer = container.querySelector(
      '.flex.flex-col.gap-3:last-child',
    );
    expect(paragraphContainer).toBeInTheDocument();
  });

  it('renders with custom paragraph rows', () => {
    const { container } = render(
      <DialSkeleton paragraph={{ rows: 5 }} showTitle={false} />,
    );
    const paragraphContainer = container.querySelector('.flex.flex-col.gap-3');
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
    const { container } = render(
      <DialSkeleton showTitle={{ width: '50%' }} paragraph={false} />,
    );
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const titleElement = contentContainer?.querySelector('.h-4');
    expect(titleElement).toHaveStyle({ width: '50%' });
  });

  it('renders with custom paragraph widths array', () => {
    const { container } = render(
      <DialSkeleton
        paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
        showTitle={false}
      />,
    );
    const paragraphContainer = container.querySelector('.flex.flex-col.gap-3');
    const rows = paragraphContainer?.querySelectorAll('.h-4');

    expect(rows?.[0]).toHaveStyle({ width: '100%' });
    expect(rows?.[1]).toHaveStyle({ width: '80%' });
    expect(rows?.[2]).toHaveStyle({ width: '60%' });
  });

  it('renders without paragraph', () => {
    const { container } = render(<DialSkeleton paragraph={false} />);
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const paragraphContainer = contentContainer?.querySelector(
      '.flex.flex-col.gap-3',
    );
    expect(paragraphContainer).not.toBeInTheDocument();
  });

  it('forwards HTML attributes', () => {
    const { container } = render(
      <DialSkeleton role="status" aria-label="Loading..." />,
    );
    expect(container.firstChild).toHaveAttribute('aria-label', 'Loading...');
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });

  it('uses default paragraph widths when not specified', () => {
    const { container } = render(
      <DialSkeleton paragraph={{ rows: 3 }} showTitle={false} />,
    );
    const paragraphContainer = container.querySelector('.flex.flex-col.gap-3');
    const rows = paragraphContainer?.querySelectorAll('.h-4');

    expect(rows?.[0]).toHaveStyle({ width: '100%' });
    expect(rows?.[1]).toHaveStyle({ width: '100%' });
    expect(rows?.[2]).toHaveStyle({ width: '61%' });
  });

  it('renders overlay centered above a variant skeleton', () => {
    const { container } = render(
      <DialSkeleton
        variant={DialSkeletonVariant.Rectangular}
        width={100}
        height={100}
        overlay={<span data-testid="overlay-icon" />}
      />,
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('relative');
    expect(screen.getByTestId('overlay-icon')).toBeInTheDocument();
    const overlayWrapper = container.querySelector(
      '.absolute.inset-0.flex.items-center.justify-center',
    );
    expect(overlayWrapper).toBeInTheDocument();
  });

  it('does not render overlay wrapper when overlay is not provided', () => {
    const { container } = render(
      <DialSkeleton
        variant={DialSkeletonVariant.Rectangular}
        width={100}
        height={100}
      />,
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).not.toHaveClass('relative');
    const overlayWrapper = container.querySelector('.absolute.inset-0');
    expect(overlayWrapper).not.toBeInTheDocument();
  });

  it('renders overlay centered above a default variant skeleton', () => {
    const { container } = render(
      <DialSkeleton overlay={<span data-testid="overlay-icon" />} />,
    );
    expect(screen.getByTestId('overlay-icon')).toBeInTheDocument();
    const overlayWrapper = container.querySelector(
      '.absolute.inset-0.flex.items-center.justify-center',
    );
    expect(overlayWrapper).toBeInTheDocument();
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

  it('renders title and paragraph together', () => {
    const { container } = render(
      <DialSkeleton showTitle paragraph={{ rows: 2 }} />,
    );
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const allElements = contentContainer?.querySelectorAll('.h-4');

    expect(allElements?.length).toBe(3);
  });

  it('renders only title without paragraph', () => {
    const { container } = render(<DialSkeleton showTitle paragraph={false} />);
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const allElements = contentContainer?.querySelectorAll('.h-4');

    expect(allElements?.length).toBe(1);
  });
});
