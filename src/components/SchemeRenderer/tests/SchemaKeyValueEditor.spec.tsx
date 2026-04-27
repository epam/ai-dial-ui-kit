import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import { DEFAULT_SCHEMA_TEXTS } from '@/components/SchemeRenderer/types';
import { SchemaKeyValueEditor } from '@/components/SchemeRenderer/components/SchemaKeyValueEditor';

const renderWithSchema = (ui: ReactElement) =>
  render(
    <SchemaRendererContext.Provider
      value={{ rootSchema: {}, texts: DEFAULT_SCHEMA_TEXTS }}
    >
      {ui}
    </SchemaRendererContext.Provider>,
  );

describe('Dial UI Kit :: SchemaKeyValueEditor', () => {
  test('renders empty state when value is an empty object', () => {
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: true }}
        value={{}}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/No fields yet/)).toBeInTheDocument();
  });

  test('renders existing key-value pairs on mount', () => {
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ foo: 'bar' }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByDisplayValue('foo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('bar')).toBeInTheDocument();
  });

  test('shows column headers when pairs exist', () => {
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ x: 'y' }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  test('adds a new empty row when "Add Field" is clicked', () => {
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: true }}
        value={{}}
        onChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    expect(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.keyInputPlaceholder),
    ).toBeInTheDocument();
  });

  test('removes a pair and calls onChange with updated object', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ foo: 'bar' }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove field' }));
    expect(onChange).toHaveBeenCalledWith({});
  });

  test('removes the correct pair when multiple pairs exist', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ a: '1', b: '2', c: '3' }}
        onChange={onChange}
      />,
    );
    const removeButtons = screen.getAllByRole('button', {
      name: 'Remove field',
    });
    fireEvent.click(removeButtons[1]);
    expect(onChange).toHaveBeenCalledWith({ a: '1', c: '3' });
  });

  test('calls onChange immediately when value input changes', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ foo: '' }}
        onChange={onChange}
      />,
    );
    fireEvent.change(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder),
      {
        target: { value: 'baz' },
      },
    );
    expect(onChange).toHaveBeenCalledWith({ foo: 'baz' });
  });

  test('does not call onChange while typing in key input', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ foo: 'bar' }}
        onChange={onChange}
      />,
    );
    const keyInput = screen.getByDisplayValue('foo');
    fireEvent.change(keyInput, { target: { value: 'new' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('calls onChange with new key after key input is blurred', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ foo: 'bar' }}
        onChange={onChange}
      />,
    );
    const keyInput = screen.getByDisplayValue('foo');
    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.blur(keyInput);
    expect(onChange).toHaveBeenCalledWith({ newKey: 'bar' });
  });

  test('does not call onChange on blur when key has not changed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: { type: 'string' } }}
        value={{ foo: 'bar' }}
        onChange={onChange}
      />,
    );
    const keyInput = screen.getByDisplayValue('foo');
    await user.click(keyInput);
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });
});
