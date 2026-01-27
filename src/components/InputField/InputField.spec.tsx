import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialNumberInputField, DialTextInputField } from './InputField';

describe('Dial UI Kit :: DialNumberInputField', () => {
  test('renders with basic props', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        placeholder="Enter number"
        value={42.5}
      />,
    );

    expect(screen.getByText(/test number field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  test('renders with value', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        value={42.5}
      />,
    );

    expect(screen.getByText(/test number field/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  test('shows optional indicator when optional is true', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        optional={true}
      />,
    );

    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  test('displays error text when provided', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        errorText="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('calls onChange with processed number value', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '123.45' } });

    expect(onChange).toHaveBeenCalledWith(123.45);
  });

  test('renders readonly with value', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        readonly={true}
        value={99.99}
      />,
    );

    expect(screen.getByText('99.99')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  test('applies disabled state correctly', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        disabled={true}
      />,
    );

    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  test('applies min and max attributes correctly', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        min={0}
        max={100}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  test('applies only min attribute when max is not provided', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        min={10}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '10');
    expect(input).not.toHaveAttribute('max');
  });

  test('does not apply min/max attributes when not provided', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveAttribute('min');
    expect(input).not.toHaveAttribute('max');
  });

  test('handles decimal values with min and max constraints', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        min={0.1}
        max={99.9}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0.1');
    expect(input).toHaveAttribute('max', '99.9');

    fireEvent.change(input, { target: { value: '50.5' } });
    expect(onChange).toHaveBeenCalledWith(50.5);
  });

  test('handles leading zeros properly with min/max constraints', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldLabel="Test Number Field"
        min={0}
        max={1}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0.005' } });

    expect(onChange).toHaveBeenCalledWith('0.005');
  });
});

describe('Dial UI Kit :: DialTextInputField', () => {
  test('renders with basic props', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        placeholder="Enter text"
      />,
    );

    expect(screen.getByText(/test text field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  test('displays value correctly', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        value="Sample text"
      />,
    );

    expect(screen.getByDisplayValue('Sample text')).toBeInTheDocument();
  });

  test('shows optional indicator when optional is true', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        optional={true}
      />,
    );

    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  test('displays error text when provided', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        errorText="Invalid input"
      />,
    );

    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  test('calls onChange with string value', () => {
    const onChange = vi.fn();
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(onChange).toHaveBeenCalledWith('Hello world');
  });

  test('renders as readonly with default empty text', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        readonly={true}
        defaultEmptyText="No value set"
      />,
    );

    expect(screen.getByText('No value set')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('renders readonly with value', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        readonly={true}
        value="Readonly text"
      />,
    );

    expect(screen.getByText('Readonly text')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('applies disabled state correctly', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        disabled={true}
      />,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  test('renders with icons', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        iconBefore={
          <span role="img" aria-label="Search">
            🔍
          </span>
        }
        iconAfter={
          <span role="img" aria-label="View">
            👁️
          </span>
        }
      />,
    );

    expect(screen.getByRole('img', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'View' })).toBeInTheDocument();
  });

  test('applies custom CSS classes', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        containerClassName="custom-container"
        elementClassName="custom-input"
      />,
    );

    const container = screen.getByRole('textbox').closest('.custom-container');
    expect(container).toBeInTheDocument();
  });

  test('renders with prefix and suffix', () => {
    const { container } = render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        prefix="$"
        suffix="USD"
      />,
    );

    expect(container.textContent).toContain('$');
    expect(container.textContent).toContain('USD');
  });

  test('renders with text before and after input', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldLabel="Test Text Field"
        textBeforeInput="https://"
        value="example"
        textAfterInput=".com"
      />,
    );

    expect(screen.getByDisplayValue('example')).toBeInTheDocument();

    expect(screen.getByDisplayValue('https://')).toBeInTheDocument();
    expect(screen.getByDisplayValue('.com')).toBeInTheDocument();

    const httpsInput = screen.getByDisplayValue('https://');
    const comInput = screen.getByDisplayValue('.com');

    expect(httpsInput).toBeDisabled();
    expect(comInput).toBeDisabled();
  });
});
