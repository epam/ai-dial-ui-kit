import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialSharedEntityIndicator } from './SharedEntityIndicator';

describe('Dial UI Kit :: DialSharedEntityIndicator', () => {
  test('renders with default accessible label', () => {
    render(<DialSharedEntityIndicator />);
    const svg = screen.getByRole('img', { name: 'Shared entity' });
    expect(svg).toBeInTheDocument();
  });

  test('applies default wrapper classes', () => {
    render(<DialSharedEntityIndicator />);
    const iconWrapper = screen.getByRole('img', {
      name: 'Shared entity',
    }).parentElement;
    expect(iconWrapper).toHaveClass('text-accent-primary');
  });

  test('accepts custom className', () => {
    render(<DialSharedEntityIndicator className="rounded-full p-1" />);
    expect(
      screen.getByRole('img', { name: 'Shared entity' }).parentElement,
    ).toHaveClass('rounded-full', 'p-1');
  });

  test('supports custom label', () => {
    render(<DialSharedEntityIndicator label="Opens in new window" />);
    expect(
      screen.getByRole('img', { name: 'Opens in new window' }),
    ).toBeInTheDocument();
  });

  test('uses default size and stroke', () => {
    render(<DialSharedEntityIndicator />);
    const svg = screen.getByRole('img', {
      name: 'Shared entity',
    });
    expect(svg.getAttribute('width')).toBe('10');
    expect(svg.getAttribute('height')).toBe('10');
    expect(svg.getAttribute('stroke-width')).toBe('2');
  });

  test('respects provided size and stroke props', () => {
    render(<DialSharedEntityIndicator size={16} stroke={10} />);
    const svg = screen.getByRole('img', {
      name: 'Shared entity',
    });
    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('height')).toBe('16');
    expect(svg.getAttribute('stroke-width')).toBe('10');
  });
});
