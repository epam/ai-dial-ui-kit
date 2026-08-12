import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialPopup } from './Popup';
import { PopupSize } from '@/types/popup';
import { popupSizeClassMap } from './constants';

describe('Dial UI Kit :: DialPopup', () => {
  test('does not render when closed', () => {
    const { queryByRole } = render(<DialPopup open={false} />);
    expect(queryByRole('dialog')).toBeNull();
  });

  test('renders title and body when open', () => {
    render(
      <DialPopup open header="Title">
        <div>Body content</div>
      </DialPopup>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(
      <DialPopup open header="With footer" footer={<div>Footer here</div>}>
        <div>Body</div>
      </DialPopup>,
    );
    expect(screen.getByText('Footer here')).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <DialPopup open header="Closable" onClose={onClose}>
        <div>Body</div>
      </DialPopup>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders React component as title (non-string path) and omits aria-labelledby', () => {
    render(
      <DialPopup
        open
        header={
          <span>
            <strong>Node title</strong>
          </span>
        }
      >
        <div>Body</div>
      </DialPopup>,
    );

    expect(screen.getByText('Node title')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');

    expect(screen.queryByText('dial-popup-heading')).not.toBeInTheDocument();
  });

  test('applies size class correctly', () => {
    render(
      <DialPopup open header="Size Test" size={PopupSize.Lg}>
        <div>Body</div>
      </DialPopup>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(popupSizeClassMap[PopupSize.Lg]);
  });

  test('applies headerClassName to the popup header', () => {
    render(
      <DialPopup
        open
        header="Header class test"
        headerClassName="custom-header-class"
      >
        <div>Body</div>
      </DialPopup>,
    );

    const header = screen
      .getByRole('button', { name: 'Close dialog' })
      .closest('div');

    expect(header).toHaveClass('custom-header-class');
  });

  test('does not close on outside click when closeOnOutsideClick is false', () => {
    const onClose = vi.fn();

    render(
      <DialPopup
        open
        header="Outside click disabled"
        onClose={onClose}
        closeOnOutsideClick={false}
      >
        <div>Body</div>
      </DialPopup>,
    );

    fireEvent.mouseDown(document.body);

    expect(onClose).not.toHaveBeenCalled();
  });

  test('does not render close button when hideClose is true', () => {
    render(
      <DialPopup open header="No Close" hideClose>
        <div>Body</div>
      </DialPopup>,
    );

    expect(
      screen.queryByRole('button', { name: 'Close dialog' }),
    ).not.toBeInTheDocument();
  });

  test('moves initial focus to the dialog itself, not the close button', async () => {
    render(
      <DialPopup open header="Edit prompt">
        <input aria-label="Name" />
      </DialPopup>,
    );

    const dialog = screen.getByRole('dialog');

    // The focus manager focuses inside a microtask queued from a layout effect.
    await waitFor(() => expect(dialog).toHaveFocus());
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).not.toHaveFocus();
  });

  test('focuses the guard instead of the dialog when preventKeyboardOnOpen is set', async () => {
    render(
      <DialPopup open header="Edit prompt" preventKeyboardOnOpen>
        <input aria-label="Name" />
      </DialPopup>,
    );

    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog).not.toHaveFocus());

    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).not.toHaveFocus();
    expect(screen.getByLabelText('Name')).not.toHaveFocus();
  });
});
