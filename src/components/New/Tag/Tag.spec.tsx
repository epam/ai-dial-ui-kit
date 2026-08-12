import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { ElementSize } from '@/types/size';
import { Tag } from './Tag';

describe('Dial UI Kit :: Tag', () => {
  test('renders its label', () => {
    render(<Tag label="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('is not interactive without onClick or onRemove', () => {
    render(<Tag label="TypeScript" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('names the remove button after the tag it removes', () => {
    render(<Tag label="TypeScript" closable onRemove={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Remove TypeScript' }),
    ).toBeInTheDocument();
  });

  test('uses removeLabel as the remove button name when given', () => {
    render(
      <Tag
        label="TypeScript"
        closable
        removeLabel="Drop this skill"
        onRemove={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Drop this skill' }),
    ).toBeInTheDocument();
  });

  test('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag label="TypeScript" closable onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: 'Remove TypeScript' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('does not render the remove button without onRemove', () => {
    render(<Tag label="TypeScript" closable />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('hides the remove button when disabled', () => {
    render(<Tag label="TypeScript" closable disabled onRemove={vi.fn()} />);
    expect(
      screen.queryByRole('button', { name: 'Remove TypeScript' }),
    ).not.toBeInTheDocument();
  });

  test('exposes a clickable tag as a button named after its label', () => {
    render(<Tag label="Drafts" onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Drafts' })).toBeInTheDocument();
  });

  test('activates a clickable tag with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Tag label="Drafts" onClick={onClick} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Drafts' })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  test('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Tag label="Drafts" disabled onClick={onClick} />);

    await user.click(screen.getByText('Drafts'));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('removing a closable clickable tag does not also activate it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <Tag label="Drafts" closable onClick={onClick} onRemove={onRemove} />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove Drafts' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('carries the full label as a title so truncated text stays reachable', () => {
    const label = 'A tag label far too long for the space it was given';
    render(<Tag label={label} />);
    expect(screen.getByText(label)).toHaveAttribute('title', label);
  });

  test('grows the remove button to the minimum pointer target, not the enhanced one', () => {
    // jsdom performs no layout, so this can only assert which utility is
    // applied — the 44px enhanced target would overhang a 16px control by 14px
    // per side and swallow the neighbouring tags.
    render(<Tag label="TypeScript" closable onRemove={vi.fn()} />);

    const remove = screen.getByRole('button', { name: 'Remove TypeScript' });

    expect(remove).toHaveClass('dial-kit-minimum-target');
    expect(remove).not.toHaveClass('dial-kit-enhanced-target');
  });

  test('renders the small variant at 20px', () => {
    render(<Tag label="TypeScript" size={ElementSize.Small} />);
    expect(screen.getByText('TypeScript').parentElement).toHaveClass(
      'h-[20px]',
    );
  });
});
