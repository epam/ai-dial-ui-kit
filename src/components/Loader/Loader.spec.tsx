import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialLoader } from './Loader';

describe('Dial UI Kit :: DialLoader', () => {
  test('renders with role=loader and default aria-label', () => {
    render(<DialLoader />);
    const el = screen.getByRole('loader', { name: 'Loading' });
    expect(el).toBeInTheDocument();
  });

  test('applies full width by default', () => {
    render(<DialLoader />);
    const el = screen.getByRole('loader');
    expect(el).toHaveClass('w-full', 'h-full');
  });

  test('renders inline when fullWidth is false', () => {
    render(<DialLoader fullWidth={false} />);
    const el = screen.getByRole('loader');
    expect(el).not.toHaveClass('w-full', 'h-full');
  });

  test('respects custom aria label', () => {
    render(<DialLoader ariaLabel="Busy" />);
    expect(screen.getByRole('loader', { name: 'Busy' })).toBeInTheDocument();
  });

  test('respects custom size via svg attributes', () => {
    const { container } = render(<DialLoader size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe('32');
    expect(svg?.getAttribute('width')).toBe('32');
  });
});
