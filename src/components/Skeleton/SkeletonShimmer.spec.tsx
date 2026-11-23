import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';
import { SkeletonShimmer } from './SkeletonShimmer';
import { SkeletonVariant } from '@/types/skeleton';

const getContainer = (container: HTMLElement) =>
  container.querySelector('[aria-busy]') as HTMLElement;

describe('Dial UI Kit :: SkeletonShimmer', () => {
  it('marks the container busy', () => {
    const { container } = render(<SkeletonShimmer />);
    expect(getContainer(container)).toHaveAttribute('aria-busy', 'true');
  });

  it('hides the placeholders from assistive technology', () => {
    const { container } = render(
      <SkeletonShimmer>
        <Skeleton variant={SkeletonVariant.Text} width={100} height={20} />
      </SkeletonShimmer>,
    );
    const hidden = getContainer(container).querySelector('.contents');
    expect(hidden).toHaveAttribute('aria-hidden', 'true');
    expect(hidden?.children).toHaveLength(1);
  });

  it('keeps controls inside the placeholders out of the accessibility tree', () => {
    render(
      <SkeletonShimmer>
        <button type="button">Hidden action</button>
      </SkeletonShimmer>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { hidden: true, name: 'Hidden action' }),
    ).toBeInTheDocument();
  });

  it('keeps aria-busy when the caller passes its own', () => {
    const { container } = render(<SkeletonShimmer aria-busy={false} />);
    expect(getContainer(container)).toHaveAttribute('aria-busy', 'true');
  });

  it('renders one shimmer band that is hidden and not clickable', () => {
    const { container } = render(<SkeletonShimmer />);
    const bands = container.querySelectorAll('.pointer-events-none');
    expect(bands).toHaveLength(1);
    expect(bands[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('animates the band only when motion is allowed', () => {
    const { container } = render(<SkeletonShimmer />);
    const band = container.querySelector('.pointer-events-none');
    expect(band).toHaveClass('motion-safe:animate-skeleton-shimmer');
    expect(band).not.toHaveClass('animate-skeleton-shimmer');
  });

  it('renders no band when inactive', () => {
    const { container } = render(<SkeletonShimmer active={false} />);
    expect(container.querySelector('.pointer-events-none')).toBeNull();
  });

  it('switches off the pulse of skeletons inside it', () => {
    const { container } = render(<SkeletonShimmer />);
    expect(getContainer(container)).toHaveClass(
      '[&_.animate-pulse]:animate-none',
    );
  });

  it('announces the label from a live region outside the busy container', () => {
    const { container } = render(<SkeletonShimmer label="Loading plugins" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading plugins');
    expect(getContainer(container)).not.toContainElement(status);
  });

  it('renders no live region without a label', () => {
    render(<SkeletonShimmer />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps caller props and className on the container', () => {
    const { container } = render(
      <SkeletonShimmer className="gap-2" data-testid="region" />,
    );
    const region = getContainer(container);
    expect(region).toHaveClass('gap-2', 'relative', 'overflow-clip');
    expect(region).toHaveAttribute('data-testid', 'region');
  });
});
