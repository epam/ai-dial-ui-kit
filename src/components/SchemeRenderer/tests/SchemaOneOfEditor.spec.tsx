import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import type { JsonSchema } from '@/components/SchemeRenderer/types';
import { SchemaOneOfEditor } from '@/components/SchemeRenderer/components/SchemaOneOfEditor';

const renderWithSchema = (ui: ReactElement, schema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider value={{ rootSchema: schema }}>
      {ui}
    </SchemaRendererContext.Provider>,
  );

const discriminatorSchema: JsonSchema = {
  oneOf: [{ $ref: '#/$defs/Dog' }, { $ref: '#/$defs/Cat' }],
  discriminator: {
    propertyName: 'kind',
    mapping: { dog: '#/$defs/Dog', cat: '#/$defs/Cat' },
  },
  $defs: {
    Dog: {
      type: 'object',
      properties: {
        kind: { type: 'string', const: 'dog' },
        name: { type: 'string', title: 'Dog Name' },
      },
    },
    Cat: {
      type: 'object',
      properties: {
        kind: { type: 'string', const: 'cat' },
        lives: { type: 'integer', title: 'Lives' },
      },
    },
  },
};

describe('Dial UI Kit :: SchemaOneOfEditor', () => {
  describe('with discriminator mapping', () => {
    test('renders all discriminator options in the select', () => {
      renderWithSchema(
        <SchemaOneOfEditor
          schema={discriminatorSchema}
          value={undefined}
          onChange={vi.fn()}
          path={[]}
          level={0}
        />,
        discriminatorSchema,
      );
      fireEvent.click(screen.getByRole('button', { name: /select type/i }));
      expect(screen.getByRole('option', { name: 'dog' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'cat' })).toBeInTheDocument();
    });

    test('renders properties for the currently selected type', () => {
      renderWithSchema(
        <SchemaOneOfEditor
          schema={discriminatorSchema}
          value={{ kind: 'dog', name: '' }}
          onChange={vi.fn()}
          path={[]}
          level={0}
        />,
        discriminatorSchema,
      );
      expect(screen.getByText('Dog Name')).toBeInTheDocument();
      expect(screen.queryByText('Lives')).not.toBeInTheDocument();
    });

    test('calls onChange with discriminator prop when type changes', () => {
      const onChange = vi.fn();
      renderWithSchema(
        <SchemaOneOfEditor
          schema={discriminatorSchema}
          value={{ kind: 'dog', name: '' }}
          onChange={onChange}
          path={[]}
          level={0}
        />,
        discriminatorSchema,
      );
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'cat' }));
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'cat' }),
      );
    });

    test('renders no sub-editor when no type is selected yet', () => {
      renderWithSchema(
        <SchemaOneOfEditor
          schema={discriminatorSchema}
          value={undefined}
          onChange={vi.fn()}
          path={[]}
          level={0}
        />,
        discriminatorSchema,
      );
      expect(screen.queryByText('Dog Name')).not.toBeInTheDocument();
      expect(screen.queryByText('Lives')).not.toBeInTheDocument();
    });
  });

  describe('without discriminator (plain oneOf)', () => {
    const plainSchema: JsonSchema = {
      oneOf: [
        {
          type: 'object',
          title: 'Option A',
          required: ['a'],
          properties: { a: { type: 'string', title: 'A Field' } },
        },
        {
          type: 'object',
          title: 'Option B',
          required: ['b'],
          properties: { b: { type: 'string', title: 'B Field' } },
        },
      ],
    };

    test('renders options derived from oneOf titles', () => {
      renderWithSchema(
        <SchemaOneOfEditor
          schema={plainSchema}
          value={null}
          onChange={vi.fn()}
          path={[]}
          level={0}
        />,
        plainSchema,
      );
      fireEvent.click(screen.getByRole('button'));
      expect(
        screen.getByRole('option', { name: 'Option A' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option B' }),
      ).toBeInTheDocument();
    });

    test('detects active variant from required keys in value', () => {
      renderWithSchema(
        <SchemaOneOfEditor
          schema={plainSchema}
          value={{ b: 'hello' }}
          onChange={vi.fn()}
          path={[]}
          level={0}
        />,
        plainSchema,
      );
      expect(screen.getByText('B Field')).toBeInTheDocument();
      expect(screen.queryByText('A Field')).not.toBeInTheDocument();
    });

    test('calls onChange with null when no defaults are available', () => {
      const onChange = vi.fn();
      renderWithSchema(
        <SchemaOneOfEditor
          schema={plainSchema}
          value={null}
          onChange={onChange}
          path={[]}
          level={0}
        />,
        plainSchema,
      );
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'Option B' }));
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });
});
