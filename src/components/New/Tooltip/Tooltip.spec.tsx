import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';

import { TooltipPlacement } from '@/types/tooltip';
import { Tooltip } from './Tooltip';

const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
};

const DESKTOP_WIDTH = 1024;

describe('Dial UI Kit :: Tooltip', () => {
  afterEach(() => setViewportWidth(DESKTOP_WIDTH));

  test('Should render children without a tooltip when hideTooltip is true', () => {
    render(
      <Tooltip tooltip="Tooltip text" hideTooltip>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  test('Should render children without a tooltip when tooltip is empty', () => {
    render(
      <Tooltip tooltip="">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('Should show the tooltip on hover and hide it on unhover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip tooltip="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Trigger' });

    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip text');
    });

    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  test('Should show the tooltip on focus', async () => {
    render(
      <Tooltip tooltip="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    fireEvent.focus(screen.getByRole('button', { name: 'Trigger' }));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  test('Should start open when initialOpen is true', () => {
    render(
      <Tooltip tooltip="Tooltip text" initialOpen>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip text');
  });

  test.each([
    TooltipPlacement.Top,
    TooltipPlacement.Right,
    TooltipPlacement.Bottom,
    TooltipPlacement.Left,
  ])('Should place the tooltip on the %s side of the trigger', (placement) => {
    render(
      <Tooltip tooltip="Tooltip text" placement={placement} initialOpen>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip')).toHaveAttribute(
      'data-placement',
      placement,
    );
  });

  test('Should describe the control itself when asChild is set', () => {
    render(
      <Tooltip tooltip="Tooltip text" initialOpen asChild>
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Trigger' });

    // Without `asChild` the description lands on the wrapper span, where no
    // assistive technology reads it out for the control.
    expect(button).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('tooltip').id,
    );
  });

  test('Should keep the child classes when asChild is set', () => {
    render(
      <Tooltip tooltip="Tooltip text" asChild>
        <button className="custom-trigger">Trigger</button>
      </Tooltip>,
    );

    // The trigger used to spread its own undefined `className` over the child,
    // silently stripping every class the child owned.
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveClass(
      'custom-trigger',
    );
  });

  test('Should merge triggerClassName into the child classes', () => {
    render(
      <Tooltip tooltip="Tooltip text" asChild triggerClassName="from-trigger">
        <button className="custom-trigger">Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveClass(
      'custom-trigger',
      'from-trigger',
    );
  });

  test('Should paint the arrow with the tooltip background', () => {
    render(
      <Tooltip tooltip="Tooltip text" initialOpen>
        <button>Trigger</button>
      </Tooltip>,
    );

    // The arrow is an SVG outside the bubble, so it cannot inherit the
    // background; jsdom does no styling, so the class is all there is to check
    // here — the compiled rule is verified in dist/index.css.
    expect(screen.getByRole('tooltip').querySelector('svg')).toHaveClass(
      'fill-control-inverted',
    );
  });

  test('Should apply the trigger and content class names', () => {
    render(
      <Tooltip
        tooltip="Tooltip text"
        initialOpen
        triggerClassName="custom-trigger"
        contentClassName="custom-content"
      >
        <span>Trigger</span>
      </Tooltip>,
    );

    expect(screen.getByText('Trigger').parentElement).toHaveClass(
      'custom-trigger',
    );
    expect(screen.getByRole('tooltip')).toHaveClass(
      'custom-content',
      'bg-control-inverted',
    );
  });

  test('Should cap the bubble at the design maximum width', () => {
    render(
      <Tooltip tooltip="Tooltip text" initialOpen>
        <button>Trigger</button>
      </Tooltip>,
    );

    // jsdom does no layout, so the class is all there is to check here — the
    // compiled rule is verified in dist/index.css.
    expect(screen.getByRole('tooltip')).toHaveClass('max-w-[376px]');
  });

  test('Should render nothing on a mobile screen, where there is no hover', () => {
    setViewportWidth(375);

    render(
      <Tooltip tooltip="Tooltip text" initialOpen>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
