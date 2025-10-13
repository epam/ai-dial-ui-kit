import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialSelect, type DialSelectProps } from './Select';

const baseOptions = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'disabled', label: 'Disabled option', disabled: true },
];

const renderSelect = (props: Partial<DialSelectProps> = {}) => {
  const defaultProps: DialSelectProps = {
    options: baseOptions,
    placeholder: 'Select...',
  };
  return render(<DialSelect {...defaultProps} {...props} />);
};

const openSelect = () => {
  fireEvent.click(screen.getByRole('button', { name: /select/i }));
};

describe('Dial UI Kit :: DialSelect', () => {
  test('renders placeholder and toggles aria-expanded on open/close', () => {
    const { container } = renderSelect();

    const trigger = screen.getByRole('button', { name: /select/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    openSelect();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // ensure trigger text updated
    expect(container.querySelector('button')).toHaveTextContent('Option 1');
  });

  test('fires onChange in single mode and closes afterwards', () => {
    const onChange = vi.fn();
    renderSelect({ onChange });

    openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Option 2' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('opt-2');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('respects defaultValue in uncontrolled single mode', () => {
    renderSelect({ defaultValue: 'opt-1' });
    expect(screen.getByRole('button')).toHaveTextContent('Option 1');
  });

  test('disabled option is not selectable in single mode', () => {
    const onChange = vi.fn();
    renderSelect({ onChange });

    openSelect();
    const disabledOpt = screen.getByRole('option', { name: 'Disabled option' });
    expect(disabledOpt).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(disabledOpt);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('multiple + selectAll: toggles all filtered and shows indeterminate when partially selected', () => {
    renderSelect({ multiple: true, selectAll: true });

    openSelect();

    const selectAll = screen.getByRole('checkbox', { name: /select all/i });
    expect(selectAll).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(selectAll);
    expect(selectAll).toHaveAttribute('aria-checked', 'true');

    const cb1 = screen.getByRole('checkbox', { name: 'Option 1' });
    fireEvent.click(cb1);
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
  });

  test('searchable filters options by label (single mode)', () => {
    renderSelect({ searchable: true });

    openSelect();
    const search = screen.getByRole('textbox');
    fireEvent.change(search, { target: { value: 'Option 2' } });

    expect(
      screen.getByRole('option', { name: 'Option 2' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Option 1' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Disabled option' }),
    ).not.toBeInTheDocument();
  });

  test('closable overlay shows button and calls onClose', () => {
    const onClose = vi.fn();
    renderSelect({ closable: true, onClose });

    openSelect();
    const closeBtn = screen.getByRole('button', { name: 'Close select' });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('a11y: listbox has aria-multiselectable in multiple mode', () => {
    renderSelect({ multiple: true });
    openSelect();
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-multiselectable',
      'true',
    );
  });
});
