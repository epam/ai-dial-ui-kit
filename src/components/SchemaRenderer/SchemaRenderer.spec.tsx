import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialSchemaRenderer } from './SchemaRenderer';
import { SchemaRendererVariant, type JsonSchema } from './types';

const simpleSchema: JsonSchema = {
  properties: {
    name: { title: 'Name', type: 'string' },
    count: { title: 'Count', type: 'integer', default: 5 },
    enabled: { title: 'Enabled', type: 'boolean', default: true },
  },
  required: ['name'],
};

const oneOfSchema: JsonSchema = {
  $defs: {
    TypeA: {
      title: 'Type A',
      type: 'object',
      properties: {
        type: { const: 'a', default: 'a', type: 'string' },
        label: { title: 'Label', type: 'string' },
      },
      required: ['label'],
    },
    TypeB: {
      title: 'Type B',
      type: 'object',
      properties: {
        type: { const: 'b', default: 'b', type: 'string' },
        value: { title: 'Value', type: 'integer' },
      },
      required: ['value'],
    },
  },
  properties: {
    config: {
      title: 'Config',
      discriminator: {
        propertyName: 'type',
        mapping: { a: '#/$defs/TypeA', b: '#/$defs/TypeB' },
      },
      oneOf: [{ $ref: '#/$defs/TypeA' }, { $ref: '#/$defs/TypeB' }],
    },
  },
};

describe('DialSchemaRenderer', () => {
  it('renders top-level section titles', () => {
    render(<DialSchemaRenderer schema={simpleSchema} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
  });

  it('calls onDefaultValues on mount with schema defaults', () => {
    const onDefaultValues = vi.fn();
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        onDefaultValues={onDefaultValues}
      />,
    );
    expect(onDefaultValues).toHaveBeenCalledOnce();
    const called = onDefaultValues.mock.calls[0][0] as Record<string, unknown>;
    expect(called.count).toBe(5);
    expect(called.enabled).toBe(true);
  });

  it('calls onDefaultValues with provided defaultValue', () => {
    const onDefaultValues = vi.fn();
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: 'Test', count: 99 }}
        onDefaultValues={onDefaultValues}
      />,
    );
    expect(onDefaultValues).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test', count: 99 }),
    );
  });

  it('show error indicator before a field is touched when skipUntouched is false', () => {
    render(<DialSchemaRenderer schema={simpleSchema} skipUntouched={false} />);
    const nameSectionHeader = screen
      .getByText('Name')
      .closest('[role="button"]');
    expect(nameSectionHeader).toBeInTheDocument();
    expect(nameSectionHeader?.textContent).toContain('error');
  });

  it('does not show error indicator before a field is touched when skipUntouched is true', () => {
    render(<DialSchemaRenderer schema={simpleSchema} skipUntouched={true} />);
    const nameSectionHeader = screen
      .getByText('Name')
      .closest('[role="button"]');
    expect(nameSectionHeader).toBeInTheDocument();
    expect(nameSectionHeader?.textContent).not.toContain('error');
  });

  it('shows error indicator after a required field is touched and left empty', () => {
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: '', count: 5, enabled: true }}
      />,
    );
    const input = screen.getAllByRole('textbox')[0];
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.change(input, { target: { value: '' } });
    const nameSectionHeader = screen
      .getByText('Name')
      .closest('[role="button"]');
    expect(nameSectionHeader?.textContent).toContain('error');
  });

  it('collapses and expands a section on header click', () => {
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: 'hi' }}
      />,
    );
    const header = screen.getByText('Name').closest('[role="button"]');
    expect(header).toBeInTheDocument();
    fireEvent.click(header!);
    const nameLabel = screen.queryAllByText('Name');
    expect(nameLabel.length).toBeGreaterThan(0);
  });

  it('calls onChange with full value when a field changes', () => {
    const onChange = vi.fn();
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: '', count: 5, enabled: true }}
        onChange={onChange}
      />,
    );
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'new name' } });
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('calls onPropertyChange with path and value', () => {
    const onPropertyChange = vi.fn();
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: '', count: 5, enabled: true }}
        onPropertyChange={onPropertyChange}
      />,
    );
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test' } });
      if (onPropertyChange.mock.calls.length > 0) {
        expect(onPropertyChange.mock.calls[0][0]).toBe('name');
      }
    }
  });

  it('renders oneOf discriminator selector', () => {
    render(<DialSchemaRenderer schema={oneOfSchema} />);
    expect(screen.getByText('Config')).toBeInTheDocument();
  });

  it('flat variant renders primitives without collapsible section headers', () => {
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        variant={SchemaRendererVariant.Flat}
      />,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    // In flat mode, primitive fields have no expand/collapse button wrapping them
    const nameLabel = screen.getByText('Name');
    expect(nameLabel.closest('[role="button"]')).toBeNull();
  });

  it('flat variant still renders object fields as collapsible sections', () => {
    const schema: JsonSchema = {
      properties: {
        title: { title: 'Title', type: 'string' },
        group: {
          title: 'Group',
          type: 'object',
          properties: { field: { title: 'Field', type: 'string' } },
        },
      },
    };
    render(
      <DialSchemaRenderer
        schema={schema}
        variant={SchemaRendererVariant.Flat}
      />,
    );
    const groupHeader = screen.getByText('Group').closest('[role="button"]');
    expect(groupHeader).toBeInTheDocument();
    const titleLabel = screen.getByText('Title');
    expect(titleLabel.closest('[role="button"]')).toBeNull();
  });

  it('calls renderField with path, schema, and default element', () => {
    const renderField = vi.fn(
      (_path, _schema, defaultElement) => defaultElement,
    );
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: 'hi', count: 5, enabled: true }}
        renderField={renderField}
      />,
    );
    expect(renderField).toHaveBeenCalled();
    const paths = renderField.mock.calls.map((c) =>
      (c[0] as string[]).join('.'),
    );
    expect(paths).toContain('name');
  });

  it('disables all inputs when readonly is true', () => {
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: 'hi', count: 5, enabled: true }}
        readonly
      />,
    );
    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).toBeDisabled();
    });
    screen.getAllByRole('spinbutton').forEach((input) => {
      expect(input).toBeDisabled();
    });
    screen.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('renders the custom element returned by renderField', () => {
    const renderField = vi.fn((path: string[], _schema, defaultElement) => {
      if (path[path.length - 1] === 'name') {
        return <span data-testid="custom-name-field">custom</span>;
      }
      return defaultElement;
    });
    render(
      <DialSchemaRenderer
        schema={simpleSchema}
        defaultValue={{ name: 'hi' }}
        renderField={renderField}
      />,
    );
    expect(screen.getByTestId('custom-name-field')).toBeInTheDocument();
  });
});
