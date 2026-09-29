import { render, screen, fireEvent } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { InlineSelect, InlineSelectTrigger } from './InlineSelect';
import { ElementSize } from '../../../types/size';

const items = [
  { key: 'a', label: 'Option A' },
  { key: 'b', label: 'Option B' },
  { key: 'c', label: 'Option C' },
];

describe('Dial UI Kit :: DialInlineSelectTrigger', () => {
  test('Should render label and be accessible by role', () => {
    render(<InlineSelectTrigger label="Option A" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Option A');
  });

  test('Should have aria-haspopup="menu"', () => {
    render(<InlineSelectTrigger label="Option A" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'menu');
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<InlineSelectTrigger label="Option A" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<InlineSelectTrigger label="Option A" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('Should not rotate chevron when isOpen is false', () => {
    render(<InlineSelectTrigger label="Option A" isOpen={false} />);
    const icon = document.querySelector('svg');
    expect(icon).not.toHaveClass('rotate-180');
  });

  test('Should rotate chevron when isOpen is true', () => {
    render(<InlineSelectTrigger label="Option A" isOpen />);
    const icon = document.querySelector('svg');
    expect(icon).toHaveClass('rotate-180');
  });

  test('Should apply small size classes', () => {
    render(<InlineSelectTrigger label="Option A" size={ElementSize.Small} />);
    expect(screen.getByRole('button')).toHaveClass('h-[32px]');
  });

  test('Should apply default (standard) size classes', () => {
    render(<InlineSelectTrigger label="Option A" />);
    expect(screen.getByRole('button')).toHaveClass('h-[40px]');
  });

  test('Should apply custom CSS class', () => {
    render(
      <InlineSelectTrigger label="Option A" className="custom-trigger-class" />,
    );
    expect(screen.getByRole('button')).toHaveClass('custom-trigger-class');
  });

  test('Should keep its own classes and the public class next to a custom one', () => {
    render(
      <InlineSelectTrigger label="Option A" className="custom-trigger-class" />,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-trigger-class');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('dial-kit-inline-select');
  });

  test('Should apply labelClassName to the label', () => {
    render(
      <InlineSelectTrigger label="Option A" labelClassName="label-class" />,
    );

    expect(screen.getByText('Option A')).toHaveClass('label-class');
  });
});

describe('Dial UI Kit :: DialInlineSelect', () => {
  test('Should render trigger with first item label by default', () => {
    render(<InlineSelect items={items} />);
    expect(screen.getByRole('button')).toHaveTextContent('Option A');
  });

  test('Should render trigger with defaultSelectedKey label', () => {
    render(<InlineSelect items={items} defaultSelectedKey="b" />);
    expect(screen.getByRole('button')).toHaveTextContent('Option B');
  });

  test('Should open dropdown and list items on click', () => {
    render(<InlineSelect items={items} />);
    fireEvent.click(screen.getByRole('button'));
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
  });

  test('Should update trigger label and call onSelect when an item is selected', () => {
    const onSelect = vi.fn();
    render(<InlineSelect items={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Option C' }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'c' }),
    );
    expect(screen.getByRole('button')).toHaveTextContent('Option C');
  });

  test('Should respect controlled selectedKey and not update internally', () => {
    const onSelect = vi.fn();
    render(<InlineSelect items={items} selectedKey="a" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Option B' }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'b' }),
    );
    expect(screen.getByRole('button')).toHaveTextContent('Option A');
  });

  test('Should not open dropdown when disabled', () => {
    render(<InlineSelect items={items} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryAllByRole('menuitem')).toHaveLength(0);
  });

  test('Should reflect the open state on the trigger', () => {
    render(<InlineSelect items={items} />);
    const trigger = screen.getByRole('button');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('Should style the trigger and its label through triggerClassName and triggerLabelClassName', () => {
    render(
      <InlineSelect
        items={items}
        triggerClassName="pill"
        triggerLabelClassName="pill-label"
      />,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('pill');
    expect(trigger).toHaveClass('dial-kit-inline-select');
    expect(screen.getByText('Option A')).toHaveClass('pill-label');
  });

  test('Should stay closed while controlled closed, and still report the request to open', () => {
    const onOpenChange = vi.fn();
    render(
      <InlineSelect items={items} open={false} onOpenChange={onOpenChange} />,
    );
    const trigger = screen.getByRole('button');

    fireEvent.click(trigger);

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('Should open and close from the controlled open prop', () => {
    const { rerender } = render(<InlineSelect items={items} open />);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('button', { expanded: true })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );

    rerender(<InlineSelect items={items} open={false} />);

    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('Should put listStyle on the dropdown overlay', () => {
    render(
      <InlineSelect
        items={items}
        open
        listStyle={{ '--row-colour': 'red' } as CSSProperties}
      />,
    );

    expect(
      screen.getByRole('menu').style.getPropertyValue('--row-colour'),
    ).toBe('red');
  });

  test('Should report the open state through onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(<InlineSelect items={items} onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  test('Should announce the field name alongside the selected value', () => {
    render(<InlineSelect items={items} ariaLabel="Sort by" />);

    // An aria-label replaces the button content, so the value has to be folded
    // in or the control announces only "Sort by".
    expect(screen.getByRole('button')).toHaveAccessibleName(
      `Sort by ${String(items[0].label)}`,
    );
  });

  test('Should fall back to the selected value when no field name is given', () => {
    render(<InlineSelect items={items} />);

    expect(screen.getByRole('button')).toHaveAccessibleName(
      String(items[0].label),
    );
  });
});
