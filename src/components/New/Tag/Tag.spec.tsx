import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { TagAppearance } from '@/types/tag';
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

  test('renders at the single 32px height', () => {
    render(<Tag label="TypeScript" />);
    expect(screen.getByText('TypeScript').parentElement).toHaveClass(
      'h-[32px]',
      'rounded-full',
    );
  });

  describe('selectable appearance', () => {
    test('announces the selection through aria-pressed', () => {
      const { rerender } = render(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          onClick={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Drafts' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );

      rerender(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          selected
          onClick={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Drafts' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('is not a toggle when it cannot be activated', () => {
      render(
        <Tag label="Drafts" appearance={TagAppearance.Selectable} selected />,
      );

      expect(screen.getByText('Drafts').parentElement).not.toHaveAttribute(
        'aria-pressed',
      );
    });

    test('leaves the outlined tag announcing no pressed state', () => {
      render(<Tag label="Drafts" selected onClick={vi.fn()} />);

      expect(
        screen.getByRole('button', { name: 'Drafts' }),
      ).not.toHaveAttribute('aria-pressed');
    });

    test('drops the fill until it is selected', () => {
      const { rerender } = render(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          onClick={vi.fn()}
        />,
      );

      const tag = screen.getByRole('button', { name: 'Drafts' });
      // No tag draws a rim, and the selectable one carries no fill either.
      expect(tag).not.toHaveClass('border');
      expect(tag).not.toHaveClass('bg-layer-raised');
      expect(tag).not.toHaveClass('bg-control-accent-alpha');

      rerender(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          selected
          onClick={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Drafts' })).toHaveClass(
        'bg-control-accent-alpha',
      );
    });

    test('sets the label in semibold only once it is selected', () => {
      const { rerender } = render(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          onClick={vi.fn()}
        />,
      );

      const unselected = screen.getByRole('button', { name: 'Drafts' });
      expect(unselected).toHaveClass('dial-tiny-text');
      expect(unselected).not.toHaveClass('dial-tiny-semi-text');

      rerender(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          selected
          onClick={vi.fn()}
        />,
      );

      const selected = screen.getByRole('button', { name: 'Drafts' });
      // Exactly one weight class: both would leave stylesheet order deciding.
      expect(selected).toHaveClass('dial-tiny-semi-text');
      expect(selected).not.toHaveClass('dial-tiny-text');
    });

    test('leaves the outlined tag at the regular weight when selected', () => {
      render(<Tag label="Drafts" selected onClick={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Drafts' })).toHaveClass(
        'dial-tiny-text',
      );
    });

    test('carries hover by the tint alone, not by the text colour', () => {
      render(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          onClick={vi.fn()}
        />,
      );

      // jsdom applies no hover state, so assert the utility is absent: an
      // unselected chip must not darken to `text-primary` under the cursor.
      expect(screen.getByRole('button', { name: 'Drafts' })).not.toHaveClass(
        'hover:text-primary',
      );
    });

    test('toggles on click and on Enter', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          onClick={onClick}
        />,
      );

      const tag = screen.getByRole('button', { name: 'Drafts' });
      await user.click(tag);
      tag.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledTimes(2);
    });

    test('needs no pointer-target pseudo-element of its own', () => {
      // jsdom performs no layout, so this asserts the utility is absent: the
      // 32px tag clears the WCAG 2.5.8 minimum on its rendered size alone, and
      // a target laid over it would swallow the remove button's clicks.
      render(
        <Tag
          label="Drafts"
          appearance={TagAppearance.Selectable}
          onClick={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Drafts' })).not.toHaveClass(
        'dial-kit-minimum-target',
      );
    });
  });
});
