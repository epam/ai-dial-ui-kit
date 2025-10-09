import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialDropdown } from './Dropdown';
import { DropdownTrigger } from '@/types/dropdown';
import { DropdownItemType, type DropdownItem } from '@/models/dropdown';

const items: DropdownItem[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
  { key: 'd1', type: DropdownItemType.Divider },
  { key: 'danger', label: 'Danger', danger: true },
  { key: 'logout', label: 'Logout' },
];

const openByClick = () => {
  fireEvent.click(screen.getByRole('button', { name: /open/i }));
};

describe('Dial UI Kit :: Dropdown', () => {
  test('renders & toggles aria-expanded on open/close', () => {
    const { container } = render(
      <DialDropdown menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    const triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');

    openByClick();
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'true');
    // close by selecting an item
    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');
  });

  test('fires item click handlers and closes afterwards', () => {
    const onItem = vi.fn();
    const onMenu = vi.fn();
    render(
      <DialDropdown
        menu={{
          items: [
            { key: 'a', label: 'A', onClick: onItem },
            { key: 'b', label: 'B' },
          ],
          onClick: onMenu,
        }}
      >
        <button type="button">Open</button>
      </DialDropdown>,
    );

    openByClick();
    fireEvent.click(screen.getByRole('menuitem', { name: 'A' }));
    expect(onItem).toHaveBeenCalledTimes(1);
    expect(onMenu).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('disabled prevents opening', () => {
    render(
      <DialDropdown disabled menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    openByClick();
    expect(
      screen.queryByRole('menuitem', { name: 'Profile' }),
    ).not.toBeInTheDocument();
  });

  test('opens on context menu trigger', () => {
    render(
      <DialDropdown trigger={[DropdownTrigger.ContextMenu]} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    fireEvent.contextMenu(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('closable overlay shows button and calls onClose', () => {
    const onClose = vi.fn();
    render(
      <DialDropdown closable onClose={onClose} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    openByClick();
    const closeBtn = screen.getByRole('button', { name: 'Close dropdown' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('disabled item does not call handlers or close', () => {
    const onItem = vi.fn();
    const onMenu = vi.fn();
    render(
      <DialDropdown
        menu={{
          items: [
            { key: 'x', label: 'X', disabled: true, onClick: onItem },
            { key: 'y', label: 'Y' },
          ],
          onClick: onMenu,
        }}
      >
        <button type="button">Open</button>
      </DialDropdown>,
    );
    openByClick();
    fireEvent.click(screen.getByRole('menuitem', { name: 'X' }));
    expect(onItem).not.toHaveBeenCalled();
    expect(onMenu).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('danger item has proper class and overlay width hugs content', () => {
    render(
      <DialDropdown menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    openByClick();
    const dangerItem = screen.getByRole('menuitem', { name: 'Danger' });
    expect(dangerItem).toHaveClass('text-error');
    const menuEl = screen.getByRole('menu');
    expect(menuEl).toHaveClass('w-max');
  });

  test('outsideClosable=false keeps menu open on outside press', () => {
    render(
      <DialDropdown outsideClosable={false} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    openByClick();
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('custom renderOverlay path renders when menu is not provided', () => {
    render(
      <DialDropdown renderOverlay={() => <div role="none">custom</div>}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    openByClick();
    expect(screen.getByText('custom')).toBeInTheDocument();
  });
});
