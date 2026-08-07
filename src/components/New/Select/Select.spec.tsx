import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { ElementSize } from '@/types/size';
import { Select, type SelectProps } from './Select';

const baseOptions = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
  { value: 'opt-4', label: 'Option 4' },
  { value: 'opt-5', label: 'Option 5' },
  { value: 'opt-6', label: 'Option 6' },
  { value: 'opt-7', label: 'Option 7' },
  { value: 'opt-8', label: 'Option 8' },
  { value: 'disabled', label: 'Disabled option', disabled: true },
];

const renderSelect = (props: Partial<SelectProps> = {}) => {
  const defaultProps: SelectProps = {
    options: baseOptions,
    placeholder: 'Select...',
    ariaLabel: 'Operator',
  };
  return render(<Select {...defaultProps} {...props} />);
};

const getField = () => screen.getByRole('combobox', { name: /operator/i });

const openSelect = () => {
  fireEvent.click(getField());
};

describe('Dial UI Kit :: Select', () => {
  test('renders placeholder and toggles aria-expanded on open/close', () => {
    renderSelect();

    const field = getField();
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveAttribute('placeholder', 'Select...');
    expect(field).toHaveAttribute('readonly');

    openSelect();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(field).toHaveAttribute('aria-expanded', 'true');
    expect(field).toHaveAttribute(
      'aria-controls',
      screen.getByRole('listbox').id,
    );

    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(field).toHaveAttribute('aria-expanded', 'false');

    // ensure the field shows the selected value
    expect(field).toHaveValue('Option 1');
  });

  test('renders the field through the 2.0 Input', () => {
    renderSelect({ size: ElementSize.Small, invalid: true });

    const wrapper = screen.getByLabelText('input-container');
    expect(wrapper).toHaveClass('dial-kit-input', 'dial-kit-input-small');
    expect(wrapper).toHaveClass('dial-kit-input-error');
    expect(getField()).toHaveAttribute('aria-haspopup', 'listbox');
  });

  test('opens on ArrowDown and Enter', () => {
    renderSelect();
    const field = getField();

    fireEvent.keyDown(field, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(field, { key: 'Enter' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.keyDown(field, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
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
    expect(getField()).toHaveValue('Option 1');
  });

  test('prefixes the selected value when prefix is given', () => {
    renderSelect({ defaultValue: 'opt-1', prefix: 'Filter:' });
    expect(getField()).toHaveValue('Filter: Option 1');
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

  describe('label, caption and error', () => {
    test('labels the field through the Label component', () => {
      renderSelect({
        id: 'operator',
        ariaLabel: undefined,
        labelProps: { label: 'Operator' },
      });

      expect(
        screen.getByRole('combobox', { name: 'Operator' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Operator').closest('label')).toHaveAttribute(
        'for',
        'operator',
      );
    });

    test('shows the caption, and replaces it with the error', () => {
      const { rerender } = renderSelect({ caption: 'Helper text' });
      expect(screen.getByText('Helper text')).toBeInTheDocument();

      rerender(
        <Select
          options={baseOptions}
          ariaLabel="Operator"
          caption="Helper text"
          error="Required"
        />,
      );
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('multiple mode', () => {
    test('selectAll toggles all filtered and shows indeterminate when partially selected', () => {
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

    test('a11y: listbox has aria-multiselectable', () => {
      renderSelect({ multiple: true });
      openSelect();
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'aria-multiselectable',
        'true',
      );
    });

    test('renders the selection as tags and folds it into the accessible name', () => {
      renderSelect({ multiple: true, defaultValue: ['opt-1', 'opt-2'] });

      // The tags live in the field's content slot, so the input itself is empty
      // and the selection has to be announced through the name.
      expect(
        screen.getByRole('combobox', { name: 'Operator, Option 1, Option 2' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('removing a tag deselects it without opening the overlay', () => {
      const onChange = vi.fn();
      renderSelect({
        multiple: true,
        defaultValue: ['opt-1', 'opt-2'],
        onChange,
      });

      fireEvent.click(screen.getAllByRole('button')[0]);

      expect(onChange).toHaveBeenCalledWith(['opt-2']);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('searchable', () => {
    test('filters options by label', () => {
      renderSelect({ searchable: true });

      openSelect();
      const search = screen.getByRole('textbox', { name: 'Search options' });
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

    test('searchSize Small applies the compact Input sizing', () => {
      renderSelect({ searchable: true, searchSize: ElementSize.Small });

      openSelect();
      const search = screen.getByRole('textbox', { name: 'Search options' });

      expect(search.closest('.dial-kit-input-small')).toBeInTheDocument();
    });

    test('reports the query, and resets it when the overlay closes', () => {
      const onSearchQueryChange = vi.fn();
      renderSelect({ searchable: true, onSearchQueryChange });

      openSelect();
      fireEvent.change(
        screen.getByRole('textbox', { name: 'Search options' }),
        { target: { value: 'Option 2' } },
      );
      expect(onSearchQueryChange).toHaveBeenLastCalledWith('Option 2');

      openSelect();
      expect(onSearchQueryChange).toHaveBeenLastCalledWith('');
    });

    test('keeps the search row when the option list shrinks below the threshold', () => {
      const { rerender } = renderSelect({ searchable: true, open: true });

      fireEvent.change(
        screen.getByRole('textbox', { name: 'Search options' }),
        { target: { value: 'Option 2' } },
      );

      // A consumer fetching options for the query swaps in a short list — the
      // search row must survive it instead of vanishing under the cursor.
      rerender(
        <Select
          options={[{ value: 'opt-2', label: 'Option 2' }]}
          ariaLabel="Operator"
          searchable
          open
        />,
      );

      expect(
        screen.getByRole('textbox', { name: 'Search options' }),
      ).toBeInTheDocument();
    });

    test('empty state is shown when nothing matches', () => {
      renderSelect({ searchable: true, emptyStateTitle: 'Nothing here' });

      openSelect();
      fireEvent.change(
        screen.getByRole('textbox', { name: 'Search options' }),
        {
          target: { value: 'zzz' },
        },
      );

      expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });
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

  describe('rich single value', () => {
    test('a labelNode is rendered in the content slot and named on the field', () => {
      renderSelect({
        options: [
          {
            value: 'dotted',
            label: 'someValue.withOption',
            labelNode: <span>someValue.withOption</span>,
          },
        ],
        defaultValue: 'dotted',
      });

      // The input cannot hold the node, so it stays empty and the value is
      // announced through the accessible name instead.
      const field = screen.getByRole('combobox', {
        name: 'Operator, someValue.withOption',
      });
      expect(field).toHaveValue('');
      expect(screen.getByText('someValue.withOption')).toBeInTheDocument();
    });

    test('an option description is rendered next to the value', () => {
      renderSelect({
        options: [
          { value: 'opt-1', label: 'Option 1', description: 'The first one' },
        ],
        defaultValue: 'opt-1',
      });

      expect(screen.getByText('The first one')).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: 'Operator, Option 1' }),
      ).toBeInTheDocument();
    });
  });

  describe('sub-menu options', () => {
    test('option with children renders as submenu trigger (aria-haspopup, not selectable directly)', () => {
      renderSelect({
        options: [
          { value: 'a', label: 'Alpha' },
          {
            value: 'grp',
            label: 'Group',
            children: [
              { value: 'g1', label: 'G One' },
              { value: 'g2', label: 'G Two' },
            ],
          },
        ],
      });
      openSelect();
      const trigger = screen.getByText('Group').closest('button')!;
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger.tagName).toBe('BUTTON');
    });

    test('submenu opens on hover and child click selects value + closes dropdown', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderSelect({
        onChange,
        options: [
          {
            value: 'grp',
            label: 'Group',
            children: [
              { value: 'g1', label: 'G One' },
              { value: 'g2', label: 'G Two' },
            ],
          },
        ],
      });
      openSelect();
      await user.hover(screen.getByText('Group').closest('button')!);
      const child = await screen.findByText('G One');
      fireEvent.click(child.closest('button')!);
      expect(onChange).toHaveBeenCalledWith('g1');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('selected child value is shown in the field', async () => {
      const user = userEvent.setup();
      renderSelect({
        options: [
          {
            value: 'grp',
            label: 'Group',
            children: [{ value: 'g1', label: 'G One' }],
          },
        ],
      });
      openSelect();
      await user.hover(screen.getByText('Group').closest('button')!);
      fireEvent.click((await screen.findByText('G One')).closest('button')!);
      expect(getField()).toHaveValue('G One');
    });

    test('parent trigger shows selected state when a child is selected', async () => {
      const user = userEvent.setup();
      renderSelect({
        options: [
          {
            value: 'grp',
            label: 'Group',
            children: [{ value: 'g1', label: 'G One' }],
          },
        ],
      });
      openSelect();
      await user.hover(screen.getByText('Group').closest('button')!);
      fireEvent.click((await screen.findByText('G One')).closest('button')!);
      openSelect();
      const parentTrigger = screen.getByText('Group').closest('button')!;
      expect(parentTrigger).toHaveAttribute('aria-selected', 'true');
    });

    test('disabled submenu trigger does not open submenu on hover', async () => {
      const user = userEvent.setup();
      renderSelect({
        options: [
          {
            value: 'grp',
            label: 'Group',
            disabled: true,
            children: [{ value: 'g1', label: 'G One' }],
          },
        ],
      });
      openSelect();
      const trigger = screen.getByText('Group').closest('button')!;
      expect(trigger).toBeDisabled();
      await user.hover(trigger);
      expect(screen.queryByText('G One')).not.toBeInTheDocument();
    });

    test('disabled child in submenu is not selectable', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderSelect({
        onChange,
        options: [
          {
            value: 'grp',
            label: 'Group',
            children: [{ value: 'g1', label: 'G One', disabled: true }],
          },
        ],
      });
      openSelect();
      await user.hover(screen.getByText('Group').closest('button')!);
      const childEl = await screen.findByText('G One');
      const childBtn = childEl.closest('button')!;
      expect(childBtn).toBeDisabled();
      fireEvent.click(childBtn);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  test('disabled select does not open', () => {
    renderSelect({ disabled: true });

    openSelect();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getField()).toBeDisabled();
  });
});
