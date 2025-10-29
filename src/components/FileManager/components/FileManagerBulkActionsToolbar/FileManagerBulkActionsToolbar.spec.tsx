import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterAll, beforeAll } from 'vitest';
import { DialFileManagerBulkActionsToolbar } from './FileManagerBulkActionsToolbar';
import type { DialButtonProps } from '@/components/Button/Button';
import type { DialDropdownProps } from '@/components/Dropdown/Dropdown';
import type { DropdownItem } from '@/models/dropdown';

vi.mock('@/components/Button/Button', () => ({
  DialButton: ({ title, onClick, iconBefore }: DialButtonProps) => (
    <button data-testid={`button-${title}`} onClick={onClick}>
      {title}
      {iconBefore && <span data-testid="icon">{true}</span>}
    </button>
  ),
}));

vi.mock('@/components/Dropdown/Dropdown', () => ({
  DialDropdown: ({ children, menu }: DialDropdownProps) => (
    <div data-testid="dropdown">
      {children}
      <div data-testid="dropdown-items">
        {menu?.items.map((i: DropdownItem) => i.label).join(',')}
      </div>
    </div>
  ),
}));

vi.mock('@/hooks/use-is-tablet-screen', () => ({
  useIsMobileScreen: vi.fn(() => false),
}));

describe('Dial UI Kit :: DialFileManagerBulkActionsToolbar', () => {
  let originalResizeObserver: typeof ResizeObserver;

  beforeAll(() => {
    originalResizeObserver = globalThis.ResizeObserver;

    class ResizeObserverMock implements ResizeObserver {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    globalThis.ResizeObserver =
      ResizeObserverMock as unknown as typeof ResizeObserver;
  });

  afterAll(() => {
    vi.restoreAllMocks();
    globalThis.ResizeObserver = originalResizeObserver;
  });

  const actions = [
    { key: 'download', title: 'Download', onClick: vi.fn() },
    { key: 'delete', title: 'Delete', onClick: vi.fn() },
    { key: 'share', title: 'Share', onClick: vi.fn() },
  ];

  it('renders selected label button and calls onClearSelection', () => {
    const onClear = vi.fn();
    render(
      <DialFileManagerBulkActionsToolbar
        selectionLabel="3 files selected"
        onClearSelection={onClear}
        actions={actions}
      />,
    );

    const selectedButton = screen.getByTestId('button-3 files selected');
    expect(selectedButton).toBeInTheDocument();

    fireEvent.click(selectedButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders all action buttons', () => {
    render(
      <DialFileManagerBulkActionsToolbar
        selectionLabel="3 files selected"
        onClearSelection={vi.fn()}
        actions={actions}
      />,
    );

    actions.forEach((action) => {
      expect(
        screen.getAllByTestId(`button-${action.title}`)?.[1],
      ).toBeInTheDocument();
    });
  });

  it('calls action onClick handler when action button is clicked', () => {
    render(
      <DialFileManagerBulkActionsToolbar
        selectionLabel="3 files selected"
        onClearSelection={vi.fn()}
        actions={actions}
      />,
    );

    const deleteButton = screen.getAllByTestId('button-Delete')?.[1];
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(actions[1].onClick).toHaveBeenCalled();
  });

  it('renders icons inside buttons', () => {
    render(
      <DialFileManagerBulkActionsToolbar
        selectionLabel="3 files selected"
        onClearSelection={vi.fn()}
        actions={actions}
      />,
    );

    const icons = screen.getAllByTestId('icon');
    expect(icons.length).toBeGreaterThan(0);
  });
});
