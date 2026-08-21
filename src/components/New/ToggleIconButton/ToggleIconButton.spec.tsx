import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { ElementSize } from '@/types/size';
import { ToggleIconButton } from './ToggleIconButton';

const icon = <IconBookmark data-testid="outline-icon" />;
const selectedIcon = <IconBookmarkFilled data-testid="filled-icon" />;

describe('Dial UI Kit :: ToggleIconButton', () => {
  test('names the icon-only control from aria-label', () => {
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" />);
    expect(
      screen.getByRole('button', { name: 'Bookmark' }),
    ).toBeInTheDocument();
  });

  test('falls back to the tooltip when no aria-label is given', () => {
    render(
      <ToggleIconButton icon={icon} tooltipProps={{ tooltip: 'Bookmark' }} />,
    );
    expect(
      screen.getByRole('button', { name: 'Bookmark' }),
    ).toBeInTheDocument();
  });

  test('prefers aria-label over the tooltip', () => {
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Add bookmark"
        tooltipProps={{ tooltip: 'Bookmark' }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Add bookmark' }),
    ).toBeInTheDocument();
  });

  test('reports the off state through aria-pressed', () => {
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" />);
    expect(screen.getByRole('button', { name: 'Bookmark' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('reports the on state through aria-pressed', () => {
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" isSelected />);
    expect(screen.getByRole('button', { name: 'Bookmark' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('shows the unselected icon while off', () => {
    render(
      <ToggleIconButton
        icon={icon}
        selectedIcon={selectedIcon}
        aria-label="Bookmark"
      />,
    );

    expect(screen.getByTestId('outline-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('filled-icon')).not.toBeInTheDocument();
  });

  test('swaps in the selected icon while on', () => {
    render(
      <ToggleIconButton
        icon={icon}
        selectedIcon={selectedIcon}
        aria-label="Bookmark"
        isSelected
      />,
    );

    expect(screen.getByTestId('filled-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('outline-icon')).not.toBeInTheDocument();
  });

  test('keeps the single icon when no selectedIcon is provided', () => {
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" isSelected />);
    expect(screen.getByTestId('outline-icon')).toBeInTheDocument();
  });

  test('calls onToggle with the next value when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        isSelected={false}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Bookmark' }));

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  test('calls onToggle with false when a selected toggle is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        isSelected
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Bookmark' }));

    expect(onToggle).toHaveBeenCalledWith(false);
  });

  test('still forwards a caller onClick alongside onToggle', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onToggle = vi.fn();
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        onClick={onClick}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Bookmark' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('does not fire onToggle when disabled', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        disabled
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Bookmark' }));

    expect(onToggle).not.toHaveBeenCalled();
  });

  test('is disabled when disabled prop is true', () => {
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" disabled />);
    expect(screen.getByRole('button', { name: 'Bookmark' })).toBeDisabled();
  });

  test('renders as the primary ghost icon button in a rounded square', () => {
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" />);

    const button = screen.getByRole('button', { name: 'Bookmark' });

    expect(button).toHaveClass('dial-kit-primary-ghost-button');
    expect(button).toHaveClass('dial-kit-base-icon-button');
    // The pill radius of every other 2.0 button is overridden for the toggle.
    expect(button).toHaveClass('!rounded');
  });

  test('carries the accent icon colour only while selected', () => {
    const { rerender } = render(
      <ToggleIconButton icon={icon} aria-label="Bookmark" />,
    );

    expect(screen.getByRole('button', { name: 'Bookmark' })).not.toHaveClass(
      '!text-accent',
    );

    rerender(<ToggleIconButton icon={icon} aria-label="Bookmark" isSelected />);

    expect(screen.getByRole('button', { name: 'Bookmark' })).toHaveClass(
      '!text-accent',
    );
  });

  test('defaults to the small size, which takes no enhanced target', () => {
    // 24px cannot carry the 44px enhanced target without overlapping its
    // neighbours in a dense toolbar — see the accessibility rules in AGENTS.md.
    render(<ToggleIconButton icon={icon} aria-label="Bookmark" />);

    const button = screen.getByRole('button', { name: 'Bookmark' });

    expect(button).toHaveClass('size-[24px]');
    expect(button).not.toHaveClass('dial-kit-enhanced-target');
  });

  test('takes the enhanced target at the standard size', () => {
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        size={ElementSize.Standard}
      />,
    );

    const button = screen.getByRole('button', { name: 'Bookmark' });

    expect(button).toHaveClass('size-[40px]');
    expect(button).toHaveClass('dial-kit-enhanced-target');
  });

  test('renders the icon at 16px regardless of the size tier', () => {
    // jsdom does no layout, so only the class the size comes from is assertable.
    const { rerender } = render(
      <ToggleIconButton icon={icon} aria-label="Bookmark" />,
    );

    expect(screen.getByRole('button', { name: 'Bookmark' })).toHaveClass(
      '[&_svg]:size-4',
    );

    rerender(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        size={ElementSize.Large}
      />,
    );

    expect(screen.getByRole('button', { name: 'Bookmark' })).toHaveClass(
      '[&_svg]:size-4',
    );
  });

  test('keeps its own styling when wrapped in a tooltip', () => {
    // The tooltip trigger clones the button, and used to replace its className
    // with undefined — leaving a round 24px pill with a 24px glyph.
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        tooltipProps={{ tooltip: 'Bookmark' }}
      />,
    );

    const button = screen.getByRole('button', { name: 'Bookmark' });

    expect(button).toHaveClass('!rounded');
    expect(button).toHaveClass('[&_svg]:size-4');
  });

  test('shows the tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        tooltipProps={{ tooltip: 'Bookmark this' }}
      />,
    );

    await user.hover(screen.getByRole('button', { name: 'Bookmark' }));

    expect(await screen.findByText('Bookmark this')).toBeInTheDocument();
  });

  test('describes the button itself with the tooltip rather than a wrapper', async () => {
    const user = userEvent.setup();
    render(
      <ToggleIconButton
        icon={icon}
        aria-label="Bookmark"
        tooltipProps={{ tooltip: 'Bookmark this' }}
      />,
    );

    const button = screen.getByRole('button', { name: 'Bookmark' });
    await user.hover(button);

    expect(await screen.findByText('Bookmark this')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-describedby');
  });
});
