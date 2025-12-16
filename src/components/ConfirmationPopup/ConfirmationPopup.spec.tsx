import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialConfirmationPopup } from './ConfirmationPopup';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';

describe('Dial UI Kit :: ConfirmationPopup', () => {
  const baseProps = {
    title: 'Confirm Deleting Model',
    description: 'Are you sure that you want to delete model?',
    open: true,
    confirmLabel: 'Delete',
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  test('does not render when open is false', () => {
    render(<DialConfirmationPopup {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders title and description', () => {
    render(<DialConfirmationPopup {...baseProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Deleting Model')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure that you want to delete model?'),
    ).toBeInTheDocument();
  });

  test('renders React node as title and omits aria-labelledby', () => {
    render(
      <DialConfirmationPopup
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
      <DialConfirmationPopup {...baseProps}>
        <div>Custom content</div>
      </DialConfirmationPopup>,
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
    expect(
      screen.queryByText('Are you sure that you want to delete model?'),
    ).not.toBeInTheDocument();
  });

  test('applies descriptionClassName', () => {
    render(
      <DialConfirmationPopup
        {...baseProps}
        descriptionClassName="text-red-500"
      />,
    );
    expect(
      screen.getByText('Are you sure that you want to delete model?'),
    ).toHaveClass('text-red-500');
  });

  test('danger variant applies error accent classes', () => {
    render(
      <DialConfirmationPopup
        {...baseProps}
        variant={ConfirmationPopupVariant.Danger}
      />,
    );
    expect(screen.getByRole('dialog')).toHaveClass('dial-danger-popup');
  });

  test('confirm button disabled via prop', () => {
    render(<DialConfirmationPopup {...baseProps} disableConfirmButton />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  test('calls onConfirm on confirm click', () => {
    const onConfirm = vi.fn();
    render(<DialConfirmationPopup {...baseProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('Cancel calls onCancel or falls back to onClose', () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <DialConfirmationPopup
        {...baseProps}
        onCancel={onCancel}
        onClose={onClose}
        cancelLabel="Cancel"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('header close (from DialPopup) triggers onClose', () => {
    const onClose = vi.fn();
    render(<DialConfirmationPopup {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('loading state hides actions', () => {
    render(<DialConfirmationPopup {...baseProps} isLoading />);
    expect(
      screen.queryByRole('button', { name: 'Delete' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' }),
    ).not.toBeInTheDocument();
  });

  test('merges className into container', () => {
    render(<DialConfirmationPopup {...baseProps} className="ring-1" />);
    expect(screen.getByRole('dialog')).toHaveClass('ring-1');
  });

  test('falls back to onClose when onCancel is not provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DialConfirmationPopup
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
