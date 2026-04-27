import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import {
  type JsonSchema,
  DEFAULT_SCHEMA_TEXTS,
} from '@/components/SchemeRenderer/types';
import { SchemaArrayEditor } from '@/components/SchemeRenderer/components/SchemaArrayEditor';

const renderWithSchema = (ui: ReactElement, schema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider
      value={{ rootSchema: schema, texts: DEFAULT_SCHEMA_TEXTS }}
    >
      {ui}
    </SchemaRendererContext.Provider>,
  );

describe('Dial UI Kit :: SchemaArrayEditor', () => {
  test('shows "No items yet." when array is empty', () => {
    const schema: JsonSchema = { type: 'array', items: { type: 'string' } };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={[]}
        onChange={vi.fn()}
        path={['list']}
        level={1}
      />,
      schema,
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });

  test('renders "No item schema defined." when items is missing', () => {
    const schema: JsonSchema = { type: 'array' };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={[]}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByText('No item schema defined.')).toBeInTheDocument();
  });

  test('adds a string item with empty string as default', () => {
    const onChange = vi.fn();
    const schema: JsonSchema = { type: 'array', items: { type: 'string' } };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={[]}
        onChange={onChange}
        path={['list']}
        level={1}
      />,
      schema,
    );
    fireEvent.click(screen.getByRole('button', { name: /add item/i }));
    expect(onChange).toHaveBeenCalledWith(['']);
  });

  test('adds a boolean item with false as default', () => {
    const onChange = vi.fn();
    const schema: JsonSchema = { type: 'array', items: { type: 'boolean' } };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={[]}
        onChange={onChange}
        path={[]}
        level={0}
      />,
      schema,
    );
    fireEvent.click(screen.getByRole('button', { name: /add item/i }));
    expect(onChange).toHaveBeenCalledWith([false]);
  });

  test('renders existing items as titled sections', () => {
    const schema: JsonSchema = { type: 'array', items: { type: 'string' } };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={['foo', 'bar']}
        onChange={vi.fn()}
        path={['list']}
        level={1}
      />,
      schema,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('removes an item at the correct index', () => {
    const onChange = vi.fn();
    const schema: JsonSchema = { type: 'array', items: { type: 'string' } };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={['foo', 'bar', 'baz']}
        onChange={onChange}
        path={['list']}
        level={0}
      />,
      schema,
    );
    const removeButtons = screen.getAllByRole('button', {
      name: 'Remove item',
    });
    expect(removeButtons).toHaveLength(3);
    fireEvent.click(removeButtons[1]);
    expect(onChange).toHaveBeenCalledWith(['foo', 'baz']);
  });

  test('shows type selector when discriminator is present', () => {
    const schema: JsonSchema = {
      type: 'array',
      items: {
        oneOf: [{ $ref: '#/$defs/Dog' }],
        discriminator: {
          propertyName: 'kind',
          mapping: { dog: '#/$defs/Dog' },
        },
      },
      $defs: {
        Dog: { type: 'object', properties: { kind: { type: 'string' } } },
      },
    };
    renderWithSchema(
      <SchemaArrayEditor
        schema={schema}
        value={[]}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    // The add-type select shows the first option value ('dog') as its selected label
    const addTypeSelect = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-haspopup') === 'listbox');
    expect(addTypeSelect).toBeInTheDocument();
  });
});
