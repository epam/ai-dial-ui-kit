import { useState, type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemaRenderer/context';
import {
  DEFAULT_SCHEMA_TEXTS,
  type JsonSchema,
} from '@/components/SchemaRenderer/types';
import { SchemaKeyValueEditor } from '@/components/SchemaRenderer/components/SchemaKeyValueEditor';

const renderWithSchema = (ui: ReactElement, rootSchema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider
      value={{ rootSchema, texts: DEFAULT_SCHEMA_TEXTS }}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
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
        path={[]}
        level={0}
      />,
    );
    const keyInput = screen.getByDisplayValue('foo');
    await user.click(keyInput);
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('shows a key-required error immediately for a new empty-key entry (skipUntouched defaults to false)', () => {
    renderWithSchema(
      <SchemaKeyValueEditor
        schema={{ type: 'object', additionalProperties: true }}
        value={{}}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    expect(screen.getByText(/Key is required/)).toBeInTheDocument();
  });

  test('does not show a key-required error until touched when skipUntouched is true', () => {
    const WithTouchedTracking = () => {
      const [touchedPaths, setTouchedPaths] = useState<Set<string>>(new Set());
      const markTouched = (path: string) =>
        setTouchedPaths((prev) => new Set(prev).add(path));
      return (
        <SchemaRendererContext.Provider
          value={{
            rootSchema: {},
            texts: DEFAULT_SCHEMA_TEXTS,
            skipUntouched: true,
            touchedPaths,
            markTouched,
          }}
        >
          <SchemaKeyValueEditor
            schema={{ type: 'object', additionalProperties: true }}
            value={{}}
            onChange={vi.fn()}
            path={[]}
            level={0}
          />
        </SchemaRendererContext.Provider>
      );
    };
    render(<WithTouchedTracking />);

    fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    expect(screen.queryByText(/Key is required/)).not.toBeInTheDocument();

    const keyInput = screen.getByPlaceholderText(
      DEFAULT_SCHEMA_TEXTS.keyInputPlaceholder,
    );
    fireEvent.blur(keyInput);
    expect(screen.getByText(/Key is required/)).toBeInTheDocument();
  });

  describe('discriminated object values', () => {
    const rootSchema: JsonSchema = {
      $defs: {
        VectorIndexConfig: {
          title: 'Vector Index',
          type: 'object',
          properties: {
            type: { const: 'vector', default: 'vector', type: 'string' },
            display_name: { title: 'Display Name', type: 'string' },
          },
          required: ['display_name'],
        },
        KeywordIndexConfig: {
          title: 'Keyword Index',
          type: 'object',
          properties: {
            type: { const: 'keyword', default: 'keyword', type: 'string' },
            display_name: { title: 'Display Name', type: 'string' },
          },
          required: ['display_name'],
        },
      },
    };

    const additionalProperties = {
      discriminator: {
        propertyName: 'type',
        mapping: {
          vector: '#/$defs/VectorIndexConfig',
          keyword: '#/$defs/KeywordIndexConfig',
        },
      },
      oneOf: [
        { $ref: '#/$defs/VectorIndexConfig' },
        { $ref: '#/$defs/KeywordIndexConfig' },
      ],
    };

    test('renders nested fields instead of a stringified value', () => {
      renderWithSchema(
        <SchemaKeyValueEditor
          schema={{ type: 'object', additionalProperties }}
          value={{
            primary: { type: 'vector', display_name: 'Primary Vector Index' },
          }}
          onChange={vi.fn()}
          path={['indexes']}
          level={0}
        />,
        rootSchema,
      );
      expect(screen.queryByText('[object Object]')).not.toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Primary Vector Index'),
      ).toBeInTheDocument();
    });

    test('pre-seeds the first discriminator variant defaults when adding a new entry', () => {
      renderWithSchema(
        <SchemaKeyValueEditor
          schema={{ type: 'object', additionalProperties }}
          value={{}}
          onChange={vi.fn()}
          path={['indexes']}
          level={0}
        />,
        rootSchema,
      );
      fireEvent.click(screen.getByRole('button', { name: /add field/i }));
      expect(screen.getByText('Display Name')).toBeInTheDocument();
    });

    test('shows an error badge when a required nested field is missing', () => {
      renderWithSchema(
        <SchemaKeyValueEditor
          schema={{ type: 'object', additionalProperties }}
          value={{ primary: { type: 'vector' } }}
          onChange={vi.fn()}
          path={['indexes']}
          level={0}
        />,
        rootSchema,
      );
      expect(screen.getByText(/1 error/)).toBeInTheDocument();
    });

    test('folds a touched empty key into the section error count', () => {
      renderWithSchema(
        <SchemaKeyValueEditor
          schema={{ type: 'object', additionalProperties }}
          value={{
            primary: { type: 'vector', display_name: 'Primary Vector Index' },
          }}
          onChange={vi.fn()}
          path={['indexes']}
          level={0}
        />,
        rootSchema,
      );
      const keyInput = screen.getByDisplayValue('primary');
      fireEvent.change(keyInput, { target: { value: '' } });
      fireEvent.blur(keyInput);
      expect(screen.getByText(/1 error/)).toBeInTheDocument();
    });
  });

  describe('plain object values (no oneOf/discriminator)', () => {
    test('renders nested fields instead of a stringified value', () => {
      renderWithSchema(
        <SchemaKeyValueEditor
          schema={{
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                host: { title: 'Host', type: 'string' },
                port: { title: 'Port', type: 'integer' },
              },
            },
          }}
          value={{ primary: { host: 'localhost', port: 5432 } }}
          onChange={vi.fn()}
          path={['connections']}
          level={0}
        />,
      );
      expect(screen.queryByText('[object Object]')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('localhost')).toBeInTheDocument();
    });
  });

  describe('array values', () => {
    test('renders an editable list instead of a stringified value', () => {
      renderWithSchema(
        <SchemaKeyValueEditor
          schema={{
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          }}
          value={{ tags: ['prod', 'eu'] }}
          onChange={vi.fn()}
          path={['groups']}
          level={0}
        />,
      );
      expect(screen.queryByText('[object Object]')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('prod')).toBeInTheDocument();
      expect(screen.getByDisplayValue('eu')).toBeInTheDocument();
    });
  });
});
