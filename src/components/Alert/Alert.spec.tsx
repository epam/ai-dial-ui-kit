import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialAlert } from './Alert';

describe('Dial UI Kit :: DialAlert', () => {
  test('Should render with message text', () => {
    render(<DialAlert message="Hello alert" />);
    expect(screen.getByRole('alert', { name: '' })).toBeInTheDocument();
    expect(screen.getByText('Hello alert')).toBeInTheDocument();
  });

  test('Should default to full width (flex w-full)', () => {
    render(<DialAlert message="Full width default" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('flex', 'w-full');
    expect(alert).not.toHaveClass('inline-flex', 'w-auto');
  });

  test('Should be content width when fullWidth is false (inline-flex w-auto)', () => {
    render(<DialAlert message="Content width" fullWidth={false} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('inline-flex', 'w-auto');
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

  test('Should apply custom cssClass', () => {
    render(<DialAlert message="Styled" cssClass="custom-alert-class" />);
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
});
