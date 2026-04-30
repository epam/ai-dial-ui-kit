import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemaRenderer/context';
import {
  DEFAULT_SCHEMA_TEXTS,
  SchemaDisplayMode,
  SchemaOrientation,
} from '@/components/SchemaRenderer/types';
import { SchemaPrimitiveField } from '@/components/SchemaRenderer/components/SchemaPrimitiveField';

const renderWithSchema = (ui: ReactElement) =>
  render(
    <SchemaRendererContext.Provider
      value={{ rootSchema: {}, texts: DEFAULT_SCHEMA_TEXTS }}
    >
      {ui}
    </SchemaRendererContext.Provider>,
  );

describe('Dial UI Kit :: SchemaPrimitiveField', () => {
  test('renders a text input for string type', () => {
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'string' }}
        value=""
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder),
    ).toBeInTheDocument();
  });

  test('calls onChange when string input changes', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'string' }}
        value=""
        onChange={onChange}
      />,
    );
    fireEvent.change(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder),
      {
        target: { value: 'hello' },
      },
    );
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  test('renders a disabled input for const field', () => {
    renderWithSchema(
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
    renderWithSchema(
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
    renderWithSchema(
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
    renderWithSchema(
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
    renderWithSchema(
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
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'integer' }}
        value={0}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.integerInputPlaceholder),
    ).toBeInTheDocument();
  });

  test('renders a number input for number type', () => {
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'number' }}
        value={1.5}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.numberInputPlaceholder),
    ).toBeInTheDocument();
  });

  test('renders empty string value for undefined string input', () => {
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'string' }}
        value={undefined}
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText(
      DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder,
    );
    expect((input as HTMLInputElement).value).toBe('');
  });

  test('renders radio buttons for enum field with enumDisplay radio', () => {
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumDisplay: SchemaDisplayMode.Radio,
        }}
        value="a"
        onChange={vi.fn()}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect((radios[0] as HTMLInputElement).checked).toBe(true);
    expect((radios[1] as HTMLInputElement).checked).toBe(false);
  });

  test('calls onChange with the selected value when a radio is clicked', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{
          type: 'string',
          enum: ['a', 'b'],
          enumDisplay: SchemaDisplayMode.Radio,
        }}
        value="a"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'b' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  test('renders radio buttons in a row when enumOrientation is row', () => {
    const { container } = renderWithSchema(
      <SchemaPrimitiveField
        schema={{
          type: 'string',
          enum: ['x', 'y'],
          enumDisplay: SchemaDisplayMode.Radio,
          enumOrientation: SchemaOrientation.Row,
        }}
        value="x"
        onChange={vi.fn()}
      />,
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group?.className).toContain('flex-row');
  });

  test('renders a password input for isProtected string field', () => {
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'string', isProtected: true }}
        value=""
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText(
      DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder,
    );
    expect((input as HTMLInputElement).type).toBe('password');
  });

  test('calls onChange when protected input changes', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaPrimitiveField
        schema={{ type: 'string', isProtected: true }}
        value=""
        onChange={onChange}
      />,
    );
    fireEvent.change(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder),
      { target: { value: 'secret' } },
    );
    expect(onChange).toHaveBeenCalledWith('secret');
  });
});
