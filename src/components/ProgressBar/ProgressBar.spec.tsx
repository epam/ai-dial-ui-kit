import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialProgressBar, DialProgressBarSize } from './ProgressBar';

describe('Dial UI Kit :: DialProgressBar', () => {
  test('renders with role=progressbar', () => {
    render(<DialProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('sets correct aria attributes', () => {
    render(<DialProgressBar value={40} max={200} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '200');
  });

  test('uses default aria-label', () => {
    render(<DialProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Progress',
    );
  });

  test('respects custom aria-label', () => {
    render(<DialProgressBar value={50} ariaLabel="Upload progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Upload progress',
    );
  });

  test('clamps value below 0 to 0', () => {
    render(<DialProgressBar value={-10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  test('clamps value above max to max', () => {
    render(<DialProgressBar value={150} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  });

  test('fill width reflects percentage', () => {
    const { container } = render(<DialProgressBar value={25} max={100} />);
    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill).toHaveStyle({ width: '25%' });
  });

  test('fill is 100% when value equals max', () => {
    const { container } = render(<DialProgressBar value={100} />);
    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill).toHaveStyle({ width: '100%' });
  });

  test('fill is 0% when value is 0', () => {
    const { container } = render(<DialProgressBar value={0} />);
    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill).toHaveStyle({ width: '0%' });
  });

  test('applies sm size class', () => {
    render(<DialProgressBar value={50} size={DialProgressBarSize.Small} />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-1');
  });

  test('applies md size class by default', () => {
    render(<DialProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-2');
  });

  test('applies custom className to track', () => {
    render(<DialProgressBar value={50} className="custom-class" />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class');
  });
});
