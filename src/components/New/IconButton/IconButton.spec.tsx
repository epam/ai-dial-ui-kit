import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ElementSize } from '@/types/size';
import { IconButton } from './IconButton';

describe('Dial UI Kit :: DialIconButton', () => {
  test('Should render with string label and be accessible by role', () => {
    render(<IconButton icon={<div>icon</div>} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('icon')).toBeInTheDocument();
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<IconButton icon={<div>icon</div>} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<IconButton icon={<div>icon</div>} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('Should apply custom CSS class', () => {
    render(
      <IconButton icon={<div>icon</div>} className="custom-button-class" />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button-class');
  });

  test('Should use the aria-label as the accessible name', () => {
    render(<IconButton icon={<div>icon</div>} aria-label="Delete" />);

    expect(screen.getByRole('button')).toHaveAccessibleName('Delete');
  });

  test('Should fall back to the tooltip text as the accessible name', () => {
    render(
      <IconButton
        icon={<div>icon</div>}
        tooltipProps={{ tooltip: 'Delete' }}
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Delete');
  });

  test('Should enhance the pointer target at standard size', () => {
    render(<IconButton icon={<div>icon</div>} aria-label="Delete" />);

    expect(screen.getByRole('button')).toHaveClass('dial-kit-enhanced-target');
  });

  test('Should not enhance the pointer target at small size', () => {
    render(
      <IconButton
        icon={<div>icon</div>}
        aria-label="Delete"
        size={ElementSize.Small}
      />,
    );

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });
});
