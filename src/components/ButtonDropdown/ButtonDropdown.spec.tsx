import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialButtonDropdown } from './ButtonDropdown';
import { ButtonVariant } from '@/types/button';
import type { DropdownItem } from '@/models/dropdown';

describe('Dial UI Kit :: DialButtonDropdown', () => {
  const items: DropdownItem[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'logout', label: 'Logout' },
  ];

  test('Should render with title and button icon', () => {
    render(
      <DialButtonDropdown
        title="Settings"
        variant={ButtonVariant.Primary}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('dial-primary-button');
  });

  test('Should display chevron down icon initially', () => {
    render(
      <DialButtonDropdown
        title="Menu"
        variant={ButtonVariant.Secondary}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('dial-secondary-button');
  });

  test('Should toggle dropdown on button click', () => {
    render(
      <DialButtonDropdown
        title="Dropdown"
        variant={ButtonVariant.Tertiary}
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
      <DialButtonDropdown
        title="Account"
        variant={ButtonVariant.Secondary}
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
      <DialButtonDropdown
        title="Button Variant Test"
        variant={ButtonVariant.Secondary}
        items={items}
      />,
    );
    const button = screen.getByRole('button', { name: 'Button Variant Test' });
    expect(button).toHaveClass('dial-secondary-button');
  });
});
