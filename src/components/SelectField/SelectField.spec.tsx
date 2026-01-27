import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialSelectField } from './SelectField';

describe('Dial UI Kit :: DialSelectField', () => {
  test('renders label through FormItem and associates aria-labelledby', () => {
    render(
      <DialSelectField
        elementId="transport"
        fieldLabel="Transport"
        options={[
          { value: 'SSE', label: 'Server-Sent Events (SSE)' },
          { value: 'WS', label: 'WebSocket' },
        ]}
      />,
    );

    const group = screen.getByRole('group');
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-labelledby', 'transport-label');
  });

  test('applies containerClassName to FormItem wrapper', () => {
    render(
      <DialSelectField
        elementId="styled"
        fieldLabel="Styled"
        containerClassName="ring-1"
        options={[{ value: 'x', label: 'X' }]}
      />,
    );
    expect(screen.getByRole('group')).toHaveClass('ring-1');
  });

  test('shows error text via FormItem when error provided', () => {
    render(
      <DialSelectField
        elementId="err"
        fieldLabel="With error"
        error="Selection required"
        options={[{ value: 'x', label: 'X' }]}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Selection required');
  });

  test('renders captionDescription when provided', () => {
    render(
      <DialSelectField
        elementId="cap"
        fieldLabel="With caption"
        captionDescription="Helper caption"
        options={[{ value: 'x', label: 'X' }]}
      />,
    );
    expect(screen.getByText('Helper caption')).toBeInTheDocument();
  });

  test('renders readonly state with selected option label', () => {
    render(
      <DialSelectField
        elementId="ro"
        fieldLabel="Readonly"
        readonly
        value="WS"
        options={[
          { value: 'SSE', label: 'Server-Sent Events (SSE)' },
          { value: 'WS', label: 'WebSocket' },
        ]}
      />,
    );
    expect(screen.getByText('WebSocket')).toBeInTheDocument();
  });
});
