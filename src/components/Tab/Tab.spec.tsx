import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialTab } from './Tab';

describe('Dial UI Kit :: DialTab', () => {
  const baseTab = { id: 'tab1', name: 'Tab 1' };

  test('renders tab name', () => {
    render(<DialTab tab={baseTab} active={false} onClick={vi.fn()} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  test('calls onClick with tab id', () => {
    const onClick = vi.fn();
    render(<DialTab tab={baseTab} active={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('tab'));
    expect(onClick).toHaveBeenCalledWith('tab1');
  });

  test('applies disabled styles and disables click', () => {
    const onClick = vi.fn();
    render(<DialTab tab={baseTab} active={false} disabled onClick={onClick} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/pointer-events-none/);
    fireEvent.click(btn);

    expect(onClick).not.toHaveBeenCalledWith('tab1');
  });

  test('shows exclamation icon if invalid', () => {
    const { container } = render(
      <DialTab tab={baseTab} active={false} invalid onClick={vi.fn()} />,
    );
    expect(
      container.querySelector('.tabler-icon-exclamation-circle'),
    ).toBeInTheDocument();
  });

  test('applies active styles for horizontal', () => {
    render(<DialTab tab={baseTab} active horizontal onClick={vi.fn()} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/border-b-2/);
    expect(btn.className).toMatch(/bg-accent-primary-alpha/);
  });

  test('applies active styles for vertical', () => {
    render(
      <DialTab tab={baseTab} active horizontal={false} onClick={vi.fn()} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/border-l-2/);
    expect(btn.className).toMatch(/bg-accent-primary-alpha/);
  });

  test('applies text-primary for inactive', () => {
    render(<DialTab tab={baseTab} active={false} onClick={vi.fn()} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/text-primary/);
  });

  test('applies bg-layer-4 when horizontal', () => {
    render(
      <DialTab tab={baseTab} active={false} horizontal onClick={vi.fn()} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/bg-layer-4/);
  });

  test('does not apply bg-layer-4 when vertical', () => {
    render(
      <DialTab
        tab={baseTab}
        active={false}
        horizontal={false}
        onClick={vi.fn()}
      />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).not.toMatch(/bg-layer-4/);
  });

  test('applies border-b-accent-primary when active & horizontal', () => {
    render(<DialTab tab={baseTab} active horizontal onClick={vi.fn()} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/border-b-accent-primary/);
  });

  test('applies border-l-accent-primary when active & vertical', () => {
    render(
      <DialTab tab={baseTab} active horizontal={false} onClick={vi.fn()} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/border-l-accent-primary/);
  });

  test('applies px-4 when horizontal', () => {
    render(
      <DialTab tab={baseTab} active={false} horizontal onClick={vi.fn()} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/px-4/);
    expect(btn.className).not.toMatch(/px-3/);
  });

  test('applies px-3 when vertical', () => {
    render(
      <DialTab
        tab={baseTab}
        active={false}
        horizontal={false}
        onClick={vi.fn()}
      />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/px-3/);
    expect(btn.className).not.toMatch(/px-4/);
  });

  test('disabled applies text-secondary and bg-layer-1 and removes active styles', () => {
    render(<DialTab tab={baseTab} active disabled onClick={vi.fn()} />);
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/text-secondary/);
    expect(btn.className).toMatch(/bg-layer-1/);
    expect(btn.className).not.toMatch(/bg-accent-primary-alpha/);
    expect(btn.className).not.toMatch(/text-primary/);
    expect(btn.className).not.toMatch(/border-(b|l)-accent-primary/);
  });

  test('invalid state wraps icon with text-error class (via prop)', () => {
    const { container } = render(
      <DialTab tab={baseTab} active={false} invalid onClick={vi.fn()} />,
    );
    expect(container.querySelector('.text-error')).toBeInTheDocument();
  });

  test('invalid state wraps icon with text-error class (via tab.invalid)', () => {
    const { container } = render(
      <DialTab
        tab={{ ...baseTab, invalid: true }}
        active={false}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector('.text-error')).toBeInTheDocument();
  });

  test('merges cssClass into final className', () => {
    render(
      <DialTab
        tab={baseTab}
        active={false}
        cssClass="u-test extra-class"
        onClick={vi.fn()}
      />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).toMatch(/u-test/);
    expect(btn.className).toMatch(/extra-class/);
  });

  test('inactive state does not include active background class', () => {
    render(
      <DialTab tab={baseTab} active={false} horizontal onClick={vi.fn()} />,
    );
    const btn = screen.getByRole('tab');
    expect(btn.className).not.toMatch(/bg-accent-primary-alpha/);
  });
});
