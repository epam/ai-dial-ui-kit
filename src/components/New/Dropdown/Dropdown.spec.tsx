import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, expect, test, vi } from 'vitest';
import { Dropdown } from './Dropdown';
import { DropdownItemType, DropdownTrigger } from '@/types/dropdown';
import { type DropdownItem } from '@/models/dropdown';
import { IconCheck } from '@tabler/icons-react';

const items: DropdownItem[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
  { key: 'd1', type: DropdownItemType.Divider },
  { key: 'error', label: 'Error', danger: true },
  { key: 'logout', label: 'Logout' },
];

const openByClick = () => {
  fireEvent.click(screen.getByRole('button', { name: /open/i }));
};

const readPosition = (el: HTMLElement) =>
  el.style.transform || `${el.style.left}|${el.style.top}`;

describe('Dial UI Kit :: Dropdown', () => {
  test('renders & toggles aria-expanded on open/close', () => {
    const { container } = render(
      <Dropdown items={items}>
        <button type="button">Open</button>
      </Dropdown>,
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
      <Dropdown
        items={[
          { key: 'a', label: 'A', onClick: onItem },
          { key: 'b', label: 'B' },
        ]}
        onItemClick={onMenu}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();
    fireEvent.click(screen.getByRole('menuitem', { name: 'A' }));
    expect(onItem).toHaveBeenCalledTimes(1);
    expect(onMenu).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('disabled prevents opening', () => {
    render(
      <Dropdown disabled items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();
    expect(
      screen.queryByRole('menuitem', { name: 'Profile' }),
    ).not.toBeInTheDocument();
  });

  test('opens on context menu trigger', () => {
    render(
      <Dropdown trigger={[DropdownTrigger.ContextMenu]} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    fireEvent.contextMenu(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('closable overlay shows button and calls onClose', () => {
    const onClose = vi.fn();
    render(
      <Dropdown closable onClose={onClose} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
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
      <Dropdown
        items={[
          { key: 'x', label: 'X', disabled: true, onClick: onItem },
          { key: 'y', label: 'Y' },
        ]}
        onItemClick={onMenu}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    fireEvent.click(screen.getByRole('menuitem', { name: 'X' }));
    expect(onItem).not.toHaveBeenCalled();
    expect(onMenu).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('error item has proper class and overlay width hugs content', () => {
    render(
      <Dropdown items={items} matchReferenceWidth={false}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    const errorItem = screen.getByRole('menuitem', { name: 'Error' });
    expect(errorItem).toHaveClass('text-error');
    const menuEl = screen.getByRole('menu');
    expect(menuEl).toHaveClass('w-max');
  });

  test('renders header item type correctly', () => {
    const itemsWithHeader: DropdownItem[] = [
      { key: 'item1', label: 'Item 1' },
      { key: 'd1', type: DropdownItemType.Divider },
      {
        key: 'h1',
        type: DropdownItemType.PlainText,
        label: <span>Section Title</span>,
      },
      { key: 'item2', label: 'Item 2' },
    ];
    render(
      <Dropdown items={itemsWithHeader}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Item 1' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Item 2' }),
    ).toBeInTheDocument();
  });

  test('header item does not act as clickable menuitem', () => {
    const onMenu = vi.fn();
    const itemsWithHeader: DropdownItem[] = [
      { key: 'item1', label: 'Item 1' },
      {
        key: 'h1',
        type: DropdownItemType.PlainText,
        label: <span>Section Header</span>,
      },
    ];
    render(
      <Dropdown items={itemsWithHeader} onItemClick={onMenu}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    const headerElement = screen.getByText('Section Header');
    fireEvent.click(headerElement);
    expect(onMenu).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('outsideClosable=false keeps menu open on outside press', () => {
    render(
      <Dropdown outsideClosable={false} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('custom renderOverlay path renders when menu is not provided', () => {
    render(
      <Dropdown renderOverlay={() => <div role="none">custom</div>}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  test('icon is rendered and inherits state classes (danger/disabled)', () => {
    render(
      <Dropdown
        items={[
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
        ]}
      >
        <button type="button">Open</button>
      </Dropdown>,
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
      <Dropdown
        items={[
          { key: 'd', label: 'Disabled', disabled: true, onClick: onItem },
        ]}
        onItemClick={onMenu}
      >
        <button type="button">Open</button>
      </Dropdown>,
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
      <Dropdown disabled={false} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(
      <Dropdown disabled items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('ignores contextmenu when trigger does not include ContextMenu', () => {
    render(
      <Dropdown items={items}>
        <button type="button">Open</button>
      </Dropdown>,
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
        <Dropdown outsidePressIgnoreRef={ignoreRef} items={items}>
          <button type="button">Open</button>
        </Dropdown>
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
      <Dropdown placement="bottom-end" items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('opens on hover when enabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Dropdown trigger={[DropdownTrigger.Hover]} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
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
      <Dropdown open={false} defaultOpen={true} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    let triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(
      <Dropdown open={true} defaultOpen={true} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(
      <Dropdown open={false} defaultOpen={true} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    triggerWrapper = container.querySelector('[aria-haspopup="menu"]')!;
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('handleItemClick returns early when item.disabled is true (even if DOM not disabled)', () => {
    const onItem = vi.fn();
    const onMenu = vi.fn();

    render(
      <Dropdown
        items={[
          { key: 'd', label: 'Disabled', disabled: true, onClick: onItem },
        ]}
        onItemClick={onMenu}
      >
        <button type="button">Open</button>
      </Dropdown>,
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

  test('renders menu.header (function) above items and footer (node) below items', () => {
    const footerText = 'Times are displayed in UTC';
    const headerText = 'Custom Time Range';

    render(
      <Dropdown
        items={items}
        menuHeader={() => <div>{headerText}</div>}
        menuFooter={<div>{footerText}</div>}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();

    const menuEl = screen.getByRole('menu');
    const headerEl = screen.getByText(headerText);
    const firstItem = screen.getByRole('menuitem', { name: 'Profile' });
    const footerEl = screen.getByText(footerText);
    const lastItem = screen.getByRole('menuitem', { name: 'Logout' });

    expect(
      headerEl.compareDocumentPosition(firstItem) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    expect(
      lastItem.compareDocumentPosition(footerEl) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    expect(menuEl).toContainElement(headerEl);
    expect(menuEl).toContainElement(footerEl);
  });

  test('contextmenu does not open when disabled=true even if ContextMenu is in triggers', () => {
    render(
      <Dropdown disabled trigger={[DropdownTrigger.ContextMenu]} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    fireEvent.contextMenu(screen.getByRole('button', { name: /open/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  test('menu.header (function) renders above items and does not close on click', () => {
    const headerText = 'Custom Time Range';
    const simpleItems: DropdownItem[] = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
    ];

    render(
      <Dropdown
        items={simpleItems}
        menuHeader={() => <div role="hdr">{headerText}</div>}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();

    const menu = screen.getByRole('menu');
    const headerEl = screen.getByRole('hdr');
    const firstItem = screen.getByRole('menuitem', { name: 'A' });

    expect(menu).toContainElement(headerEl);

    expect(
      headerEl.compareDocumentPosition(firstItem) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    expect(
      screen.queryByRole('menuitem', { name: headerText }),
    ).not.toBeInTheDocument();

    fireEvent.click(headerEl);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('menu.header (ReactNode) renders when provided as a node', () => {
    const headerText = 'Filters';
    render(
      <Dropdown
        items={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
        ]}
        menuHeader={<div>{headerText}</div>}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();

    const headerEl = screen.getByText(headerText);
    expect(headerEl).toBeInTheDocument();

    expect(
      screen.queryByRole('menuitem', { name: headerText }),
    ).not.toBeInTheDocument();
  });

  test('menu.footer (function) is invoked and its content renders after items', () => {
    const footerText = 'Times are displayed in UTC';
    const footerFn = vi.fn(() => <div role="footer">{footerText}</div>);

    render(
      <Dropdown
        items={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
        ]}
        menuFooter={footerFn}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();

    expect(footerFn.mock.calls.length).toBeGreaterThan(0);

    const footerEl = screen.getByRole('footer');
    expect(footerEl).toBeInTheDocument();
    expect(screen.getByText(footerText)).toBeInTheDocument();

    const lastItem = screen.getByRole('menuitem', { name: 'B' });
    expect(
      lastItem.compareDocumentPosition(footerEl) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test('anchorToMouse + ContextMenu opens on right click', () => {
    render(
      <Dropdown
        anchorToMouse
        trigger={[DropdownTrigger.ContextMenu]}
        items={items}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    fireEvent.contextMenu(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('anchorToMouse + Click opens on left click', () => {
    render(
      <Dropdown anchorToMouse trigger={[DropdownTrigger.Click]} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('calls onOpenChange on open and close', () => {
    const onOpenChange = vi.fn();
    render(
      <Dropdown onOpenChange={onOpenChange} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('matchReferenceWidth=false -> menu has w-max and no inline min-width', () => {
    render(
      <Dropdown matchReferenceWidth={false} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    openByClick();
    const menuEl = screen.getByRole('menu');
    expect(menuEl).toHaveClass('w-max');
    expect(menuEl.getAttribute('style') || '').not.toMatch(/min-width:/i);
    expect(menuEl.style.minWidth).toBe('');
  });

  test('changes menu position based on clientX/clientY from pointerdown', async () => {
    const { container } = render(
      <Dropdown anchorToMouse trigger={[DropdownTrigger.Click]} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    const wrapper = container.querySelector('[aria-haspopup="menu"]')!;

    fireEvent.mouseDown(wrapper, { clientX: 10, clientY: 20 });
    fireEvent.click(screen.getByRole('button', { name: /open/i }));

    const menu1 = await screen.findByRole('menu');
    await waitFor(() => expect(readPosition(menu1)).not.toBe(''));
    const pos1 = readPosition(menu1);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );

    fireEvent.mouseDown(wrapper, { clientX: 150, clientY: 250 });
    fireEvent.click(screen.getByRole('button', { name: /open/i }));

    const menu2 = await screen.findByRole('menu');
    await waitFor(() => expect(readPosition(menu2)).not.toBe(''));
    const pos2 = readPosition(menu2);

    expect(pos1).not.toBe(pos2);
  });

  test('does not change position when anchorToMouse=false (covers early return)', async () => {
    const { container } = render(
      <Dropdown trigger={[DropdownTrigger.Click]} items={items}>
        <button type="button">Open</button>
      </Dropdown>,
    );

    const wrapper = container.querySelector('[aria-haspopup="menu"]')!;

    fireEvent.mouseDown(wrapper, { clientX: 10, clientY: 20 });
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    const menu1 = await screen.findByRole('menu');
    const pos1 = readPosition(menu1);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );

    fireEvent.mouseDown(wrapper, { clientX: 200, clientY: 100 });
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    const menu2 = await screen.findByRole('menu');
    const pos2 = readPosition(menu2);

    expect(pos1).toBe(pos2);
  });

  test('closes menu opened by context-menu trigger on side click', () => {
    const { container } = render(
      <Dropdown
        trigger={[DropdownTrigger.ContextMenu]}
        items={items}
        anchorToMouse
      >
        <button type="button">Open</button>
      </Dropdown>,
    );

    const wrapper = container.querySelector('[aria-haspopup="menu"]')!;
    const button = screen.getByRole('button', { name: /open/i });

    fireEvent.contextMenu(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.mouseDown(wrapper);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('item with children renders as submenu trigger (no onClick, has aria-haspopup)', () => {
    const itemsWithSub: DropdownItem[] = [
      { key: 'a', label: 'Normal' },
      {
        key: 'sub',
        label: 'More',
        children: [
          { key: 'sub-1', label: 'Sub One' },
          { key: 'sub-2', label: 'Sub Two' },
        ],
      },
    ];
    render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    const trigger = screen.getByRole('menuitem', { name: /more/i });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // should not have a direct click handler that closes root
    expect(trigger.tagName).toBe('BUTTON');
  });

  test('submenu opens on hover and child click fires handler + closes root', async () => {
    const user = userEvent.setup();
    const onChild = vi.fn();
    const itemsWithSub: DropdownItem[] = [
      {
        key: 'sub',
        label: 'More',
        children: [
          { key: 'sub-1', label: 'Sub One', onClick: onChild },
          { key: 'sub-2', label: 'Sub Two' },
        ],
      },
    ];
    const { container } = render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();

    const subTrigger = screen.getByRole('menuitem', { name: /more/i });
    await user.hover(subTrigger);

    const subOne = await screen.findByRole('menuitem', { name: 'Sub One' });
    expect(subOne).toBeInTheDocument();

    fireEvent.click(subOne);
    expect(onChild).toHaveBeenCalledTimes(1);
    // root dropdown should close
    await waitFor(() =>
      expect(container.querySelector('[aria-haspopup="menu"]')).toHaveAttribute(
        'aria-expanded',
        'false',
      ),
    );
  });

  test.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('submenu opens with %s', async (_keyName, key) => {
    const user = userEvent.setup();
    render(
      <Dropdown
        items={[
          {
            key: 'sub',
            label: 'More',
            children: [{ key: 'sub-1', label: 'Sub One' }],
          },
        ]}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();

    const subTrigger = screen.getByRole('menuitem', { name: /more/i });
    subTrigger.focus();
    await user.keyboard(key);

    expect(
      await screen.findByRole('menuitem', { name: 'Sub One' }),
    ).toBeInTheDocument();
    expect(subTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('Escape closes only submenu and returns focus to its trigger', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Dropdown
        items={[
          {
            key: 'sub',
            label: 'More',
            children: [{ key: 'sub-1', label: 'Sub One' }],
          },
        ]}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();

    const rootTrigger = container.querySelector('[aria-haspopup="menu"]')!;
    const subTrigger = screen.getByRole('menuitem', { name: /more/i });
    subTrigger.focus();
    await user.keyboard('{Enter}');
    const child = await screen.findByRole('menuitem', { name: 'Sub One' });
    child.focus();

    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(
        screen.queryByRole('menuitem', { name: 'Sub One' }),
      ).not.toBeInTheDocument(),
    );
    expect(rootTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(subTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(subTrigger).toHaveFocus();
  });

  test('disabled submenu trigger does not open submenu', async () => {
    const user = userEvent.setup();
    const itemsWithSub: DropdownItem[] = [
      {
        key: 'sub',
        label: 'More',
        disabled: true,
        children: [{ key: 'sub-1', label: 'Sub One' }],
      },
    ];
    render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    const subTrigger = screen.getByRole('menuitem', { name: /more/i });
    expect(subTrigger).toBeDisabled();
    await user.hover(subTrigger);
    expect(
      screen.queryByRole('menuitem', { name: 'Sub One' }),
    ).not.toBeInTheDocument();
  });

  test('disabled child in submenu does not call onClick', async () => {
    const user = userEvent.setup();
    const onChild = vi.fn();
    const itemsWithSub: DropdownItem[] = [
      {
        key: 'sub',
        label: 'More',
        children: [
          { key: 'sub-1', label: 'Sub One', disabled: true, onClick: onChild },
        ],
      },
    ];
    render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    await user.hover(screen.getByRole('menuitem', { name: /more/i }));
    const child = await screen.findByRole('menuitem', { name: 'Sub One' });
    expect(child).toBeDisabled();
    fireEvent.click(child);
    expect(onChild).not.toHaveBeenCalled();
  });

  test('submenu renders item.menuHeader above its children', async () => {
    const user = userEvent.setup();
    const headerText = 'Sub Header';
    const itemsWithSub: DropdownItem[] = [
      {
        key: 'sub',
        label: 'More',
        menuHeader: () => <div>{headerText}</div>,
        children: [{ key: 'sub-1', label: 'Sub One' }],
      },
    ];
    render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    await user.hover(screen.getByRole('menuitem', { name: /more/i }));

    const subOne = await screen.findByRole('menuitem', { name: 'Sub One' });
    const headerEl = screen.getByText(headerText);

    expect(
      headerEl.compareDocumentPosition(subOne) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test('submenu renders item.menuFooter below its children', async () => {
    const user = userEvent.setup();
    const footerText = 'Sub Footer';
    const itemsWithSub: DropdownItem[] = [
      {
        key: 'sub',
        label: 'More',
        children: [{ key: 'sub-1', label: 'Sub One' }],
        menuFooter: <div>{footerText}</div>,
      },
    ];
    render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    await user.hover(screen.getByRole('menuitem', { name: /more/i }));

    const subOne = await screen.findByRole('menuitem', { name: 'Sub One' });
    const footerEl = screen.getByText(footerText);

    expect(
      subOne.compareDocumentPosition(footerEl) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test('item.renderSubMenu fully replaces children/header/footer', async () => {
    const user = userEvent.setup();
    const onRenderSubMenu = vi.fn(() => (
      <div role="none">Custom submenu content</div>
    ));
    const itemsWithSub: DropdownItem[] = [
      {
        key: 'sub',
        label: 'More',
        menuHeader: <div>Should not render</div>,
        menuFooter: <div>Should not render either</div>,
        children: [{ key: 'sub-1', label: 'Sub One' }],
        renderSubMenu: onRenderSubMenu,
      },
    ];
    render(
      <Dropdown items={itemsWithSub}>
        <button type="button">Open</button>
      </Dropdown>,
    );
    openByClick();
    await user.hover(screen.getByRole('menuitem', { name: /more/i }));

    expect(
      await screen.findByText('Custom submenu content'),
    ).toBeInTheDocument();
    expect(onRenderSubMenu).toHaveBeenCalled();
    expect(
      screen.queryByRole('menuitem', { name: 'Sub One' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Should not render either'),
    ).not.toBeInTheDocument();
  });
});
