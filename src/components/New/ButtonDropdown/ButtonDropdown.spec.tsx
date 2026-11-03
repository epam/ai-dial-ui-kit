import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ButtonDropdown } from './ButtonDropdown';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import type { DropdownItem } from '@/models/dropdown';

describe('Dial UI Kit :: DialButtonDropdown', () => {
  const items: DropdownItem[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'logout', label: 'Logout' },
  ];

  test('reports interactions without overriding controlled state and reflects external changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <ButtonDropdown
        label="Create"
        items={items}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    rerender(
      <ButtonDropdown
        label="Create"
        items={items}
        open
        onOpenChange={onOpenChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('menu', { name: 'Create' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('forwards searchable menu options and clears the query when dismissed', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(
      <ButtonDropdown
        label="Create"
        items={items}
        dropdownProps={{
          searchable: true,
          searchPlaceholder: 'Find action',
          noResultsLabel: 'No actions',
          onSearchChange,
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Create' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Find action' }),
      'zzz',
    );
    expect(screen.getByRole('status')).toHaveTextContent('No actions');
    await user.keyboard('{Escape}');
    expect(onSearchChange).toHaveBeenLastCalledWith('');
  });

  test('can hide the chevron for an icon-only trigger', () => {
    render(
      <ButtonDropdown
        aria-label="Create"
        iconBefore={<span>+</span>}
        iconAfter={null}
        items={items}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Create' });
    expect(trigger).toHaveTextContent('+');
    expect(trigger.querySelector('svg')).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole('menu', { name: 'Create' })).toBeInTheDocument();
  });

  test('keeps a disabled trigger from opening the dropdown', () => {
    const onOpenChange = vi.fn();
    render(
      <ButtonDropdown
        label="Create"
        items={items}
        disabled
        onOpenChange={onOpenChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('Should render with title and button icon', () => {
    render(<ButtonDropdown title="Settings" items={items} />);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('dial-kit-primary-solid-button');
  });

  test('Should display chevron down icon initially', () => {
    render(
      <ButtonDropdown
        title="Menu"
        variant={ButtonVariant.Neutral}
        appearance={ButtonAppearance.Outlined}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('dial-kit-neutral-outlined-button');

    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('transition-transform');
    expect(icon).not.toHaveClass('rotate-180');
  });

  test('Should rotate the chevron while the dropdown is open', () => {
    render(<ButtonDropdown title="Menu" items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });

    fireEvent.click(button);
    expect(button.querySelector('svg')).toHaveClass('rotate-180');

    fireEvent.click(button);
    expect(button.querySelector('svg')).not.toHaveClass('rotate-180');
  });

  test('Should toggle dropdown on button click', () => {
    render(
      <ButtonDropdown
        title="Dropdown"
        appearance={ButtonAppearance.Ghost}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Dropdown' });

    let dropdownItems = screen.queryAllByRole('menuitem');
    expect(dropdownItems.length).toBe(0);

    fireEvent.click(button);
    dropdownItems = screen.getAllByRole('menuitem');
    expect(dropdownItems.length).toBe(2);

    fireEvent.click(button);
    dropdownItems = screen.queryAllByRole('menuitem');
    expect(dropdownItems.length).toBe(0);
  });

  test('Should render all dropdown items correctly', () => {
    render(
      <ButtonDropdown
        title="Account"
        variant={ButtonVariant.Neutral}
        appearance={ButtonAppearance.Outlined}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Account' });
    fireEvent.click(button);

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('Profile');
    expect(menuItems[1]).toHaveTextContent('Logout');
  });

  test('Should apply correct variant classes for the button', () => {
    render(
      <ButtonDropdown
        title="Button Variant Test"
        variant={ButtonVariant.Neutral}
        appearance={ButtonAppearance.Outlined}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Button Variant Test' });
    expect(button).toHaveClass('dial-kit-neutral-outlined-button');
  });

  test('Should expose the menu popup on the button itself', () => {
    render(<ButtonDropdown title="Menu" items={items} />);

    // DialDropdown sets these on a wrapper span, which assistive tech never
    // reaches — they have to be on the focusable button.
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('Should forward dropdownProps to the menu panel', () => {
    render(
      <ButtonDropdown
        title="Menu"
        items={items}
        dropdownProps={{
          listClassName: 'min-w-[108px]',
          matchReferenceWidth: false,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('min-w-[108px]');
    expect(menu.style.minWidth).toBe('');
  });

  test('Should reflect the open state on the button', () => {
    render(<ButtonDropdown title="Menu" items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
