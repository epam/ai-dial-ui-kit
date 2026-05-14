import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialSpinner } from './Spinner';

describe('Dial UI Kit :: DialSpinner', () => {
  test('renders with role=img and default aria-label', () => {
    render(<DialSpinner />);
    expect(screen.getByRole('img', { name: 'Loading' })).toBeInTheDocument();
  });

  test('renders status container', () => {
    render(<DialSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('does not apply full width by default', () => {
    render(<DialSpinner />);
    const el = screen.getByRole('status');
    expect(el).not.toHaveClass('size-full');
  });

  test('applies full width when fullWidth is true', () => {
    render(<DialSpinner fullWidth />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('size-full');
  });

  test('respects custom aria label', () => {
    render(<DialSpinner ariaLabel="Busy" />);
    expect(screen.getByRole('img', { name: 'Busy' })).toBeInTheDocument();
  });

  test('applies custom size via inline style', () => {
    render(<DialSpinner size={48} />);
    const ring = screen.getByRole('img');
    expect(ring).toHaveStyle({ width: '48px', height: '48px' });
  });

  test('renders with default size of 24px', () => {
    render(<DialSpinner />);
    const ring = screen.getByRole('img');
    expect(ring).toHaveStyle({ width: '24px', height: '24px' });
  });

  test('applies custom className to container', () => {
    render(<DialSpinner className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});
