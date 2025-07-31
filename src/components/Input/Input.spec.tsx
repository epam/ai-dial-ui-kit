import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialInput } from './Input';

describe('Ui Kit components :: DialInput', () => {
  test('renders with default props', () => {
    const { getByPlaceholderText } = render(
      <DialInput inputId="test-input" placeholder="Enter text" />,
    );
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <DialInput
        inputId="test-input-change"
        placeholder="Type value here"
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Type value here');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  test('is disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <DialInput inputId="test-input" placeholder="Disabled" disabled />,
    );
    const input = getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  test('renders input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <DialInput inputId="icon-input" placeholder="With icon" />,
    );
    expect(getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  test('renders iconBeforeInput and iconAfterInput', () => {
    const before = <span>B</span>;
    const after = <span>A</span>;
    const { container } = render(
      <DialInput
        inputId="icon-input"
        placeholder="With icon"
        iconBeforeInput={before}
        iconAfterInput={after}
      />,
    );
    // Check for the text content of the icons
    expect(container.textContent).toContain('B');
    expect(container.textContent).toContain('A');
  });

  test('calls onChange when input changes', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <DialInput
        inputId="icon-input"
        placeholder="Type here"
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  test('applies hideBorder class correctly', () => {
    const { container } = render(
      <DialInput inputId="test-input" placeholder="Test" hideBorder />,
    );
    const inputContainer = container.querySelector('.dial-input-field');
    expect(inputContainer).toHaveClass('dial-input-no-border');
    expect(inputContainer).not.toHaveClass('dial-input');
  });

  test('handles value and title attributes correctly', () => {
    const { getByDisplayValue } = render(
      <DialInput inputId="test-input" value="test value" />,
    );
    const input = getByDisplayValue('test value');
    expect(input).toHaveAttribute('title', 'test value');
  });

  test('applies invalid class when invalid prop is true', () => {
    const { getByPlaceholderText } = render(
      <DialInput inputId="test-input" placeholder="Invalid input" invalid />,
    );
    const input = getByPlaceholderText('Invalid input');
    const container = input.parentElement;
    expect(input).toHaveClass('border-0 bg-transparent');
    expect(container).toHaveClass('dial-input-error');
  });

  test('readonly prevents onChange from being called', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <DialInput
        inputId="test-input"
        placeholder="Readonly input"
        readonly
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Readonly input');
    fireEvent.change(input, { target: { value: 'should not call onChange' } });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
