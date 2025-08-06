import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialNumberInputField, DialTextInputField } from './InputField';

describe('Dial UI Kit :: DialNumberInputField', () => {
  it('renders with basic props', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        placeholder="Enter number"
        value={42.5}
      />,
    );

    expect(screen.getByLabelText('Test Number Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  it('renders with value', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        value={42.5}
      />,
    );

    expect(screen.getByLabelText('Test Number Field')).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  it('shows optional indicator when optional is true', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        optional={true}
      />,
    );

    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('displays error text when provided', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        errorText="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange with processed number value', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '123.45' } });

    expect(onChange).toHaveBeenCalledWith(123.45);
  });

  it('renders readonly with value', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        readonly={true}
        value={99.99}
      />,
    );

    expect(screen.getByText('99.99')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        disabled={true}
      />,
    );

    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('applies min and max attributes correctly', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        min={0}
        max={100}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('applies only min attribute when max is not provided', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
        min={10}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '10');
    expect(input).not.toHaveAttribute('max');
  });

  it('does not apply min/max attributes when not provided', () => {
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveAttribute('min');
    expect(input).not.toHaveAttribute('max');
  });

  it('handles decimal values with min and max constraints', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
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

  it('handles leading zeros properly with min/max constraints', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInputField
        elementId="test-number"
        fieldTitle="Test Number Field"
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
  it('renders with basic props', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        placeholder="Enter text"
      />,
    );

    expect(screen.getByLabelText('Test Text Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('displays value correctly', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        value="Sample text"
      />,
    );

    expect(screen.getByDisplayValue('Sample text')).toBeInTheDocument();
  });

  it('shows optional indicator when optional is true', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        optional={true}
      />,
    );

    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('displays error text when provided', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        errorText="Invalid input"
      />,
    );

    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('calls onChange with string value', () => {
    const onChange = vi.fn();
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(onChange).toHaveBeenCalledWith('Hello world');
  });

  it('renders as readonly with default empty text', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        readonly={true}
        defaultEmptyText="No value set"
      />,
    );

    expect(screen.getByText('No value set')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders readonly with value', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        readonly={true}
        value="Readonly text"
      />,
    );

    expect(screen.getByText('Readonly text')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        disabled={true}
      />,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders with icons', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        iconBeforeInput={<span data-testid="before-icon">🔍</span>}
        iconAfterInput={<span data-testid="after-icon">👁️</span>}
      />,
    );

    expect(screen.getByTestId('before-icon')).toBeInTheDocument();
    expect(screen.getByTestId('after-icon')).toBeInTheDocument();
  });

  it('applies custom CSS classes', () => {
    render(
      <DialTextInputField
        elementId="test-text"
        fieldTitle="Test Text Field"
        containerCssClass="custom-container"
        elementCssClass="custom-input"
      />,
    );

    const container = screen.getByRole('textbox').closest('.custom-container');
    expect(container).toBeInTheDocument();
  });
});
