import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, test, expect, vi } from 'vitest';

import { FilterChips } from './FilterChips';

const ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'My chats' },
  { value: 'shared', label: 'Shared' },
];

const renderChips = (
  props: Partial<Parameters<typeof FilterChips<string>>[0]> = {},
) =>
  render(
    <FilterChips
      aria-label="Filter chats"
      items={ITEMS}
      value="all"
      onChange={vi.fn()}
      {...props}
    />,
  );

describe('Dial UI Kit :: FilterChips', () => {
  test('renders a named group of chips', () => {
    renderChips();

    expect(
      screen.getByRole('group', { name: 'Filter chats' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  test('names the group from aria-labelledby', () => {
    render(
      <>
        <h2 id="filters-heading">Chat filters</h2>
        <FilterChips
          aria-labelledby="filters-heading"
          items={ITEMS}
          value="all"
          onChange={vi.fn()}
        />
      </>,
    );

    expect(
      screen.getByRole('group', { name: 'Chat filters' }),
    ).toBeInTheDocument();
  });

  test('presses only the selected chip', () => {
    renderChips({ value: 'shared' });

    expect(screen.getByRole('button', { name: 'Shared' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'My chats' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('calls onChange with the clicked value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderChips({ onChange });

    await user.click(screen.getByRole('button', { name: 'My chats' }));

    expect(onChange).toHaveBeenCalledWith('mine');
  });

  test('calls onChange again for the already selected chip', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderChips({ value: 'mine', onChange });

    await user.click(screen.getByRole('button', { name: 'My chats' }));

    expect(onChange).toHaveBeenCalledWith('mine');
  });

  test('activates a chip from the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderChips({ onChange });

    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('mine');
  });

  test('gives every chip its own tab stop', async () => {
    const user = userEvent.setup();
    renderChips();

    await user.tab();
    expect(screen.getByRole('button', { name: 'All' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'My chats' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Shared' })).toHaveFocus();
  });

  test('leaves the filter alone when the arrow keys move over the row', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderChips({ onChange });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).not.toHaveBeenCalled();
  });

  test('moves the selection when the caller owns the value', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState('all');

      return (
        <FilterChips
          aria-label="Filter chats"
          items={ITEMS}
          value={value}
          onChange={setValue}
        />
      );
    };
    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Shared' }));

    expect(screen.getByRole('button', { name: 'Shared' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('renders an icon before the label and keeps it out of the name', () => {
    renderChips({
      items: [{ value: 'shared', label: 'Shared', icon: <svg /> }],
    });

    const chip = screen.getByRole('button', { name: 'Shared' });
    const icon = chip.querySelector('svg');

    expect(icon).toBeInTheDocument();
    /* The icon repeats the label, so it must not be read out twice. */
    expect(icon?.closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  test('hugs the labels by default and grows the chips with stretch', () => {
    const { unmount } = renderChips();

    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass(
      'flex-1',
    );
    unmount();

    renderChips({ stretch: true });

    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('flex-1');
  });

  test('does not wrap the row until the caller asks', () => {
    const { unmount } = renderChips();

    expect(screen.getByRole('group', { name: 'Filter chats' })).toHaveClass(
      'flex-nowrap',
    );
    unmount();

    renderChips({ className: 'flex-wrap' });

    expect(screen.getByRole('group', { name: 'Filter chats' })).toHaveClass(
      'flex-wrap',
    );
  });

  test('applies chipClassName to every chip', () => {
    renderChips({ chipClassName: '!px-2' });

    screen
      .getAllByRole('button')
      .forEach((chip) => expect(chip).toHaveClass('!px-2'));
  });

  test('renders an empty named group for an empty item list', () => {
    renderChips({ items: [] });

    expect(
      screen.getByRole('group', { name: 'Filter chats' }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
