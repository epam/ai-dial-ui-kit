import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, expect, test, vi } from 'vitest';
import { DialDropdown } from './Dropdown';
import { DropdownItemType, DropdownTrigger } from '@/types/dropdown';
import { type DropdownItem } from '@/models/dropdown';
import { IconCheck } from '@tabler/icons-react';

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

  test('icon is rendered and inherits state classes (danger/disabled)', () => {
    render(
      <DialDropdown
        menu={{
          items: [
            {
              key: 'i1',
              label: 'With Icon Danger',
              danger: true,
              icon: <IconCheck />,
            },
            {
              key: 'i2',
              label: 'With Icon Disabled',
              disabled: true,
              icon: <IconCheck />,
            },
          ],
        }}
      >
        <button type="button">Open</button>
      </DialDropdown>,
    );

    openByClick();

    const dangerItem = screen.getByRole('menuitem', {
      name: 'With Icon Danger',
    });
    const dangerIconWrapper = dangerItem.querySelector('span.text-error svg');
    expect(dangerIconWrapper).toBeTruthy();

    const disabledItem = screen.getByRole('menuitem', {
      name: 'With Icon Disabled',
    });
    const disabledIconWrapper = disabledItem.querySelector(
      'span.text-secondary svg',
    );
    expect(disabledIconWrapper).toBeTruthy();
  });

  test('disabled branch in click handler short-circuits when click is forced', () => {
    const onItem = vi.fn();
    const onMenu = vi.fn();

    render(
      <DialDropdown
        menu={{
          items: [
            { key: 'd', label: 'Disabled', disabled: true, onClick: onItem },
          ],
          onClick: onMenu,
        }}
      >
        <button type="button">Open</button>
      </DialDropdown>,
    );

    openByClick();

    const btn = screen.getByRole('menuitem', {
      name: 'Disabled',
    }) as HTMLButtonElement;
    btn.removeAttribute('disabled');
    fireEvent.click(btn);

    expect(onItem).not.toHaveBeenCalled();
    expect(onMenu).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('becomes disabled while open -> closes via effect', () => {
    const { rerender } = render(
      <DialDropdown disabled={false} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    openByClick();
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(
      <DialDropdown disabled menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('ignores contextmenu when trigger does not include ContextMenu', () => {
    render(
      <DialDropdown menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    fireEvent.contextMenu(screen.getByRole('button', { name: /open/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('outsidePress closes by default, but ignores clicks inside outsidePressIgnoreRef', () => {
    const ignoreRef: { current: HTMLElement | null } = { current: null };

    const { container } = render(
      <div>
        <div
          ref={(el) => {
            ignoreRef.current = el;
          }}
        >
          <button type="button">Safe Outside</button>
        </div>
        <DialDropdown outsidePressIgnoreRef={ignoreRef} menu={{ items }}>
          <button type="button">Open</button>
        </DialDropdown>
      </div>,
    );

    const trigger = container.querySelector('[aria-haspopup="menu"]')!;
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Safe Outside' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('explicit placement uses flip middleware path', () => {
    render(
      <DialDropdown placement="bottom-end" menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    openByClick();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('opens on hover when enabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DialDropdown trigger={[DropdownTrigger.Hover]} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    const triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    await user.hover(triggerWrapper);

    expect(await screen.findByRole('menu')).toBeInTheDocument();

    await user.unhover(triggerWrapper);

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  test('controlled mode uses the `open` prop (isControlled ? !!open) regardless of defaultOpen or clicks', () => {
    const { container, rerender } = render(
      <DialDropdown open={false} defaultOpen={true} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );

    let triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(
      <DialDropdown open={true} defaultOpen={true} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(
      <DialDropdown open={false} defaultOpen={true} menu={{ items }}>
        <button type="button">Open</button>
      </DialDropdown>,
    );
    triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('handleItemClick returns early when item.disabled is true (even if DOM not disabled)', () => {
    const onItem = vi.fn();
    const onMenu = vi.fn();

    render(
      <DialDropdown
        menu={{
          items: [
            { key: 'd', label: 'Disabled', disabled: true, onClick: onItem },
          ],
          onClick: onMenu,
        }}
      >
        <button type="button">Open</button>
      </DialDropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    const btn = screen.getByRole('menuitem', {
      name: 'Disabled',
    }) as HTMLButtonElement;

    expect(btn).toBeDisabled();
    btn.removeAttribute('disabled');

    fireEvent.click(btn);

    expect(onItem).not.toHaveBeenCalled();
    expect(onMenu).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
