import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { TooltipPlacement } from '@/types/tooltip';
import { InteractiveTooltip } from './InteractiveTooltip';

const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
};

const DESKTOP_WIDTH = 1024;

describe('Dial UI Kit :: InteractiveTooltip', () => {
  afterEach(() => setViewportWidth(DESKTOP_WIDTH));

  test('Should render children without a panel when hideTooltip is true', () => {
    render(
      <InteractiveTooltip content="Panel text" hideTooltip initialOpen>
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByText('Panel text')).not.toBeInTheDocument();
  });

  test('Should render nothing when content is empty', () => {
    render(
      <InteractiveTooltip content={null} initialOpen>
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(document.querySelector('[data-placement]')).not.toBeInTheDocument();
  });

  test('Should show the panel on hover and hide it on unhover', async () => {
    const user = userEvent.setup();

    render(
      <InteractiveTooltip content="Panel text">
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    const button = screen.getByRole('button', { name: 'Trigger' });

    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByText('Panel text')).toBeInTheDocument();
    });

    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByText('Panel text')).not.toBeInTheDocument();
    });
  });

  test('Should start open when initialOpen is true', () => {
    render(
      <InteractiveTooltip content="Panel text" initialOpen>
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByText('Panel text')).toBeInTheDocument();
  });

  test('Should let a button inside the panel be clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <InteractiveTooltip
        initialOpen
        content={<button onClick={onClick}>Inner action</button>}
      >
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    await user.click(screen.getByRole('button', { name: 'Inner action' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test.each([
    TooltipPlacement.Top,
    TooltipPlacement.Right,
    TooltipPlacement.Bottom,
    TooltipPlacement.Left,
  ])('Should place the panel on the %s side of the trigger', (placement) => {
    render(
      <InteractiveTooltip
        content="Panel text"
        placement={placement}
        initialOpen
      >
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByText('Panel text')).toHaveAttribute(
      'data-placement',
      placement,
    );
  });

  test('Should keep the child classes when asChild is set', () => {
    render(
      <InteractiveTooltip content="Panel text" asChild>
        <button className="custom-trigger">Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveClass(
      'custom-trigger',
    );
  });

  test('Should merge triggerClassName into the child classes', () => {
    render(
      <InteractiveTooltip
        content="Panel text"
        asChild
        triggerClassName="from-trigger"
      >
        <button className="custom-trigger">Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveClass(
      'custom-trigger',
      'from-trigger',
    );
  });

  test('Should apply the contentClassName to the panel', () => {
    render(
      <InteractiveTooltip
        content="Panel text"
        initialOpen
        contentClassName="custom-content"
      >
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByText('Panel text')).toHaveClass(
      'custom-content',
      'bg-layer-0',
    );
  });

  test('Should let contentClassName replace the default background', () => {
    render(
      <InteractiveTooltip
        content="Panel text"
        initialOpen
        contentClassName="bg-layer-raised"
      >
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    const panel = screen.getByText('Panel text');

    // `twMerge` resolves the conflicting `bg-*` utility rather than applying both.
    expect(panel).toHaveClass('bg-layer-raised');
    expect(panel).not.toHaveClass('bg-layer-0');
  });

  test('Should render nothing on a mobile screen, where there is no hover', () => {
    setViewportWidth(375);

    render(
      <InteractiveTooltip content="Panel text" initialOpen>
        <button>Trigger</button>
      </InteractiveTooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByText('Panel text')).not.toBeInTheDocument();
  });
});
