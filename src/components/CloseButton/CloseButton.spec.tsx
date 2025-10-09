import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialCloseButton } from './CloseButton';

describe('Dial UI Kit :: DialCloseButton', () => {
  it('renders with default icon size', () => {
    const { getByRole } = render(<DialCloseButton onClose={vi.fn()} />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies aria-label if provided', () => {
    const { getByLabelText } = render(
      <DialCloseButton ariaLabel="Close dialog" onClose={vi.fn()} />,
    );
    expect(getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('calls onClose when clicked', () => {
    const onClose = vi.fn();
    const { getByRole } = render(<DialCloseButton onClose={onClose} />);
    fireEvent.click(getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('applies custom cssClass', () => {
    const { getByRole } = render(
      <DialCloseButton cssClass="custom-class" onClose={vi.fn()} />,
    );
    expect(getByRole('button').className).toMatch(/custom-class/);
  });

  it('renders with custom icon size', () => {
    const { container } = render(
      <DialCloseButton size={32} onClose={vi.fn()} />,
    );
    // IconX renders an svg, check for svg with width/height 32
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });
});
