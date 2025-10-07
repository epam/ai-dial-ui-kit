import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import { DialDropdown } from './Dropdown';
import DialDropdownComponent from './DropdownComponent';
import { DialDropdownField } from './DropdownField';
import { DialDropdownItem } from './DropdownItem';
import { DialDropdownSelectedValue } from './DropdownSelectedValue';
import { MenuContext } from './MenuContext';

describe('Dial UI Kit :: Dropdown', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  let setHasFocusInside: ReturnType<typeof vi.fn>;
  let getItemProps: ReturnType<typeof vi.fn>;
  const emitSpy = vi.fn();

  beforeEach(() => {
    emitSpy.mockClear();
    setHasFocusInside = vi.fn();
    // Pass-through getItemProps — returns user props as-is so handlers get applied
    getItemProps = vi.fn(
      (userProps?: Record<string, unknown>) => userProps ?? {},
    );
  });

  const renderWithMenu = (ui: React.ReactNode) =>
    render(
      <MenuContext.Provider
        value={{
          getItemProps,
          activeIndex: null,
          setActiveIndex: vi.fn(),
          setHasFocusInside,
          isOpen: true,
        }}
      >
        {ui}
      </MenuContext.Provider>,
    );

  test('DialDropdown: opens on mousedown, renders items, closes on item click', () => {
    render(
      <DialDropdown placeholder="Pick option">
        <DialDropdown.Item dropdownItem={{ id: '1', name: 'One' }} />
        <DialDropdown.Item dropdownItem={{ id: '2', name: 'Two' }} />
      </DialDropdown>,
    );

    const trigger = screen.getByRole('menu');
    expect(
      screen.queryByRole('menuitem', { name: 'One' }),
    ).not.toBeInTheDocument();

    fireEvent.mouseDown(trigger);
    expect(screen.getByRole('menuitem', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Two' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: 'One' }));
    expect(
      screen.queryByRole('menuitem', { name: 'One' }),
    ).not.toBeInTheDocument();
  });

  test('DialDropdown: calls item onClick in single-select', () => {
    const onSelect = vi.fn();

    render(
      <DialDropdown placeholder="Pick">
        <DialDropdown.Item
          dropdownItem={{ id: 'dog', name: 'Dog' }}
          onClick={onSelect}
        />
      </DialDropdown>,
    );

    fireEvent.mouseDown(screen.getByRole('menu'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Dog' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('DialDropdown: supports a custom trigger element', () => {
    render(
      <DialDropdown trigger={<button type="button">Open pets</button>}>
        <DialDropdown.Item dropdownItem={{ id: 'cat', name: 'Cat' }} />
      </DialDropdown>,
    );

    const root = screen.getByRole('menu');
    fireEvent.mouseDown(root);
    expect(screen.getByRole('menuitem', { name: 'Cat' })).toBeInTheDocument();
  });

  test('DialDropdownComponent: controlled isMenuOpen shows items', () => {
    render(
      <DialDropdownComponent isMenuOpen>
        <button role="menuitem" aria-label="A" />
      </DialDropdownComponent>,
    );
    expect(screen.getByRole('menuitem', { name: 'A' })).toBeInTheDocument();
  });

  test('DialDropdownComponent: onOpenChange fires on trigger mousedown (open/close)', () => {
    const onOpenChange = vi.fn();
    render(
      <DialDropdownComponent onOpenChange={onOpenChange}>
        <button role="menuitem" aria-label="Item" />
      </DialDropdownComponent>,
    );

    const trigger = screen.getByRole('menu');

    act(() => {
      fireEvent.mouseDown(trigger);
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    act(() => {
      fireEvent.mouseDown(trigger);
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('DialDropdownComponent: adds spacing class when isMenu=true', () => {
    render(
      <DialDropdownComponent isMenu isMenuOpen>
        <button role="menuitem" aria-label="X" />
      </DialDropdownComponent>,
    );

    // List container adds "mt-2" when isMenu is true.
    const spacedList = document.querySelector('div.mt-2');
    expect(spacedList).toBeTruthy();
  });

  test('DialDropdownField: multiselect keeps the list open after clicking an item', () => {
    const onChange = vi.fn();
    const items = [
      { id: 'one', name: 'One' },
      { id: 'two', name: 'Two' },
    ];

    render(
      <DialDropdownField
        elementId="tags"
        fieldTitle="Tags"
        items={items}
        onChange={onChange}
        multipleValues={[]}
        placeholder="Select tags"
      />,
    );

    fireEvent.mouseDown(screen.getByRole('menu'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'One' }));
    expect(screen.getByRole('menuitem', { name: 'One' })).toBeInTheDocument();
  });

  test('DialDropdownItem: renders button with aria-label from item name', () => {
    render(<DialDropdownItem dropdownItem={{ id: 'x', name: 'X-Ray' }} />);
    expect(screen.getByRole('menuitem', { name: 'X-Ray' })).toBeInTheDocument();
  });

  test('DialDropdownItem: fires onClick in single-select', () => {
    const onClick = vi.fn();
    render(
      <DialDropdownItem
        dropdownItem={{ id: 'id-1', name: 'Item 1' }}
        onClick={onClick}
      />,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('DialDropdownItem: renders checkbox in multiselect mode', () => {
    render(
      <DialDropdownItem
        dropdownItem={{ id: 'a', name: 'A' }}
        multipleValues={[]}
        allItemsCount={2}
      />,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('DialDropdownItem: focus: calls props.onFocus and sets hasFocusInside(true)', () => {
    const onFocus = vi.fn();

    renderWithMenu(
      <DialDropdownItem
        dropdownItem={{ id: 'id-2', name: 'Item 2' }}
        onFocus={onFocus}
      >
        <span>Child</span>
      </DialDropdownItem>,
    );

    const node = screen.getByRole('menuitem');
    fireEvent.focus(node);

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(setHasFocusInside).toHaveBeenCalledWith(true);
  });

  test('DialDropdownItem: disabled adds attribute and styles', () => {
    render(
      <DialDropdownItem
        dropdownItem={{ id: 'a', name: 'Disabled A' }}
        disabled
      />,
    );
    const btn = screen.getByRole('menuitem', { name: 'Disabled A' });
    expect(btn).toBeDisabled();
    expect(btn.className).toMatch(/!cursor-not-allowed/);
    expect(btn.className).toMatch(/opacity-75/);
  });

  test('DialDropdownItem: isMenu applies height and padding classes', () => {
    render(<DialDropdownItem dropdownItem={{ id: 'b', name: 'B' }} isMenu />);
    const btn = screen.getByRole('menuitem', { name: 'B' });
    expect(btn.className).toMatch(/h-\[44px\]/);
    expect(btn.className).toMatch(/pl-6/);
  });

  test('DialDropdownSelectedValue: shows selected value and aria-label', () => {
    render(
      <DialDropdownSelectedValue
        selectedValue={{ id: 'foo', name: 'Foo' }}
        isOpen={false}
      />,
    );
    expect(screen.getByRole('menuitem', { name: 'Foo' })).toBeInTheDocument();
  });

  test('DialDropdownSelectedValue: shows placeholder when no selection', () => {
    render(<DialDropdownSelectedValue placeholder="Please select" />);
    expect(
      screen.getByRole('menuitem', { name: 'Please select' }),
    ).toBeInTheDocument();
  });

  test('DialDropdownSelectedValue: multipleValues are rendered as chips and set aria-label', () => {
    render(<DialDropdownSelectedValue multipleValues={['A', 'B', 'C']} />);
    expect(
      screen.getByRole('menuitem', { name: 'A, B, C' }),
    ).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
