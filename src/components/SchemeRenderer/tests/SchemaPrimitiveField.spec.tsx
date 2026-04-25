import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaPrimitiveField } from '@/components/SchemeRenderer/components/SchemaPrimitiveField';

describe('Dial UI Kit :: SchemaPrimitiveField', () => {
  test('renders a text input for string type', () => {
    render(
      <SchemaPrimitiveField
        schema={{ type: 'string' }}
        value=""
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText('Enter a value…')).toBeInTheDocument();
  });

  test('calls onChange when string input changes', () => {
    const onChange = vi.fn();
    render(
      <SchemaPrimitiveField
        schema={{ type: 'string' }}
        value=""
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Enter a value…'), {
      target: { value: 'hello' },
    });
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  test('renders a disabled input for const field', () => {
    render(
      <SchemaPrimitiveField
        schema={{ const: 'fixed-value' }}
        value="fixed-value"
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByDisplayValue('fixed-value');
    expect(input).toBeDisabled();
  });

  test('renders a select trigger for enum field', () => {
    render(
      <SchemaPrimitiveField
        schema={{ type: 'string', enum: ['a', 'b', 'c'] }}
        value="a"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls onChange when enum option is selected', () => {
    const onChange = vi.fn();
    render(
      <SchemaPrimitiveField
        schema={{ type: 'string', enum: ['a', 'b'] }}
        value="a"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'b' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  test('renders a checkbox/switch for boolean type', () => {
    render(
      <SchemaPrimitiveField
        schema={{ type: 'boolean' }}
        value={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('calls onChange with toggled value when switch is clicked', () => {
    const onChange = vi.fn();
    render(
      <SchemaPrimitiveField
        schema={{ type: 'boolean' }}
        value={false}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('renders a number input for integer type', () => {
    render(
      <SchemaPrimitiveField
        schema={{ type: 'integer' }}
        value={0}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getByPlaceholderText('Enter a whole number…'),
    ).toBeInTheDocument();
  });

  test('renders a number input for number type', () => {
    render(
      <SchemaPrimitiveField
        schema={{ type: 'number' }}
        value={1.5}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText('Enter a number…')).toBeInTheDocument();
  });

  test('renders empty string value for undefined string input', () => {
    render(
      <SchemaPrimitiveField
        schema={{ type: 'string' }}
        value={undefined}
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText('Enter a value…');
    expect((input as HTMLInputElement).value).toBe('');
  });
});
