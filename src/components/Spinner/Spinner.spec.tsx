import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Spinner } from './Spinner';

describe('Dial UI Kit :: Spinner', () => {
  test('renders with role=img and default aria-label', () => {
    render(<Spinner />);
    expect(screen.getByRole('img', { name: 'Loading' })).toBeInTheDocument();
  });

  test('renders status container', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('does not apply full width by default', () => {
    render(<Spinner />);
    const el = screen.getByRole('status');
    expect(el).not.toHaveClass('size-full');
  });

  test('applies full width when fullWidth is true', () => {
    render(<Spinner fullWidth />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('size-full');
  });

  test('respects custom aria label', () => {
    render(<Spinner ariaLabel="Busy" />);
    expect(screen.getByRole('img', { name: 'Busy' })).toBeInTheDocument();
  });

  test('applies custom size via inline style', () => {
    render(<Spinner size={48} />);
    const ring = screen.getByRole('img');
    expect(ring).toHaveStyle({ width: '48px', height: '48px' });
  });

  test('renders with default size of 24px', () => {
    render(<Spinner />);
    const ring = screen.getByRole('img');
    expect(ring).toHaveStyle({ width: '40px', height: '40px' });
  });

  test('applies custom className to container', () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});
