import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialButton } from './Button';
import { ButtonVariant } from '@/index';

describe('Dial UI Kit :: DialButton', () => {
  test('Should render with label and be accessible by role', () => {
    render(<DialButton label="Click me" />);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DialButton label="Clickable Button" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clickable Button' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<DialButton label="Disabled" disabled hideTitleOnMobile />);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  test('Should render iconBefore and iconAfter', () => {
    render(
      <DialButton
        label="With Icons"
        iconBefore={<span>Before</span>}
        iconAfter={<span>After</span>}
      />,
    );
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  test('Should render without label when only icons are provided', () => {
    render(
      <DialButton
        iconBefore={<span data-testid="icon">Icon</span>}
        aria-label="Icon button"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Icon button' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByText('Icon button')).not.toBeInTheDocument();
  });

  test('Should apply custom className', () => {
    render(<DialButton label="Styled" className="custom-button-class" />);
    const button = screen.getByRole('button', { name: 'Styled' });
    expect(button).toHaveClass('custom-button-class');
  });

  test('Should apply custom CSS class to button text with textCssClass prop', () => {
    render(
      <DialButton
        label="Custom Text"
        textClassName="custom-text-class font-bold"
      />,
    );
    const titleSpan = screen.getByText('Custom Text');
    expect(titleSpan).toHaveClass('custom-text-class', 'font-bold');
  });

  test('Should apply focus-visible outline classes', () => {
    render(<DialButton label="Focus test" />);
    const button = screen.getByRole('button', { name: 'Focus test' });
    expect(button).toHaveClass('focus-visible:outline', 'outline-offset-0');
  });

  test('Should hide label on mobile when hideTitleOnMobile is true', () => {
    render(<DialButton label="Mobile test" hideTitleOnMobile />);
    const titleSpan = screen.getByText('Mobile test');
    expect(titleSpan).toHaveClass('hidden', 'sm:inline');
  });

  test('Should show label on all devices when hideTitleOnMobile is false', () => {
    render(<DialButton label="Desktop test" hideTitleOnMobile={false} />);
    const titleSpan = screen.getByText('Desktop test');
    expect(titleSpan).toHaveClass('inline');
    expect(titleSpan).not.toHaveClass('hidden');
  });

  test('Should apply correct spacing classes with icons', () => {
    render(
      <DialButton
        label="Spacing test"
        iconBefore={<span>Before</span>}
        iconAfter={<span>After</span>}
      />,
    );
    const titleSpan = screen.getByText('Spacing test');
    expect(titleSpan).toHaveClass('mr-2', 'ml-2');
  });

  test('Should apply correct spacing with only iconBefore', () => {
    render(<DialButton label="Before only" iconBefore={<span>Before</span>} />);
    const titleSpan = screen.getByText('Before only');
    expect(titleSpan).toHaveClass('ml-2');
    expect(titleSpan).not.toHaveClass('mr-2');
  });

  test('Should apply correct spacing with only iconAfter', () => {
    render(<DialButton label="After only" iconAfter={<span>After</span>} />);
    const titleSpan = screen.getByText('After only');
    expect(titleSpan).toHaveClass('mr-2');
    expect(titleSpan).not.toHaveClass('ml-2');
  });

  test('Should use aria-label when label is not provided', () => {
    render(
      <DialButton
        aria-label="Custom aria label"
        iconBefore={<span>Icon</span>}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Custom aria label' }),
    ).toBeInTheDocument();
  });

  test('Should prefer label over native "aria-label" from properties for aria-label', () => {
    render(<DialButton label="Button label" aria-label="Aria label" />);
    expect(
      screen.getByRole('button', { name: 'Button label' }),
    ).toBeInTheDocument();
  });

  test('Should have correct button type', () => {
    render(<DialButton label="Type test" />);
    const button = screen.getByRole('button', { name: 'Type test' });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('Should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<DialButton label="Disabled click" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Disabled click' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should pass mouse event to onClick handler', () => {
    const onClick = vi.fn();
    render(<DialButton label="Event test" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Event test' }));
    expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  test.each([
    [ButtonVariant.Primary, 'dial-primary-button'],
    [ButtonVariant.Secondary, 'dial-secondary-button'],
    [ButtonVariant.Tertiary, 'dial-tertiary-button'],
  ])('applies mapped class for variant %s', (variant, expectedClass) => {
    render(<DialButton label="Click me" variant={variant} />);

    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass(expectedClass);
  });
});
