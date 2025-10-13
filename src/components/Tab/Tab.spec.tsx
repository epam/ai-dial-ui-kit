import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialTab } from './Tab';

describe('Dial UI Kit :: DialTab', () => {
  const baseTab = { id: 'tab1', name: 'Tab 1' };

  test('renders tab name', () => {
    render(<DialTab tab={baseTab} isActive={false} onClick={vi.fn()} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  test('calls onClick with tab id', () => {
    const onClick = vi.fn();
    render(<DialTab tab={baseTab} isActive={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('tab'));
    expect(onClick).toHaveBeenCalledWith('tab1');
  });

  test('applies disabled styles and disables click', () => {
    const onClick = vi.fn();
    render(
      <DialTab tab={baseTab} isActive={false} disabled onClick={onClick} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/pointer-events-none/);
    fireEvent.click(btn);

    expect(onClick).not.toHaveBeenCalledWith('tab1');
  });

  test('shows exclamation icon if invalid', () => {
    const { container } = render(
      <DialTab tab={baseTab} isActive={false} invalid onClick={vi.fn()} />,
    );
    expect(
      container.querySelector('.tabler-icon-exclamation-circle'),
    ).toBeInTheDocument();
  });

  test('applies active styles for horizontal', () => {
    render(<DialTab tab={baseTab} isActive isHorizontal onClick={vi.fn()} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/border-b-2/);
    expect(btn.className).toMatch(/bg-accent-primary-alpha/);
  });

  test('applies active styles for vertical', () => {
    render(
      <DialTab tab={baseTab} isActive isHorizontal={false} onClick={vi.fn()} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/border-l-2/);
    expect(btn.className).toMatch(/bg-accent-primary-alpha/);
  });

  test('applies text-primary for inactive', () => {
    render(<DialTab tab={baseTab} isActive={false} onClick={vi.fn()} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/text-primary/);
  });
});
