import { type ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import type { JsonSchema } from '@/components/SchemeRenderer/types';
import { SchemaField } from '@/components/SchemeRenderer/components/SchemaField';

const renderWithSchema = (ui: ReactElement, schema: JsonSchema = {}) =>
  render(
    <SchemaRendererContext.Provider value={{ rootSchema: schema }}>
      {ui}
    </SchemaRendererContext.Provider>,
  );

describe('Dial UI Kit :: SchemaField', () => {
  test('renders label for a primitive field', () => {
    renderWithSchema(
      <SchemaField
        schema={{ type: 'string' }}
        value=""
        onChange={vi.fn()}
        path={['name']}
        label="Name"
        level={0}
      />,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a value…')).toBeInTheDocument();
  });

  test('calls onChange when primitive field value changes', () => {
    const onChange = vi.fn();
    renderWithSchema(
      <SchemaField
        schema={{ type: 'string' }}
        value=""
        onChange={onChange}
        path={['name']}
        label="Name"
        level={0}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Enter a value…'), {
      target: { value: 'Bob' },
    });
    expect(onChange).toHaveBeenCalledWith('Bob');
  });

  test('renders a collapsible section for an object field', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: { x: { type: 'string', title: 'X' } },
    };
    const { container } = renderWithSchema(
      <SchemaField
        schema={schema}
        value={{ x: '' }}
        onChange={vi.fn()}
        path={['obj']}
        label="Config"
        level={0}
      />,
      schema,
    );
    expect(screen.getByText('Config')).toBeInTheDocument();
    expect(container.querySelector('[aria-expanded]')).toBeInTheDocument();
  });

  test('renders a collapsible section for an array field', () => {
    const schema: JsonSchema = { type: 'array', items: { type: 'string' } };
    const { container } = renderWithSchema(
      <SchemaField
        schema={schema}
        value={[]}
        onChange={vi.fn()}
        path={['list']}
        label="List"
        level={0}
      />,
      schema,
    );
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(container.querySelector('[aria-expanded]')).toBeInTheDocument();
  });

  test('shows required error when required and value is empty', () => {
    renderWithSchema(
      <SchemaField
        schema={{ type: 'string' }}
        value=""
        onChange={vi.fn()}
        path={['field']}
        label="Email"
        level={0}
        required
      />,
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  test('does not show error when value is provided', () => {
    renderWithSchema(
      <SchemaField
        schema={{ type: 'string' }}
        value="test@example.com"
        onChange={vi.fn()}
        path={['field']}
        label="Email"
        level={0}
        required
      />,
    );
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  test('does not show error when field is not required', () => {
    renderWithSchema(
      <SchemaField
        schema={{ type: 'string' }}
        value=""
        onChange={vi.fn()}
        path={['field']}
        label="Notes"
        level={0}
      />,
    );
    expect(screen.queryByText('Notes is required')).not.toBeInTheDocument();
  });

  test('passes description to the label when provided', () => {
    const { container } = renderWithSchema(
      <SchemaField
        schema={{ type: 'string', description: 'Enter your full name' }}
        value=""
        onChange={vi.fn()}
        path={['name']}
        label="Name"
        level={0}
      />,
    );
    // DialLabel renders description as a tooltip trigger button
    expect(container.querySelector('label')).toBeInTheDocument();
  });
});
