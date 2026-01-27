import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialIconButton } from './IconButton';

describe('Dial UI Kit :: DialIconButton', () => {
  test('Should render with string label and be accessible by role', () => {
    render(<DialIconButton icon={<div>icon</div>} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('icon')).toBeInTheDocument();
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DialIconButton icon={<div>icon</div>} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<DialIconButton icon={<div>icon</div>} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('Should apply custom CSS class', () => {
    render(
      <DialIconButton icon={<div>icon</div>} className="custom-button-class" />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button-class');
  });
});
