import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AlertVariant } from '@/types/alert';
import { DialAlert } from './Alert';

describe('Dial UI Kit :: DialAlert', () => {
  test('Should render with message text', () => {
    render(<DialAlert message="Hello alert" />);
    expect(screen.getByRole('alert', { name: '' })).toBeInTheDocument();
    expect(screen.getByText('Hello alert')).toBeInTheDocument();
  });

  test('Should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<DialAlert message="Closable" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close alert' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('Should not render close button when closable is false', () => {
    render(<DialAlert message="No close" closable={false} />);
    expect(
      screen.queryByRole('button', { name: 'Close alert' }),
    ).not.toBeInTheDocument();
  });

  test('Should apply custom className', () => {
    render(<DialAlert message="Styled" className="custom-alert-class" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-alert-class');
  });

  test('Should render role="alert" for accessibility', () => {
    render(<DialAlert message="Accessible" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('Should pass mouse event to onClose handler', () => {
    const onClose = vi.fn();
    render(<DialAlert message="Event test" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close alert' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledWith(expect.any(Object));
    expect(onClose.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  test('Should render title above message when title is provided', () => {
    render(<DialAlert title="Alert title" message="Alert message" />);
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
    render(<DialAlert variant={AlertVariant.Loading} message="Loading…" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
