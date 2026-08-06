import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { FabButton } from './FabButton';

describe('Dial UI Kit :: DialFabButton', () => {
  test('Should render with icon and be accessible by role', () => {
    render(<FabButton icon={<div>icon</div>} aria-label="Fab" />);

    expect(screen.getByRole('button', { name: 'Fab' })).toBeInTheDocument();
    expect(screen.getByText('icon')).toBeInTheDocument();
  });

  test('Should render a decorative default icon when none is provided', () => {
    const { container } = render(<FabButton aria-label="Scroll to bottom" />);

    const defaultIcon = container.querySelector('svg');
    expect(defaultIcon).toBeInTheDocument();
    expect(defaultIcon).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Scroll to bottom');
  });

  test('Should use the aria-label as the accessible name', () => {
    render(<FabButton aria-label="Scroll to bottom" />);

    expect(screen.getByRole('button')).toHaveAccessibleName('Scroll to bottom');
  });

  test('Should fall back to the tooltip text as the accessible name', () => {
    render(<FabButton tooltipProps={{ tooltip: 'Scroll to bottom' }} />);

    expect(screen.getByRole('button')).toHaveAccessibleName('Scroll to bottom');
  });

  test('Should prefer the aria-label over the tooltip text', () => {
    render(
      <FabButton
        aria-label="Scroll to bottom"
        tooltipProps={{ tooltip: 'Tooltip text' }}
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Scroll to bottom');
  });

  test('Should default the type to button to avoid form submission', () => {
    render(<FabButton aria-label="Fab" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FabButton icon={<div>icon</div>} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<FabButton icon={<div>icon</div>} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('Should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<FabButton icon={<div>icon</div>} disabled onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should apply custom CSS class', () => {
    render(<FabButton icon={<div>icon</div>} className="custom-fab-class" />);

    expect(screen.getByRole('button')).toHaveClass('custom-fab-class');
  });

  test('Should always have dial-fab-button class', () => {
    render(<FabButton icon={<div>icon</div>} />);

    expect(screen.getByRole('button')).toHaveClass('dial-kit-fab-button');
  });

  test('Should enhance the pointer target to meet WCAG 2.5.5', () => {
    render(<FabButton aria-label="Scroll to bottom" />);

    expect(screen.getByRole('button')).toHaveClass('dial-kit-enhanced-target');
  });

  test('Should show the tooltip on hover when tooltipProps provided', async () => {
    const user = userEvent.setup();
    render(
      <FabButton
        icon={<div>icon</div>}
        tooltipProps={{ tooltip: 'Test tooltip' }}
      />,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });
});
