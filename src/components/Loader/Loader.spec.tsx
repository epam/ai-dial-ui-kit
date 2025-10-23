import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialLoader } from './Loader';

describe('Dial UI Kit :: DialLoader', () => {
  test('renders with role=img and default aria-label', () => {
    render(<DialLoader />);
    const el = screen.getByRole('img', { name: 'Loading' });
    expect(el).toBeInTheDocument();
  });

  test('applies full width by default', () => {
    render(<DialLoader />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('w-full', 'h-full');
  });

  test('renders inline when fullWidth is false', () => {
    render(<DialLoader fullWidth={false} />);
    const el = screen.getByRole('status');
    expect(el).not.toHaveClass('w-full', 'h-full');
  });

  test('respects custom aria label', () => {
    render(<DialLoader ariaLabel="Busy" />);
    expect(screen.getByRole('img', { name: 'Busy' })).toBeInTheDocument();
  });

  test('respects custom size via svg attributes', () => {
    const { container } = render(<DialLoader size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe('32');
    expect(svg?.getAttribute('width')).toBe('32');
  });

  test('applies custom CSS class', () => {
    render(<DialLoader cssClass="custom-class" />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('custom-class');
  });

  test('applies custom icon class', () => {
    const { container } = render(<DialLoader iconClass="custom-icon-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-icon-class');
  });

  test('renders with default size when not specified', () => {
    const { container } = render(<DialLoader />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe('18');
    expect(svg?.getAttribute('width')).toBe('18');
  });
});
