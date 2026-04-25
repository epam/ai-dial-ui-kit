import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import type { JsonSchema } from '@/components/SchemeRenderer/types';
import { SchemaObjectEditor } from '@/components/SchemeRenderer/components/SchemaObjectEditor';

const renderWithSchema = (ui: ReactElement, schema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider value={{ rootSchema: schema }}>
      {ui}
    </SchemaRendererContext.Provider>,
  );

describe('Dial UI Kit :: SchemaObjectEditor', () => {
  test('renders a labeled field for each property', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        age: { type: 'integer', title: 'Age' },
      },
    };
    renderWithSchema(
      <SchemaObjectEditor
        schema={schema}
        value={{ name: '', age: 0 }}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  test('uses toFieldLabel when property has no title', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: { myField: { type: 'string' } },
    };
    renderWithSchema(
      <SchemaObjectEditor
        schema={schema}
        value={{ myField: '' }}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    expect(screen.getByText('My Field')).toBeInTheDocument();
  });

  test('calls onChange with the updated object when a field changes', () => {
    const onChange = vi.fn();
    const schema: JsonSchema = {
      type: 'object',
      properties: { name: { type: 'string', title: 'Name' } },
    };
    renderWithSchema(
      <SchemaObjectEditor
        schema={schema}
        value={{ name: '' }}
        onChange={onChange}
        path={[]}
        level={0}
      />,
      schema,
    );
    fireEvent.change(screen.getByPlaceholderText('Enter a value…'), {
      target: { value: 'Alice' },
    });
    expect(onChange).toHaveBeenCalledWith({ name: 'Alice' });
  });

  test('renders "No configurable properties." when schema has no properties', () => {
    renderWithSchema(
      <SchemaObjectEditor
        schema={{}}
        value={{}}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
    );
    expect(screen.getByText('No configurable properties.')).toBeInTheDocument();
  });

  test('renders multiple inputs for multiple properties', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        a: { type: 'string', title: 'A' },
        b: { type: 'string', title: 'B' },
        c: { type: 'string', title: 'C' },
      },
    };
    renderWithSchema(
      <SchemaObjectEditor
        schema={schema}
        value={{ a: '', b: '', c: '' }}
        onChange={vi.fn()}
        path={[]}
        level={0}
      />,
      schema,
    );
    const inputs = screen.getAllByPlaceholderText('Enter a value…');
    expect(inputs).toHaveLength(3);
  });
});
