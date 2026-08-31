import { IconCopy } from '@tabler/icons-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { MenuItemMark } from '@/types/menu-item';
import { MenuItem } from './MenuItem';

const icon = <IconCopy aria-hidden="true" />;

describe('Dial UI Kit :: MenuItem', () => {
  test('renders as a button carrying the given role and name', () => {
    render(<MenuItem role="menuitem" label="Rename" icon={icon} />);

    expect(
      screen.getByRole('menuitem', { name: 'Rename' }),
    ).toBeInTheDocument();
  });

  test('marks a chosen row with a trailing check', () => {
    const { rerender } = render(
      <MenuItem role="menuitem" label="English" mark={MenuItemMark.Check} />,
    );

    // Decorative: the row's aria state carries the selection.
    expect(
      screen.getByRole('menuitem').querySelector('.tabler-icon-check'),
    ).not.toBeInTheDocument();

    rerender(
      <MenuItem
        role="menuitem"
        label="English"
        mark={MenuItemMark.Check}
        selected
      />,
    );

    expect(
      screen.getByRole('menuitem').querySelector('.tabler-icon-check'),
    ).toBeInTheDocument();
  });

  test('leaves a checked row untinted so the check is the only mark', () => {
    render(
      <MenuItem
        role="menuitem"
        label="English"
        mark={MenuItemMark.Check}
        selected
      />,
    );

    expect(screen.getByRole('menuitem')).not.toHaveClass(
      'bg-control-accent-alpha',
    );
  });

  test('tints the row, with no glyph, for the select-list mark', () => {
    render(
      <MenuItem
        role="option"
        aria-selected
        label="Option 1"
        mark={MenuItemMark.Tint}
        selected
      />,
    );

    const row = screen.getByRole('option', { name: 'Option 1' });
    expect(row).toHaveClass('bg-control-accent-alpha');
    expect(row).not.toHaveClass('text-accent');
    expect(row.querySelector('.tabler-icon-check')).not.toBeInTheDocument();
  });

  test('tints the row and paints the label accent for the navigation mark', () => {
    render(
      <MenuItem
        role="menuitem"
        label="Settings"
        mark={MenuItemMark.Highlight}
        selected
      />,
    );

    expect(screen.getByRole('menuitem')).toHaveClass(
      'bg-control-accent-alpha',
      'text-accent',
    );
  });

  test('draws a decorative box and tints the row for the checkbox mark', () => {
    render(
      <MenuItem
        role="menuitemcheckbox"
        aria-checked
        label="Canvas"
        mark={MenuItemMark.Checkbox}
        selected
      />,
    );

    const row = screen.getByRole('menuitemcheckbox', { name: 'Canvas' });
    expect(row).toHaveClass('bg-control-accent-alpha');
    expect(row.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  test('greys the icon and the label out while disabled, and drops the tint', () => {
    render(
      <MenuItem
        role="menuitem"
        label="Rename"
        icon={icon}
        mark={MenuItemMark.Checkbox}
        selected
        disabled
      />,
    );

    const row = screen.getByRole('menuitem', { name: 'Rename', hidden: true });
    expect(row).toBeDisabled();
    expect(row).toHaveClass('bg-transparent', 'hover:bg-transparent');
    expect(
      row.querySelector('span.text-control-disable-primary svg'),
    ).toBeTruthy();
    expect(
      screen
        .getByText('Rename')
        .className.includes('text-control-disable-primary'),
    ).toBe(true);
  });

  test('paints a danger row in the error colour', () => {
    render(<MenuItem role="menuitem" label="Delete" icon={icon} danger />);

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass(
      'text-error',
    );
    expect(screen.getByText('Delete')).toHaveClass('text-error');
  });

  test('keeps the trailing slot when children replace the label', () => {
    render(
      <MenuItem role="menuitem" trailing={<span>caret</span>}>
        <span>Custom</span>
      </MenuItem>,
    );

    const row = screen.getByRole('menuitem');
    expect(row).toHaveTextContent('Custom');
    expect(row).toHaveTextContent('caret');
  });

  test('fires onClick, and stays silent while disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <MenuItem role="menuitem" label="Rename" onClick={onClick} />,
    );

    await user.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <MenuItem role="menuitem" label="Rename" onClick={onClick} disabled />,
    );
    await user.click(
      screen.getByRole('menuitem', { name: 'Rename', hidden: true }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('renders a right control beside the row rather than inside it', async () => {
    const user = userEvent.setup();
    const onRow = vi.fn();
    const onControl = vi.fn();
    render(
      <MenuItem
        role="option"
        aria-selected={false}
        label="GPT-4o"
        onClick={onRow}
        rightControl={
          <button type="button" aria-label="Favourite" onClick={onControl} />
        }
      />,
    );

    const row = screen.getByRole('option', { name: 'GPT-4o' });
    // Nested in the row, the control would land inside its accessible name
    // and swallow its click.
    expect(row.querySelector('button')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Favourite' }));
    expect(onControl).toHaveBeenCalledTimes(1);
    expect(onRow).not.toHaveBeenCalled();

    await user.click(row);
    expect(onRow).toHaveBeenCalledTimes(1);
  });

  test('moves the focus ring onto the wrapper when a right control is present', () => {
    render(
      <MenuItem
        role="option"
        aria-selected={false}
        label="GPT-4o"
        rightControl={<button type="button" aria-label="Favourite" />}
      />,
    );

    const row = screen.getByRole('option', { name: 'GPT-4o' });
    // The row is only the left part of the rectangle now, so the ring is drawn
    // by the wrapper around both of them.
    expect(row).toHaveClass('focus-visible:outline-none');
    expect(row).toHaveAttribute('data-menu-item-row');
    expect(row.parentElement).toHaveClass(
      'has-[[data-menu-item-row]:focus-visible]:outline',
    );
  });
});
