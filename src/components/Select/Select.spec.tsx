import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DialSelect, type DialSelectProps } from './Select';
import { ElementSize } from '@/types/size';

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
    renderSelect();

    const trigger = screen.getByRole('button', { name: /select/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    openSelect();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // ensure trigger text updated
    expect(trigger).toHaveTextContent('Option 1');
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

  test('searchable with searchSize Small applies compact search input sizing', () => {
    renderSelect({ searchable: true, searchSize: ElementSize.Small });

    openSelect();
    const search = screen.getByRole('textbox');

    expect(search.closest('.h-\\[24px\\]')).toBeInTheDocument();
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

  test('inlineSearch: mouseDown does not toggle, click opens and focuses input', async () => {
    renderSelect({ inlineSearch: true });

    const trigger =
      screen
        .getAllByRole('button')
        .find((b) => b.getAttribute('aria-haspopup') === 'listbox') ??
      screen.getByRole('button');

    fireEvent.mouseDown(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const inlineInput = screen.getByPlaceholderText('Select...');
    await vi.waitFor(() => expect(inlineInput).toHaveFocus());
  });

  test('inlineSearch: typing in inline input filters options', () => {
    renderSelect({ inlineSearch: true });

    const trigger =
      screen
        .getAllByRole('button')
        .find((b) => b.getAttribute('aria-haspopup') === 'listbox') ??
      screen.getByRole('button');

    fireEvent.click(trigger);
    const inlineInput = screen.getByPlaceholderText('Select...');
    fireEvent.change(inlineInput, { target: { value: 'Option 2' } });

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

  test('inlineSearch: a cleared input is not resurrected on close when customSelectedValue is stale', () => {
    const onInlineQueryChange = vi.fn();
    // open is controlled so we can drive the close transition deterministically.
    // customSelectedValue stays stale, mimicking a consumer that commits the
    // cleared value asynchronously.
    const { rerender } = renderSelect({
      inlineSearch: true,
      open: true,
      customSelectedValue: 'Option 2',
      value: 'opt-2',
      onInlineQueryChange,
    });

    const inlineInput = screen.getByDisplayValue(
      'Option 2',
    ) as HTMLInputElement;
    fireEvent.change(inlineInput, { target: { value: '' } });
    expect(inlineInput).toHaveValue('');
    expect(onInlineQueryChange).toHaveBeenLastCalledWith('');

    // Close the dropdown while customSelectedValue is still the stale old value.
    rerender(
      <DialSelect
        options={baseOptions}
        inlineSearch
        open={false}
        customSelectedValue="Option 2"
        value="opt-2"
        onInlineQueryChange={onInlineQueryChange}
      />,
    );

    // The cleared input must stick — it must not snap back to the stale value.
    expect(inlineInput).toHaveValue('');
  });

  test('inlineSearch: external customSelectedValue change still syncs the closed input', () => {
    const { rerender } = renderSelect({
      inlineSearch: true,
      customSelectedValue: 'Option 2',
      value: 'opt-2',
    });

    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();

    rerender(
      <DialSelect
        options={baseOptions}
        inlineSearch
        customSelectedValue="Option 4"
        value="opt-4"
      />,
    );

    expect(screen.getByDisplayValue('Option 4')).toBeInTheDocument();
  });

  test('inlineSearch: a value changed while open is applied to the input on close (not swallowed)', () => {
    const { rerender } = renderSelect({
      inlineSearch: true,
      open: true,
      customSelectedValue: 'Option 2',
      value: 'opt-2',
    });
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();

    // Value changes externally while the dropdown is open — must not clobber editing.
    rerender(
      <DialSelect
        options={baseOptions}
        inlineSearch
        open
        customSelectedValue="Option 4"
        value="opt-4"
      />,
    );
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();

    // On close the change made while open must now be applied.
    rerender(
      <DialSelect
        options={baseOptions}
        inlineSearch
        open={false}
        customSelectedValue="Option 4"
        value="opt-4"
      />,
    );
    expect(screen.getByDisplayValue('Option 4')).toBeInTheDocument();
  });

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

  test('selected child value is shown as selected in trigger', async () => {
    const user = userEvent.setup();
    const { container } = renderSelect({
      options: [
        {
          value: 'grp',
          label: 'Group',
          children: [{ value: 'g1', label: 'G One' }],
        },
      ],
    });
    const trigger = container.querySelector(
      '[aria-haspopup="listbox"]',
    ) as HTMLElement;
    fireEvent.click(trigger);
    await user.hover(screen.getByText('Group').closest('button')!);
    fireEvent.click((await screen.findByText('G One')).closest('button')!);
    expect(trigger).toHaveTextContent('G One');
  });

  test('parent trigger shows selected state when a child is selected', async () => {
    const user = userEvent.setup();
    const { container } = renderSelect({
      options: [
        {
          value: 'grp',
          label: 'Group',
          children: [{ value: 'g1', label: 'G One' }],
        },
      ],
    });
    const trigger = container.querySelector(
      '[aria-haspopup="listbox"]',
    ) as HTMLElement;
    fireEvent.click(trigger);
    await user.hover(screen.getByText('Group').closest('button')!);
    fireEvent.click((await screen.findByText('G One')).closest('button')!);
    fireEvent.click(trigger);
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
