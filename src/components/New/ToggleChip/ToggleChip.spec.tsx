import { IconWorld } from '@tabler/icons-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { ToggleChip } from './ToggleChip';

const ControlledChip = ({ initial = false }: { initial?: boolean }) => {
  const [isSelected, setIsSelected] = useState(initial);

  return (
    <ToggleChip
      label="Web search"
      isSelected={isSelected}
      onToggle={setIsSelected}
    />
  );
};

describe('Dial UI Kit :: ToggleChip', () => {
  test('renders a named native button', () => {
    render(<ToggleChip label="Web search" />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    expect(chip.tagName).toBe('BUTTON');
    expect(chip).toHaveAttribute('type', 'button');
  });

  test('reports the off state through aria-pressed by default', () => {
    render(<ToggleChip label="Web search" />);

    expect(screen.getByRole('button', { name: 'Web search' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('reports the on state through aria-pressed', () => {
    render(<ToggleChip label="Web search" isSelected />);

    expect(
      screen.getByRole('button', { name: 'Web search', pressed: true }),
    ).toBeInTheDocument();
  });

  test('calls onToggle with the next value', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <ToggleChip label="Web search" onToggle={onToggle} />,
    );

    await user.click(screen.getByRole('button', { name: 'Web search' }));
    expect(onToggle).toHaveBeenLastCalledWith(true);

    rerender(<ToggleChip label="Web search" isSelected onToggle={onToggle} />);

    await user.click(screen.getByRole('button', { name: 'Web search' }));
    expect(onToggle).toHaveBeenLastCalledWith(false);
  });

  test('toggles aria-pressed when controlled', async () => {
    const user = userEvent.setup();
    render(<ControlledChip />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');

    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  test.each([
    ['Space', ' '],
    ['Enter', '{Enter}'],
  ])('toggles with %s', async (_name, key) => {
    const user = userEvent.setup();
    render(<ControlledChip />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    await user.tab();
    expect(chip).toHaveFocus();

    await user.keyboard(key);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  test('calls onClick before onToggle', async () => {
    const calls: string[] = [];
    const user = userEvent.setup();
    render(
      <ToggleChip
        label="Web search"
        onClick={() => calls.push('click')}
        onToggle={() => calls.push('toggle')}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Web search' }));

    expect(calls).toEqual(['click', 'toggle']);
  });

  test('skips onToggle when onClick prevents the default', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <ToggleChip
        label="Web search"
        onClick={(event) => event.preventDefault()}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Web search' }));

    expect(onToggle).not.toHaveBeenCalled();
  });

  test('does not respond when disabled', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<ToggleChip label="Web search" disabled onToggle={onToggle} />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    expect(chip).toBeDisabled();

    await user.click(chip);
    await user.tab();

    expect(chip).not.toHaveFocus();
    expect(onToggle).not.toHaveBeenCalled();
  });

  test('keeps reporting its state while disabled', () => {
    render(<ToggleChip label="Web search" isSelected disabled />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveClass('text-control-disable-primary');
    expect(chip).toHaveClass('bg-control-disable-primary');
  });

  test('draws the selected fill and semibold label when on', () => {
    render(<ToggleChip label="Web search" isSelected />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    expect(chip).toHaveClass('bg-control-accent-alpha');
    expect(chip).toHaveClass('dial-tiny-semi-text');
  });

  test('draws no fill and a regular label when off', () => {
    render(<ToggleChip label="Web search" />);

    const chip = screen.getByRole('button', { name: 'Web search' });

    expect(chip).not.toHaveClass('bg-control-accent-alpha');
    expect(chip).toHaveClass('dial-tiny-text');
    expect(chip).toHaveClass('text-secondary');
  });

  test('renders the icon before the label, hidden from assistive tech', () => {
    render(
      <ToggleChip label="Web search" icon={<IconWorld data-testid="icon" />} />,
    );

    const chip = screen.getByRole('button', { name: 'Web search' });
    const iconWrapper = screen.getByTestId('icon').parentElement;

    expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    expect(chip.firstElementChild).toBe(iconWrapper);
  });

  test('accepts a node label with trailing state text kept out of the name', () => {
    render(
      <ToggleChip
        label={
          <>
            Web search<span aria-hidden="true">: ON</span>
          </>
        }
        isSelected
      />,
    );

    expect(screen.getByText(': ON')).toBeInTheDocument();
    expect(screen.getByRole('button', { pressed: true })).toHaveAccessibleName(
      'Web search',
    );
  });

  test('titles itself from a string label', () => {
    render(<ToggleChip label="Web search" />);

    expect(screen.getByRole('button')).toHaveAttribute('title', 'Web search');
  });

  test('sets no title for a node label unless given one', () => {
    render(<ToggleChip label={<strong>Web search</strong>} />);

    expect(screen.getByRole('button')).not.toHaveAttribute('title');
  });

  test('applies a custom className', () => {
    render(<ToggleChip label="Web search" className="custom-class" />);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
