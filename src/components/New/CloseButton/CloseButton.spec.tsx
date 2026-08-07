import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ElementSize } from '@/types/size';
import { CloseButton } from './CloseButton';

describe('Dial UI Kit :: CloseButton', () => {
  test('is named "Close" by default, so it is never an unnamed icon button', () => {
    render(<CloseButton onClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  test('applies ariaLabel when provided', () => {
    render(<CloseButton ariaLabel="Close dialog" onClose={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument();
  });

  test('calls onClose when clicked', () => {
    const onClose = vi.fn();
    render(<CloseButton ariaLabel="Close dialog" onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose while disabled', () => {
    const onClose = vi.fn();
    render(<CloseButton ariaLabel="Close dialog" onClose={onClose} disabled />);

    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    render(
      <CloseButton
        ariaLabel="Close dialog"
        className="custom-class"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveClass(
      'custom-class',
    );
  });

  describe('size', () => {
    // jsdom does no layout, so only the classes are observable here.
    test('renders the small box by default, without the enhanced target', () => {
      render(<CloseButton ariaLabel="Close dialog" onClose={vi.fn()} />);

      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toHaveClass('size-[24px]');
      // A 44px target would overhang 10px per side and overlap its neighbours.
      expect(button).not.toHaveClass('dial-kit-enhanced-target');
      expect(button.querySelector('svg')).toHaveAttribute('width', '16');
    });

    test('renders the standard box with the enhanced pointer target', () => {
      render(
        <CloseButton
          ariaLabel="Close dialog"
          size={ElementSize.Standard}
          onClose={vi.fn()}
        />,
      );

      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toHaveClass('size-[40px]', 'dial-kit-enhanced-target');
      expect(button.querySelector('svg')).toHaveAttribute('width', '20');
    });
  });

  test('hides the icon from assistive tech, which reads the button name instead', () => {
    render(<CloseButton ariaLabel="Close dialog" onClose={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Close dialog' }).querySelector('svg'),
    ).toHaveAttribute('aria-hidden', 'true');
  });
});
