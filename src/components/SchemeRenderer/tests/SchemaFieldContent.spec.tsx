import { type ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import type { JsonSchema } from '@/components/SchemeRenderer/types';
import { SchemaFieldContent } from '@/components/SchemeRenderer/components/SchemaFieldContent';

const renderWithSchema = (ui: ReactElement, schema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider value={{ rootSchema: schema }}>
      {ui}
    </SchemaRendererContext.Provider>,
  );

describe('Dial UI Kit :: SchemaFieldContent', () => {
  test('routes string schema to a text input', () => {
    renderWithSchema(
      <SchemaFieldContent
        schema={{ type: 'string' }}
        value=""
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
    );
    expect(screen.getByPlaceholderText('Enter a value…')).toBeInTheDocument();
  });

  test('routes boolean schema to a switch', () => {
    renderWithSchema(
      <SchemaFieldContent
        schema={{ type: 'boolean' }}
        value={false}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('routes integer schema to a number input', () => {
    renderWithSchema(
      <SchemaFieldContent
        schema={{ type: 'integer' }}
        value={0}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
    );
    expect(
      screen.getByPlaceholderText('Enter a whole number…'),
    ).toBeInTheDocument();
  });

  test('routes array schema to array editor', () => {
    const schema: JsonSchema = { type: 'array', items: { type: 'string' } };
    renderWithSchema(
      <SchemaFieldContent
        schema={schema}
        value={[]}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });

  test('routes object schema to object editor', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: { x: { type: 'string', title: 'X Field' } },
    };
    renderWithSchema(
      <SchemaFieldContent
        schema={schema}
        value={{ x: '' }}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByText('X Field')).toBeInTheDocument();
  });

  test('routes additionalProperties-only object to key-value editor', () => {
    const schema: JsonSchema = {
      type: 'object',
      additionalProperties: { type: 'string' },
    };
    renderWithSchema(
      <SchemaFieldContent
        schema={schema}
        value={{}}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByText(/No fields yet/)).toBeInTheDocument();
  });

  test('routes anyOf schema to type selector', () => {
    const schema: JsonSchema = {
      anyOf: [{ type: 'null' }, { type: 'string' }],
    };
    renderWithSchema(
      <SchemaFieldContent
        schema={schema}
        value={null}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('routes oneOf with discriminator to type selector', () => {
    const schema: JsonSchema = {
      oneOf: [{ $ref: '#/$defs/Foo' }],
      discriminator: {
        propertyName: 'type',
        mapping: { foo: '#/$defs/Foo' },
      },
      $defs: {
        Foo: {
          type: 'object',
          properties: { type: { const: 'foo' } },
        },
      },
    };
    renderWithSchema(
      <SchemaFieldContent
        schema={schema}
        value={{ type: 'foo' }}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
