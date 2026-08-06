import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { NotificationVariant } from '@/types/notification';
import { Notification } from './Notification';

describe('Dial UI Kit :: Notification', () => {
  test('Should render with message text', () => {
    render(<Notification message="Hello notification" />);
    expect(screen.getByRole('status', { name: '' })).toBeInTheDocument();
    expect(screen.getByText('Hello notification')).toBeInTheDocument();
  });

  test('Should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<Notification message="Closable" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('Should not render close button when closable is false', () => {
    render(<Notification message="No close" closable={false} />);
    expect(
      screen.queryByRole('button', { name: 'Close notification' }),
    ).not.toBeInTheDocument();
  });

  test('Should apply custom className', () => {
    render(<Notification message="Styled" className="custom-alert-class" />);
    const alert = screen.getByRole('status');
    expect(alert).toHaveClass('custom-alert-class');
  });

  test.each([
    [NotificationVariant.Error, 'alert'],
    [NotificationVariant.Warning, 'alert'],
    [NotificationVariant.Info, 'status'],
    [NotificationVariant.Success, 'status'],
    [NotificationVariant.Loading, 'status'],
  ])(
    'Should expose the %s variant as a %s live region',
    (variant, expectedRole) => {
      render(<Notification variant={variant} message="Accessible" />);

      expect(screen.getByRole(expectedRole)).toBeInTheDocument();
    },
  );

  test('Should let the caller override the live-region role', () => {
    // Static page content should not announce itself as an update.
    render(<Notification message="Static" role="note" />);

    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('Should pass mouse event to onClose handler', () => {
    const onClose = vi.fn();
    render(<Notification message="Event test" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledWith(expect.any(Object));
    expect(onClose.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  test('Should render title above message when title is provided', () => {
    render(<Notification title="Alert title" message="Alert message" />);
    const title = screen.getByText('Alert title');
    const message = screen.getByText('Alert message');
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(title).toHaveClass('dial-small-paragraph-semi-text');
    expect(title.compareDocumentPosition(message)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  test('Should render spinner for Loading variant', () => {
    const { container } = render(
      <Notification variant={NotificationVariant.Loading} message="Loading…" />,
    );

    expect(container.querySelector('.animate-spin-steps')).toBeInTheDocument();
  });

  test('Should not nest the spinner live region inside the notification', () => {
    render(
      <Notification variant={NotificationVariant.Loading} message="Loading…" />,
    );

    // Spinner brings its own role="status"; nested live regions announce
    // their content twice.
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });
});
