import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByRole('button')).toHaveClass('h-[24px]');
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
});
