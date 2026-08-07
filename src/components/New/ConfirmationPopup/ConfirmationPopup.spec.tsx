import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ConfirmationPopup } from './ConfirmationPopup';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';

describe('Dial UI Kit :: ConfirmationPopup', () => {
  const baseProps = {
    header: 'Confirm Deleting Model',
    description: 'Are you sure that you want to delete model?',
    open: true,
    confirmLabel: 'Delete',
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  test('does not render when open is false', () => {
    render(<ConfirmationPopup {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders title and description', () => {
    render(<ConfirmationPopup {...baseProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Deleting Model')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure that you want to delete model?'),
    ).toBeInTheDocument();
  });

  test('renders React node as title and omits aria-labelledby', () => {
    render(
      <ConfirmationPopup
        {...baseProps}
        header={
          <span>
            <strong>Node title</strong>
          </span>
        }
      />,
    );
    expect(screen.getByText('Node title')).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  test('renders custom children instead of description', () => {
    render(
      <ConfirmationPopup {...baseProps}>
        <div>Custom content</div>
      </ConfirmationPopup>,
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
    expect(
      screen.queryByText('Are you sure that you want to delete model?'),
    ).not.toBeInTheDocument();
  });

  test('applies descriptionClassName', () => {
    render(
      <ConfirmationPopup {...baseProps} descriptionClassName="text-red-500" />,
    );
    expect(
      screen.getByText('Are you sure that you want to delete model?'),
    ).toHaveClass('text-red-500');
  });

  test('danger variant applies the error accent and a danger confirm button', () => {
    render(
      <ConfirmationPopup
        {...baseProps}
        variant={ConfirmationPopupVariant.Danger}
      />,
    );

    expect(screen.getByRole('dialog')).toHaveClass(
      'border-t-4',
      'border-error',
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'dial-kit-danger-solid-button',
    );
  });

  test('info variant leaves the error accent off', () => {
    render(<ConfirmationPopup {...baseProps} />);

    expect(screen.getByRole('dialog')).not.toHaveClass('border-error');
  });

  test('confirm button disabled via prop', () => {
    render(<ConfirmationPopup {...baseProps} disableConfirmButton />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  test('calls onConfirm on confirm click', () => {
    const onConfirm = vi.fn();
    render(<ConfirmationPopup {...baseProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('Cancel calls onCancel or falls back to onClose', () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmationPopup
        {...baseProps}
        onCancel={onCancel}
        onClose={onClose}
        cancelLabel="Cancel"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('header close (from Popup) triggers onClose', () => {
    const onClose = vi.fn();
    render(
      <ConfirmationPopup {...baseProps} onClose={onClose} hideClose={false} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('loading state hides actions and the description', () => {
    render(<ConfirmationPopup {...baseProps} isLoading />);
    expect(
      screen.queryByRole('button', { name: 'Delete' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Are you sure that you want to delete model?'),
    ).not.toBeInTheDocument();
  });

  test('merges className into container', () => {
    render(<ConfirmationPopup {...baseProps} className="ring-1" />);
    expect(screen.getByRole('dialog')).toHaveClass('ring-1');
  });

  test('falls back to onClose when onCancel is not provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmationPopup
        open
        header="Confirm?"
        cancelLabel="Cancel dialog"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
