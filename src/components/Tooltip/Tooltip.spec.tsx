import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { DialTooltip } from './Tooltip';

describe('Dial UI Kit :: DialTooltip', () => {
  test('renders children without tooltip when hideTooltip is true', () => {
    render(
      <DialTooltip tooltip="Test tooltip" hideTooltip>
        <button>Test button</button>
      </DialTooltip>,
    );

    expect(
      screen.getByRole('button', { name: 'Test button' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });

  test('renders children without tooltip when tooltip is empty', () => {
    render(
      <DialTooltip tooltip="">
        <button>Test button</button>
      </DialTooltip>,
    );

    expect(
      screen.getByRole('button', { name: 'Test button' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('shows tooltip on hover', async () => {
    const user = userEvent.setup();

    render(
      <DialTooltip tooltip="Test tooltip">
        <button>Test button</button>
      </DialTooltip>,
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  test('hides tooltip when not hovering', async () => {
    const user = userEvent.setup();

    render(
      <DialTooltip tooltip="Test tooltip">
        <button>Test button</button>
      </DialTooltip>,
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });

    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    });
  });

  test('shows tooltip on focus', async () => {
    render(
      <DialTooltip tooltip="Test tooltip">
        <button>Test button</button>
      </DialTooltip>,
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    // Focus the button
    fireEvent.focus(button);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  test('starts open when initialOpen is true', () => {
    render(
      <DialTooltip tooltip="Test tooltip" initialOpen>
        <button>Test button</button>
      </DialTooltip>,
    );

    expect(screen.getByText('Test tooltip')).toBeInTheDocument();
  });
});
