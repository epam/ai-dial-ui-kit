import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, test, expect, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

const ITEMS = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'table', label: 'Table' },
];

const renderControl = (
  props: Partial<Parameters<typeof SegmentedControl<string>>[0]> = {},
) =>
  render(
    <SegmentedControl
      aria-label="View"
      items={ITEMS}
      value="list"
      onChange={vi.fn()}
      {...props}
    />,
  );

describe('Dial UI Kit :: SegmentedControl', () => {
  test('renders a named radiogroup of segments', () => {
    renderControl();

    expect(
      screen.getByRole('radiogroup', { name: 'View' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  test('marks only the selected segment as checked', () => {
    renderControl({ value: 'grid' });

    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'List' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Table' })).not.toBeChecked();
  });

  test('names an icon-only segment from its aria-label', () => {
    renderControl({
      items: [
        {
          value: 'list',
          icon: <svg aria-hidden="true" />,
          'aria-label': 'List',
        },
        {
          value: 'grid',
          icon: <svg aria-hidden="true" />,
          'aria-label': 'Grid',
        },
      ],
    });

    expect(screen.getByRole('radio', { name: 'List' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeInTheDocument();
  });

  test('prefers an explicit aria-label over the visible label', () => {
    renderControl({
      items: [{ value: 'list', label: 'List', 'aria-label': 'List view' }],
    });

    expect(
      screen.getByRole('radio', { name: 'List view' }),
    ).toBeInTheDocument();
  });

  test('calls onChange with the clicked value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ onChange });

    await user.click(screen.getByRole('radio', { name: 'Grid' }));

    expect(onChange).toHaveBeenCalledWith('grid');
  });

  test('gives the group a single tab stop on the selected segment', () => {
    renderControl({ value: 'grid' });

    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  test('moves the tab stop to the first enabled segment when the selected one is disabled', () => {
    renderControl({
      value: 'list',
      items: [
        { value: 'list', label: 'List', disabled: true },
        { value: 'grid', label: 'Grid' },
      ],
    });

    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  test('selects the next segment with ArrowRight', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ onChange });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('grid');
  });

  test('wraps to the first segment from the last with ArrowRight', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ value: 'table', onChange });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('list');
  });

  test('wraps to the last segment from the first with ArrowLeft', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ onChange });

    await user.tab();
    await user.keyboard('{ArrowLeft}');

    expect(onChange).toHaveBeenCalledWith('table');
  });

  test('jumps to the first and last segment with Home and End', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ value: 'grid', onChange });

    await user.tab();
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenCalledWith('table');

    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenCalledWith('list');
  });

  test('skips a disabled segment when navigating', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({
      onChange,
      items: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid', disabled: true },
        { value: 'table', label: 'Table' },
      ],
    });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('table');
  });

  test('moves focus along with the selection', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState('list');

      return (
        <SegmentedControl
          aria-label="View"
          items={ITEMS}
          value={value}
          onChange={setValue}
        />
      );
    };
    render(<Controlled />);

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
  });

  test('leaves other keys to the browser', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ onChange });

    await user.tab();
    await user.keyboard('{PageDown}');

    expect(onChange).not.toHaveBeenCalled();
  });

  test('disables every segment and marks the group disabled', () => {
    renderControl({ disabled: true });

    expect(screen.getByRole('radiogroup', { name: 'View' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    screen
      .getAllByRole('radio')
      .forEach((segment) => expect(segment).toBeDisabled());
  });

  test('does not navigate while the whole group is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({ disabled: true, onChange });

    await user.click(screen.getByRole('radio', { name: 'Grid' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not select a segment disabled on its own', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl({
      onChange,
      items: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid', disabled: true },
      ],
    });

    await user.click(screen.getByRole('radio', { name: 'Grid' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('keeps the hover and active tints off a disabled segment', () => {
    // A disabled <button> still matches :hover, so the tints must not be on it.
    renderControl({ disabled: true, value: 'list' });

    const selected = screen.getByRole('radio', { name: 'List' });

    expect(selected).not.toHaveClass('hover:bg-control-accent-alpha-hover');
    expect(selected).not.toHaveClass('active:bg-control-accent-alpha-active');
    expect(selected).toHaveClass('bg-control-disable-primary');
  });

  test('tints on hover and press while enabled', () => {
    renderControl({ value: 'list' });

    const selected = screen.getByRole('radio', { name: 'List' });

    expect(selected).toHaveClass('hover:bg-control-accent-alpha-hover');
    expect(selected).toHaveClass('active:bg-control-accent-alpha-active');
    expect(selected).toHaveClass('bg-layer-raised');
  });

  test('renders no segments for an empty item list', () => {
    renderControl({ items: [] });

    expect(
      screen.getByRole('radiogroup', { name: 'View' }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });
});
