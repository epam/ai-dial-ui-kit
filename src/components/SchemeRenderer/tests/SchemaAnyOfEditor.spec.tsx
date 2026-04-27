import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import {
  type JsonSchema,
  DEFAULT_SCHEMA_TEXTS,
} from '@/components/SchemeRenderer/types';
import { SchemaAnyOfEditor } from '@/components/SchemeRenderer/components/SchemaAnyOfEditor';

const renderWithSchema = (ui: ReactElement, schema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider
      value={{ rootSchema: schema, texts: DEFAULT_SCHEMA_TEXTS }}
    >
      {ui}
    </SchemaRendererContext.Provider>,
  );

const nullableStringSchema: JsonSchema = {
  anyOf: [{ type: 'null' }, { type: 'string' }],
};

describe('Dial UI Kit :: SchemaAnyOfEditor', () => {
  test('renders a select with one option per anyOf variant', () => {
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={nullableStringSchema}
        value={null}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      nullableStringSchema,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('option', { name: 'null' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'string' })).toBeInTheDocument();
  });

  test('does not render sub-editor when null variant is selected', () => {
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={nullableStringSchema}
        value={null}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      nullableStringSchema,
    );
    expect(
      screen.queryByPlaceholderText(
        DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder,
      ),
    ).not.toBeInTheDocument();
  });

  test('renders sub-editor when non-null variant is active', () => {
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={nullableStringSchema}
        value="hello"
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      nullableStringSchema,
    );
    expect(
      screen.getByPlaceholderText(DEFAULT_SCHEMA_TEXTS.stringInputPlaceholder),
    ).toBeInTheDocument();
  });

  test('calls onChange with null when null variant is selected', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={nullableStringSchema}
        value="hello"
        onChange={onChange}
        path={[]}
        level={0}
      />,
      nullableStringSchema,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'null' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  test('calls onChange with empty string when string variant is selected', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={nullableStringSchema}
        value={null}
        onChange={onChange}
        path={[]}
        level={0}
      />,
      nullableStringSchema,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'string' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  test('calls onChange with false when boolean variant is selected', () => {
    const schema: JsonSchema = {
      anyOf: [{ type: 'null' }, { type: 'boolean' }],
    };
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={schema}
        value={null}
        onChange={onChange}
        path={[]}
        level={0}
      />,
      schema,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'boolean' }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('calls onChange with empty array when array variant is selected', () => {
    const schema: JsonSchema = {
      anyOf: [{ type: 'null' }, { type: 'array', items: { type: 'string' } }],
    };
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaAnyOfEditor
        schema={schema}
        value={null}
        onChange={onChange}
        path={[]}
        level={0}
      />,
      schema,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: /array/i }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
