import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { BottomSheet } from './BottomSheet';

describe('Dial UI Kit :: BottomSheet', () => {
  test('renders nothing while closed', () => {
    render(
      <BottomSheet open={false} title="Select model" onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('is a modal dialog named by its title', () => {
    render(
      <BottomSheet open title="Select model" onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Select model' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      screen.getByRole('heading', { name: 'Select model' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  test('has no header without a title, and takes its name from ariaLabel', () => {
    render(
      <BottomSheet open ariaLabel="Menu" onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );

    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  test('moves focus to the panel when it opens, not to the close button', async () => {
    render(
      <BottomSheet open title="Select model" onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );

    // The focus manager focuses inside a microtask queued from a layout effect.
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
    expect(screen.getByRole('button', { name: 'Close' })).not.toHaveFocus();
  });

  test('closes from the close button', async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open title="Select model" onClose={onClose}>
        Body
      </BottomSheet>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  test('closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open title="Select model" onClose={onClose}>
        Body
      </BottomSheet>,
    );

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  test('closes on a press outside the sheet unless told not to', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <BottomSheet open title="Select model" onClose={onClose}>
        Body
      </BottomSheet>,
    );

    fireEvent.pointerDown(document.body);
    expect(onClose).toHaveBeenCalledOnce();

    onClose.mockClear();
    rerender(
      <BottomSheet
        open
        title="Select model"
        onClose={onClose}
        closeOnOutsideClick={false}
      >
        Body
      </BottomSheet>,
    );

    fireEvent.pointerDown(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('shows a back button only with onBack, and calls it', async () => {
    const onBack = vi.fn();
    const { rerender } = render(
      <BottomSheet open title="Theme" onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );

    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();

    rerender(
      <BottomSheet
        open
        title="Theme"
        onClose={vi.fn()}
        onBack={onBack}
        backAriaLabel="Back to settings"
      >
        Body
      </BottomSheet>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to settings' }),
    );

    expect(onBack).toHaveBeenCalledOnce();
  });

  test('takes translated names for its controls', () => {
    render(
      <BottomSheet
        open
        title="Модель"
        onClose={vi.fn()}
        closeAriaLabel="Закрити"
      >
        Body
      </BottomSheet>,
    );

    expect(screen.getByRole('button', { name: 'Закрити' })).toBeInTheDocument();
  });

  test('carries the public class on the panel', () => {
    render(
      <BottomSheet
        open
        title="Select model"
        onClose={vi.fn()}
        className="h-1/2"
      >
        Body
      </BottomSheet>,
    );

    expect(screen.getByRole('dialog')).toHaveClass(
      'h-1/2',
      'dial-kit-bottom-sheet',
    );
  });
});
