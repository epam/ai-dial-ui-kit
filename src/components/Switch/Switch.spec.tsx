import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { DialSwitch } from './Switch';

describe('Dial UI Kit :: DialSwitch', () => {
  test('renders with title', () => {
    render(<DialSwitch label="Test Switch" switchId="switch1" />);
    expect(screen.getByText('Test Switch')).toBeInTheDocument();
  });

  test('calls onChange with toggled value', () => {
    const onChange = vi.fn();
    render(
      <DialSwitch
        label="Test Switch"
        switchId="switch2"
        isOn={false}
        onChange={onChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('is disabled when disabled prop is true', () => {
    const onChange = vi.fn();
    render(
      <DialSwitch
        label="Disabled Switch"
        switchId="switch3"
        disabled
        onChange={onChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  test('caption is rendered when provided', () => {
    const onChange = vi.fn();
    render(
      <DialSwitch
        label="Disabled Switch"
        switchId="switch3"
        caption="caption"
        onChange={onChange}
      />,
    );
    const caption = screen.getByText('caption');
    expect(caption).toBeInTheDocument();
  });
});
