import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  test('Should show the tooltip on hover and describe the button itself', async () => {
    const user = userEvent.setup();

    render(
      <IconButton
        icon={<div>icon</div>}
        tooltipProps={{ tooltip: 'Delete' }}
      />,
    );
    const button = screen.getByRole('button', { name: 'Delete' });

    await user.hover(button);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Delete');
    // The 2.0 tooltip is rendered with `asChild`, so `aria-describedby` lands
    // on the button rather than on a wrapper <span> a reader never reaches.
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
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
