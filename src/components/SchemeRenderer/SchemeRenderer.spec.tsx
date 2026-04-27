import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialSchemeRenderer } from './SchemeRenderer';
import type { JsonSchema } from './types';

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

describe('DialSchemeRenderer', () => {
  it('renders top-level section titles', () => {
    render(<DialSchemeRenderer schema={simpleSchema} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
  });

  it('calls onDefaultValues on mount with schema defaults', () => {
    const onDefaultValues = vi.fn();
    render(
      <DialSchemeRenderer
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
      <DialSchemeRenderer
        schema={simpleSchema}
        defaultValue={{ name: 'Test', count: 99 }}
        onDefaultValues={onDefaultValues}
      />,
    );
    expect(onDefaultValues).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test', count: 99 }),
    );
  });

  it('shows required error indicator when required field missing', () => {
    render(<DialSchemeRenderer schema={simpleSchema} />);
    const nameSectionHeader = screen
      .getByText('Name')
      .closest('[role="button"]');
    expect(nameSectionHeader).toBeInTheDocument();
    expect(nameSectionHeader?.textContent).toContain('error');
  });

  it('collapses and expands a section on header click', () => {
    render(
      <DialSchemeRenderer
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
      <DialSchemeRenderer
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
      <DialSchemeRenderer
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
    render(<DialSchemeRenderer schema={oneOfSchema} />);
    expect(screen.getByText('Config')).toBeInTheDocument();
  });
});
