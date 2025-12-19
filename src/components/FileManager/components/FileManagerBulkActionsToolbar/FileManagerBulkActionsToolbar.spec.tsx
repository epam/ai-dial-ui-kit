import { render, fireEvent, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialFileManagerBulkActionsToolbar } from './FileManagerBulkActionsToolbar';

vi.mock('@/hooks/use-is-mobile-screen', () => ({
  useIsMobileScreen: vi.fn(() => false),
}));

vi.mock('@/hooks/use-flexible-actions', () => ({
  useFlexibleActions: vi.fn(({ actions }) => ({
    refs: {
      containerRef: { current: null },
      leftSectionRef: { current: null },
      measureRef: { current: null },
    },
    visibleActions: actions,
    hiddenActions: [],
  })),
}));

describe('Dial UI Kit :: DialFileManagerBulkActionsToolbar', () => {
  const actions = [
    { key: 'download', title: 'Download', onClick: vi.fn() },
    { key: 'delete', title: 'Delete', onClick: vi.fn() },
    { key: 'share', title: 'Share', onClick: vi.fn() },
  ];

  it('renders selected label button and calls onClearSelection', () => {
    const onClear = vi.fn();
    const getLabel = vi.fn((count: number) => `${count} files selected`);

    render(
      <DialFileManagerBulkActionsToolbar
        getSelectionLabel={getLabel}
        onClearSelection={onClear}
        actions={actions}
        selectedCount={3}
      />,
    );

    expect(getLabel).toHaveBeenCalledWith(3);

    const toolbar = screen.getByRole('toolbar');
    const selectedButton = within(toolbar).getByText('3 files selected');
    expect(selectedButton).toBeInTheDocument();

    fireEvent.click(selectedButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders all action buttons', () => {
    render(
      <DialFileManagerBulkActionsToolbar
        getSelectionLabel={(count) => `${count} selected`}
        onClearSelection={vi.fn()}
        actions={actions}
        selectedCount={3}
      />,
    );

    const toolbar = screen.getByRole('toolbar');

    actions.forEach((action) => {
      expect(
        within(toolbar).getByRole('button', { name: action.title }),
      ).toBeInTheDocument();
    });
  });

  it('calls action onClick handler when action button is clicked', () => {
    const mockOnClick = vi.fn();
    const actionsWithMock = [
      { key: 'download', title: 'Download', onClick: vi.fn() },
      { key: 'delete', title: 'Delete', onClick: mockOnClick },
      { key: 'share', title: 'Share', onClick: vi.fn() },
    ];

    render(
      <DialFileManagerBulkActionsToolbar
        getSelectionLabel={(count) => `${count} selected`}
        onClearSelection={vi.fn()}
        actions={actionsWithMock}
        selectedCount={3}
      />,
    );

    const toolbar = screen.getByRole('toolbar');
    const deleteButton = within(toolbar).getByRole('button', {
      name: 'Delete',
    });
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('renders toolbar with proper accessibility attributes', () => {
    render(
      <DialFileManagerBulkActionsToolbar
        getSelectionLabel={(count) => `${count} selected`}
        onClearSelection={vi.fn()}
        actions={actions}
        selectedCount={3}
      />,
    );

    const toolbar = screen.getByRole('toolbar', {
      name: 'File bulk actions',
    });
    expect(toolbar).toBeInTheDocument();
  });
});
