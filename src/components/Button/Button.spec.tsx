import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialButton } from './Button';

describe('Dial UI Kit :: DialButton', () => {
  test('Should render with title and be accessible by role', () => {
    render(<DialButton title="Click me" />);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DialButton title="Clickable Button" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clickable Button' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disable prop is true', () => {
    render(<DialButton title="Disabled" disable hideTitleOnMobile />);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  test('Should render iconBefore and iconAfter', () => {
    render(
      <DialButton
        title="With Icons"
        iconBefore={<span>Before</span>}
        iconAfter={<span>After</span>}
      />,
    );
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  test('Should render without title when only icons are provided', () => {
    render(
      <DialButton
        iconBefore={<span data-testid="icon">Icon</span>}
        ariaLabel="Icon button"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Icon button' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByText('Icon button')).not.toBeInTheDocument();
  });

  test('Should apply custom CSS class', () => {
    render(<DialButton title="Styled" cssClass="custom-button-class" />);
    const button = screen.getByRole('button', { name: 'Styled' });
    expect(button).toHaveClass('custom-button-class');
  });

  test('Should apply focus-visible outline classes', () => {
    render(<DialButton title="Focus test" />);
    const button = screen.getByRole('button', { name: 'Focus test' });
    expect(button).toHaveClass('focus-visible:outline', 'outline-offset-0');
  });

  test('Should hide title on mobile when hideTitleOnMobile is true', () => {
    render(<DialButton title="Mobile test" hideTitleOnMobile />);
    const titleSpan = screen.getByText('Mobile test');
    expect(titleSpan).toHaveClass('hidden', 'sm:inline');
  });

  test('Should show title on all devices when hideTitleOnMobile is false', () => {
    render(<DialButton title="Desktop test" hideTitleOnMobile={false} />);
    const titleSpan = screen.getByText('Desktop test');
    expect(titleSpan).toHaveClass('inline');
    expect(titleSpan).not.toHaveClass('hidden');
  });

  test('Should apply correct spacing classes with icons', () => {
    render(
      <DialButton
        title="Spacing test"
        iconBefore={<span>Before</span>}
        iconAfter={<span>After</span>}
      />,
    );
    const titleSpan = screen.getByText('Spacing test');
    expect(titleSpan).toHaveClass('mr-2', 'ml-2');
  });

  test('Should apply correct spacing with only iconBefore', () => {
    render(<DialButton title="Before only" iconBefore={<span>Before</span>} />);
    const titleSpan = screen.getByText('Before only');
    expect(titleSpan).toHaveClass('ml-2');
    expect(titleSpan).not.toHaveClass('mr-2');
  });

  test('Should apply correct spacing with only iconAfter', () => {
    render(<DialButton title="After only" iconAfter={<span>After</span>} />);
    const titleSpan = screen.getByText('After only');
    expect(titleSpan).toHaveClass('mr-2');
    expect(titleSpan).not.toHaveClass('ml-2');
  });

  test('Should use ariaLabel when title is not provided', () => {
    render(
      <DialButton
        ariaLabel="Custom aria label"
        iconBefore={<span>Icon</span>}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Custom aria label' }),
    ).toBeInTheDocument();
  });

  test('Should prefer title over ariaLabel for aria-label', () => {
    render(<DialButton title="Button title" ariaLabel="Aria label" />);
    expect(
      screen.getByRole('button', { name: 'Button title' }),
    ).toBeInTheDocument();
  });

  test('Should have correct button type', () => {
    render(<DialButton title="Type test" />);
    const button = screen.getByRole('button', { name: 'Type test' });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('Should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<DialButton title="Disabled click" onClick={onClick} disable />);
    fireEvent.click(screen.getByRole('button', { name: 'Disabled click' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should pass mouse event to onClick handler', () => {
    const onClick = vi.fn();
    render(<DialButton title="Event test" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Event test' }));
    expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
  });
});
