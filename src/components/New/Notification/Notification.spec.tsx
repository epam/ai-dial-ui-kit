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
    [NotificationVariant.General, 'status'],
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

  test('Should render the General variant as a neutral notification', () => {
    render(
      <Notification
        variant={NotificationVariant.General}
        title="Title"
        message="Description text example"
      />,
    );

    const notification = screen.getByRole('status');
    expect(notification).toHaveClass('bg-layer-sunken', 'text-primary');
    expect(screen.getByText('Description text example')).toBeInTheDocument();
  });

  test('Should not nest the spinner live region inside the notification', () => {
    render(
      <Notification variant={NotificationVariant.Loading} message="Loading…" />,
    );

    // Spinner brings its own role="status"; nested live regions announce
    // their content twice.
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  test('Should keep the close button in the flow, on the first line', () => {
    render(
      <Notification
        title="File downloaded successfully"
        message="dial-report-2026-09.csv is in your Downloads folder"
        onClose={vi.fn()}
        closable
      />,
    );

    const notification = screen.getByRole('status');
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });

    // jsdom lays nothing out, so the alignment can only be asserted through
    // the classes: absolutely positioning the button inside a fixed 40px
    // spacer detached it from the content, and it drifted out of alignment as
    // soon as the message outgrew the spacer.
    expect(closeBtn.parentElement).toBe(notification);
    expect(closeBtn).toHaveClass('self-start');
    expect(closeBtn).not.toHaveClass('absolute');
  });

  test('Should give the close button its full small footprint', () => {
    render(<Notification message="Closable" onClose={vi.fn()} closable />);

    // `size-auto` used to win over the control's own size and collapse the
    // 24px box down to its 18px icon.
    expect(
      screen.getByRole('button', { name: 'Close notification' }),
    ).toHaveClass('size-[24px]');
  });

  test('Should render the action inside the live region and fire its handler', () => {
    const onRetry = vi.fn();
    render(
      <Notification
        variant={NotificationVariant.Error}
        title="Couldn't finish this response"
        message="Try again in a moment."
        action={
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        }
      />,
    );

    const alert = screen.getByRole('alert');
    const action = screen.getByRole('button', { name: 'Try again' });
    expect(alert).toContainElement(action);

    fireEvent.click(action);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  test('Should place the action after the text and before the close button', () => {
    render(
      <Notification
        message="Something went wrong"
        action={<button type="button">Try again</button>}
        onClose={vi.fn()}
        closable
      />,
    );

    const message = screen.getByText('Something went wrong');
    const action = screen.getByRole('button', { name: 'Try again' });
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });

    expect(message.compareDocumentPosition(action)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(action.compareDocumentPosition(closeBtn)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    // The wrapper must not shrink, or a wrapping message squeezes the control.
    expect(action.parentElement).toHaveClass('shrink-0');
  });

  test('Should render no action wrapper when action is omitted', () => {
    render(<Notification message="Plain" />);

    const notification = screen.getByRole('status');
    expect(notification.querySelector('.shrink-0.items-center')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
