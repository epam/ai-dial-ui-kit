import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';
import {
  SkeletonVariant,
  SkeletonTone,
  SkeletonAvatarSize,
  SkeletonAvatarShape,
} from '@/types/skeleton';

describe('Dial UI Kit :: Skeleton', () => {
  it('renders default skeleton', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows children when loading is false', () => {
    render(
      <Skeleton loading={false}>
        <div role="contentinfo">Loaded Content</div>
      </Skeleton>,
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Loaded Content')).toBeInTheDocument();
  });

  it('shows skeleton when loading is true', () => {
    render(
      <Skeleton loading={true}>
        <div role="contentinfo">Loaded Content</div>
      </Skeleton>,
    );
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('renders with avatar', () => {
    const { container } = render(<Skeleton avatar />);
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders with square avatar', () => {
    const { container } = render(
      <Skeleton avatar={{ shape: SkeletonAvatarShape.Square }} />,
    );
    const avatarElement = container.querySelector('.rounded');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders with circle avatar', () => {
    const { container } = render(
      <Skeleton avatar={{ shape: SkeletonAvatarShape.Circle }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toBeInTheDocument();
  });

  it('renders without title', () => {
    const { container } = render(<Skeleton showTitle={false} />);
    const mainContainer = container.querySelector('.flex.gap-4');
    expect(mainContainer).toBeInTheDocument();

    const paragraphContainer = container.querySelector(
      '.flex.flex-col.gap-3:last-child',
    );
    expect(paragraphContainer).toBeInTheDocument();
  });

  it('renders with custom paragraph rows', () => {
    const { container } = render(
      <Skeleton paragraph={{ rows: 5 }} showTitle={false} />,
    );
    const paragraphContainer = container.querySelector('.flex.flex-col.gap-3');
    const rows = paragraphContainer?.querySelectorAll('.h-4');
    expect(rows?.length).toBe(5);
  });

  it('applies animation class when active', () => {
    const { container } = render(<Skeleton active />);
    const animatedElement = container.querySelector('.animate-pulse');
    expect(animatedElement).toBeInTheDocument();
  });

  it('does not apply animation class when not active', () => {
    const { container } = render(<Skeleton active={false} />);
    const animatedElement = container.querySelector('.animate-pulse');
    expect(animatedElement).not.toBeInTheDocument();
  });

  it('renders text variant with custom dimensions', () => {
    const { container } = render(
      <Skeleton variant={SkeletonVariant.Text} width="200px" height="20px" />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('20px');
  });

  it('renders circular variant', () => {
    const { container } = render(
      <Skeleton variant={SkeletonVariant.Circular} width={64} height={64} />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('rounded-full');
    expect(element.style.width).toBe('64px');
    expect(element.style.height).toBe('64px');
  });

  it('renders rectangular variant', () => {
    const { container } = render(
      <Skeleton
        variant={SkeletonVariant.Rectangular}
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
      <Skeleton variant={SkeletonVariant.Default} />,
    );
    expect(container.querySelector('.flex.gap-4')).toBeInTheDocument();
  });

  it.each([
    SkeletonVariant.Text,
    SkeletonVariant.Circular,
    SkeletonVariant.Rectangular,
  ])('uses the raised background by default for %s', (variant) => {
    const { container } = render(<Skeleton variant={variant} />);
    expect(container.firstChild).toHaveClass('bg-layer-raised');
  });

  it.each([
    [SkeletonTone.Dark, 'bg-layer-sunken'],
    [SkeletonTone.Light, 'bg-layer-base'],
  ])('applies %s tone to every default placeholder', (tone, background) => {
    const { container } = render(
      <Skeleton tone={tone} avatar paragraph={{ rows: 2 }} />,
    );
    const placeholders = container.querySelectorAll(`.${background}`);
    expect(placeholders).toHaveLength(4); // avatar, title and two rows
    expect(container.querySelector('.bg-layer-raised')).not.toBeInTheDocument();
    expect(container.firstChild).not.toHaveAttribute('tone');
  });

  it('preserves the raised background on all default placeholders without a tone', () => {
    const { container } = render(<Skeleton avatar paragraph={{ rows: 2 }} />);
    expect(container.querySelectorAll('.bg-layer-raised')).toHaveLength(4);
  });

  it.each([
    [SkeletonVariant.Text, SkeletonTone.Dark, 'bg-layer-sunken'],
    [SkeletonVariant.Text, SkeletonTone.Light, 'bg-layer-base'],
    [SkeletonVariant.Circular, SkeletonTone.Dark, 'bg-layer-sunken'],
    [SkeletonVariant.Circular, SkeletonTone.Light, 'bg-layer-base'],
    [SkeletonVariant.Rectangular, SkeletonTone.Dark, 'bg-layer-sunken'],
    [SkeletonVariant.Rectangular, SkeletonTone.Light, 'bg-layer-base'],
  ])(
    'applies %s / %s tone without forwarding it to the DOM',
    (variant, tone, background) => {
      const { container } = render(<Skeleton variant={variant} tone={tone} />);
      expect(container.firstChild).toHaveClass(background);
      expect(container.firstChild).not.toHaveClass('bg-layer-raised');
      expect(container.firstChild).not.toHaveAttribute('tone');
    },
  );

  it.each([SkeletonVariant.Default, SkeletonVariant.Text])(
    'lets className override the tone on %s placeholders',
    (variant) => {
      const { container } = render(
        <Skeleton
          variant={variant}
          tone={SkeletonTone.Dark}
          className="bg-layer-base"
          avatar
          paragraph={{ rows: 2 }}
        />,
      );
      const placeholders =
        variant === SkeletonVariant.Default
          ? container.querySelectorAll('.h-4, .rounded-full')
          : [container.firstChild];
      expect(placeholders).toHaveLength(
        variant === SkeletonVariant.Default ? 4 : 1,
      );
      placeholders.forEach((element) => {
        expect(element).toHaveClass('bg-layer-base');
        expect(element).not.toHaveClass('bg-layer-sunken');
      });
    },
  );

  it.each([SkeletonVariant.Default, SkeletonVariant.Text])(
    'lets color override the tone on %s placeholders',
    (variant) => {
      const { container } = render(
        <Skeleton
          variant={variant}
          tone={SkeletonTone.Light}
          color="rgb(1, 2, 3)"
          avatar
          paragraph={{ rows: 2 }}
        />,
      );
      const placeholders =
        variant === SkeletonVariant.Default
          ? container.querySelectorAll('.h-4, .rounded-full')
          : [container.firstChild];
      expect(placeholders).toHaveLength(
        variant === SkeletonVariant.Default ? 4 : 1,
      );
      placeholders.forEach((element) => {
        expect(element).toHaveClass('bg-layer-base');
        expect(element).toHaveStyle({ backgroundColor: 'rgb(1, 2, 3)' });
      });
    },
  );

  it.each([SkeletonVariant.Text, SkeletonVariant.Rectangular])(
    'lets className override the radius of the %s variant',
    (variant) => {
      const { container } = render(
        <Skeleton variant={variant} className="rounded-xl bg-layer-sunken" />,
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('rounded-xl', 'bg-layer-sunken');
      expect(element).not.toHaveClass('rounded');
      expect(element).not.toHaveClass('bg-layer-raised');
    },
  );

  it('lets className override the overlay positioning of a variant skeleton', () => {
    const { container } = render(
      <Skeleton
        variant={SkeletonVariant.Rectangular}
        width={100}
        height={100}
        className="absolute"
        overlay={<span data-testid="overlay-icon" />}
      />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('absolute');
    expect(element).not.toHaveClass('relative');
  });

  it('lets className override the animation of a variant skeleton', () => {
    const { container } = render(
      <Skeleton variant={SkeletonVariant.Text} className="animate-none" />,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('animate-none');
    expect(element).not.toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with large avatar size', () => {
    const { container } = render(
      <Skeleton avatar={{ size: SkeletonAvatarSize.Large }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('renders with small avatar size', () => {
    const { container } = render(
      <Skeleton avatar={{ size: SkeletonAvatarSize.Small }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('renders with default avatar size', () => {
    const { container } = render(
      <Skeleton avatar={{ size: SkeletonAvatarSize.Default }} />,
    );
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('renders with numeric avatar size', () => {
    const { container } = render(<Skeleton avatar={{ size: 50 }} />);
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toHaveStyle({ width: '50px', height: '50px' });
  });

  it('renders with custom title width', () => {
    const { container } = render(
      <Skeleton showTitle={{ width: '50%' }} paragraph={false} />,
    );
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const titleElement = contentContainer?.querySelector('.h-4');
    expect(titleElement).toHaveStyle({ width: '50%' });
  });

  it('renders with custom paragraph widths array', () => {
    const { container } = render(
      <Skeleton
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
    const { container } = render(<Skeleton paragraph={false} />);
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
      <Skeleton role="status" aria-label="Loading..." />,
    );
    expect(container.firstChild).toHaveAttribute('aria-label', 'Loading...');
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });

  it('uses default paragraph widths when not specified', () => {
    const { container } = render(
      <Skeleton paragraph={{ rows: 3 }} showTitle={false} />,
    );
    const paragraphContainer = container.querySelector('.flex.flex-col.gap-3');
    const rows = paragraphContainer?.querySelectorAll('.h-4');

    expect(rows?.[0]).toHaveStyle({ width: '100%' });
    expect(rows?.[1]).toHaveStyle({ width: '100%' });
    expect(rows?.[2]).toHaveStyle({ width: '61%' });
  });

  it('renders overlay centered above a variant skeleton', () => {
    const { container } = render(
      <Skeleton
        variant={SkeletonVariant.Rectangular}
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
      <Skeleton
        variant={SkeletonVariant.Rectangular}
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
      <Skeleton overlay={<span data-testid="overlay-icon" />} />,
    );
    expect(screen.getByTestId('overlay-icon')).toBeInTheDocument();
    const overlayWrapper = container.querySelector(
      '.absolute.inset-0.flex.items-center.justify-center',
    );
    expect(overlayWrapper).toBeInTheDocument();
  });

  it('renders all skeleton variants', () => {
    const variants = [
      SkeletonVariant.Default,
      SkeletonVariant.Text,
      SkeletonVariant.Circular,
      SkeletonVariant.Rectangular,
    ];

    variants.forEach((variant) => {
      const { container } = render(
        <Skeleton variant={variant} width={100} height={100} />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('renders title and paragraph together', () => {
    const { container } = render(
      <Skeleton showTitle paragraph={{ rows: 2 }} />,
    );
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const allElements = contentContainer?.querySelectorAll('.h-4');

    expect(allElements?.length).toBe(3);
  });

  it('renders only title without paragraph', () => {
    const { container } = render(<Skeleton showTitle paragraph={false} />);
    const contentContainer = container.querySelector(
      '.flex-1.flex.flex-col.gap-3',
    );
    const allElements = contentContainer?.querySelectorAll('.h-4');

    expect(allElements?.length).toBe(1);
  });
});
