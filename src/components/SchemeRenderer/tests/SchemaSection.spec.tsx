import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SchemaSection } from '@/components/SchemeRenderer/components/SchemaSection';

describe('Dial UI Kit :: SchemaSection', () => {
  test('renders title', () => {
    render(
      <SchemaSection title="Settings">
        <p>content</p>
      </SchemaSection>,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('renders children when expanded by default', () => {
    render(
      <SchemaSection title="S">
        <p>child content</p>
      </SchemaSection>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  test('hides children when defaultExpanded is false', () => {
    render(
      <SchemaSection title="S" defaultExpanded={false}>
        <p>hidden</p>
      </SchemaSection>,
    );
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });

  test('toggles content visibility on header click', () => {
    const { container } = render(
      <SchemaSection title="S">
        <p>togglable</p>
      </SchemaSection>,
    );
    expect(screen.getByText('togglable')).toBeInTheDocument();

    const header = container.querySelector('[aria-expanded]')!;
    fireEvent.click(header);
    expect(screen.queryByText('togglable')).not.toBeInTheDocument();

    fireEvent.click(header);
    expect(screen.getByText('togglable')).toBeInTheDocument();
  });

  test('shows summary text in header', () => {
    render(
      <SchemaSection title="S" summary="3/4 fields">
        <p>c</p>
      </SchemaSection>,
    );
    expect(screen.getByText('3/4 fields')).toBeInTheDocument();
  });

  test('shows error count badge when errorCount > 1', () => {
    render(
      <SchemaSection title="S" errorCount={2}>
        <p>c</p>
      </SchemaSection>,
    );
    expect(screen.getByText(/2 errors/)).toBeInTheDocument();
  });

  test('shows singular "error" when errorCount is 1', () => {
    render(
      <SchemaSection title="S" errorCount={1}>
        <p>c</p>
      </SchemaSection>,
    );
    expect(screen.getByText('1 error')).toBeInTheDocument();
  });

  test('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <SchemaSection title="S" onRemove={onRemove}>
        <p>c</p>
      </SchemaSection>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove item' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('does not call toggle when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <SchemaSection title="S" onRemove={onRemove}>
        <p>child</p>
      </SchemaSection>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove item' }));
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  test('does not show remove button when onRemove is not provided', () => {
    render(
      <SchemaSection title="S">
        <p>c</p>
      </SchemaSection>,
    );
    expect(
      screen.queryByRole('button', { name: 'Remove item' }),
    ).not.toBeInTheDocument();
  });
});
