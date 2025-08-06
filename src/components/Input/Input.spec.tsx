import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialInput } from './Input';

describe('Dial UI Kit :: DialInput', () => {
  test('renders with default props', () => {
    const { getByPlaceholderText } = render(
      <DialInput elementId="test-input" placeholder="Enter text" />,
    );
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <DialInput
        elementId="test-input-change"
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
      <DialInput elementId="test-input" placeholder="Disabled" disabled />,
    );
    const input = getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  test('renders input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <DialInput elementId="icon-input" placeholder="With icon" />,
    );
    expect(getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  test('renders iconBeforeInput and iconAfterInput', () => {
    const before = <span>B</span>;
    const after = <span>A</span>;
    const { container } = render(
      <DialInput
        elementId="icon-input"
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
        elementId="icon-input"
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
      <DialInput elementId="test-input" placeholder="Test" hideBorder />,
    );
    const inputContainer = container.querySelector('.dial-input-field');
    expect(inputContainer).toHaveClass('dial-input-no-border');
    expect(inputContainer).not.toHaveClass('dial-input');
  });

  test('handles value and title attributes correctly', () => {
    const { getByDisplayValue } = render(
      <DialInput elementId="test-input" value="test value" />,
    );
    const input = getByDisplayValue('test value');
    expect(input).toHaveAttribute('title', 'test value');
  });

  test('applies invalid class when invalid prop is true', () => {
    const { getByPlaceholderText } = render(
      <DialInput elementId="test-input" placeholder="Invalid input" invalid />,
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
        elementId="test-input"
        placeholder="Readonly input"
        readonly
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Readonly input');
    fireEvent.change(input, { target: { value: 'should not call onChange' } });
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('renders with min and max attributes for number input', () => {
    const { getByPlaceholderText } = render(
      <DialInput
        elementId="test-number"
        type="number"
        placeholder="Enter number"
        min={0}
        max={100}
      />,
    );
    const input = getByPlaceholderText('Enter number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  test('renders prefix and suffix text', () => {
    const { container } = render(
      <DialInput
        elementId="test-input"
        placeholder="Amount"
        prefix="$"
        suffix="USD"
      />,
    );
    expect(container.textContent).toContain('$');
    expect(container.textContent).toContain('USD');
  });

  test('renders text before and after input', () => {
    const { container } = render(
      <DialInput
        elementId="test-input"
        placeholder="domain"
        textBeforeInput="https://"
        textAfterInput=".com"
      />,
    );
    expect(container.textContent).toContain('https://');
    expect(container.textContent).toContain('.com');
  });
});
