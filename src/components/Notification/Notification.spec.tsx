import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { NotificationVariant } from '@/types/notification';
import { DialNotification } from './Notification';

describe('Dial UI Kit :: DialNotification', () => {
  test('Should render with message text', () => {
    render(<DialNotification message="Hello notification" />);
    expect(screen.getByRole('alert', { name: '' })).toBeInTheDocument();
    expect(screen.getByText('Hello notification')).toBeInTheDocument();
  });

  test('Should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<DialNotification message="Closable" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('Should not render close button when closable is false', () => {
    render(<DialNotification message="No close" closable={false} />);
    expect(
      screen.queryByRole('button', { name: 'Close notification' }),
    ).not.toBeInTheDocument();
  });

  test('Should apply custom className', () => {
    render(
      <DialNotification message="Styled" className="custom-alert-class" />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-alert-class');
  });

  test('Should render role="alert" for accessibility', () => {
    render(<DialNotification message="Accessible" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('Should pass mouse event to onClose handler', () => {
    const onClose = vi.fn();
    render(
      <DialNotification message="Event test" onClose={onClose} closable />,
    );
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledWith(expect.any(Object));
    expect(onClose.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  test('Should render title above message when title is provided', () => {
    render(<DialNotification title="Alert title" message="Alert message" />);
    const title = screen.getByText('Alert title');
    const message = screen.getByText('Alert message');
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(title).toHaveClass('dial-small-semi-text');
    expect(title.compareDocumentPosition(message)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  test('Should render spinner for Loading variant', () => {
    render(
      <DialNotification
        variant={NotificationVariant.Loading}
        message="Loading…"
      />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
