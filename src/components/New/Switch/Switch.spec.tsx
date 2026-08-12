import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { Switch } from './Switch';

describe('Dial UI Kit :: Switch', () => {
  test('renders with an accessible name from its label', () => {
    render(<Switch id="switch" label="Notifications" />);
    expect(
      screen.getByRole('switch', { name: 'Notifications' }),
    ).toBeInTheDocument();
  });

  test('falls back to aria-label when no visible label is provided', () => {
    render(<Switch id="switch" aria-label="Notifications" />);
    expect(
      screen.getByRole('switch', { name: 'Notifications' }),
    ).toBeInTheDocument();
  });

  test('reflects isOn through aria-checked', () => {
    render(<Switch id="switch" label="Notifications" isOn />);
    expect(
      screen.getByRole('switch', { name: 'Notifications' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  test('calls onChange with the toggled value when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Switch
        id="switch"
        label="Notifications"
        isOn={false}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('switch', { name: 'Notifications' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('clicking the visible label toggles the switch', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Switch
        id="switch"
        label="Notifications"
        isOn={false}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('Notifications'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Switch id="switch" label="Notifications" disabled />);
    expect(
      screen.getByRole('switch', { name: 'Notifications' }),
    ).toBeDisabled();
  });

  test('renders caption text and links it to the switch', () => {
    render(<Switch id="switch" label="Notifications" caption="Some caption" />);
    const caption = screen.getByText('Some caption');
    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(caption).toBeInTheDocument();
    expect(control).toHaveAttribute('aria-describedby', caption.id);
  });
});
