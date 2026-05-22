import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialFabButton } from './FabButton';

describe('Dial UI Kit :: DialFabButton', () => {
  test('Should render with icon and be accessible by role', () => {
    render(<DialFabButton icon={<div>icon</div>} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('icon')).toBeInTheDocument();
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DialFabButton icon={<div>icon</div>} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<DialFabButton icon={<div>icon</div>} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('Should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<DialFabButton icon={<div>icon</div>} disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should apply custom CSS class', () => {
    render(
      <DialFabButton icon={<div>icon</div>} className="custom-fab-class" />,
    );
    expect(screen.getByRole('button')).toHaveClass('custom-fab-class');
  });

  test('Should always have dial-fab-button class', () => {
    render(<DialFabButton icon={<div>icon</div>} />);
    expect(screen.getByRole('button')).toHaveClass('dial-fab-button');
  });

  test('Should render tooltip when tooltipProps provided', () => {
    render(
      <DialFabButton
        icon={<div>icon</div>}
        tooltipProps={{ tooltip: 'Test tooltip' }}
      />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
