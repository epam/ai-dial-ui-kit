import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Dial UI Kit :: Checkbox', () => {
  test('renders with an accessible name from its label', () => {
    render(<Checkbox id="checkbox" labelProps={{ label: 'Accept terms' }} />);
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toBeInTheDocument();
  });

  test('falls back to aria-label when no visible label is provided', () => {
    render(<Checkbox id="checkbox" aria-label="Accept terms" />);
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toBeInTheDocument();
  });

  test('reflects isSelected through the checked state', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isSelected
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toBeChecked();
  });

  test('announces the mixed state and sets the indeterminate DOM property', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isIndeterminate
      />,
    );

    const control = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(control).toHaveAttribute('aria-checked', 'mixed');
    expect(control).toBePartiallyChecked();
  });

  test('announces mixed even when isSelected is also set', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isSelected
        isIndeterminate
      />,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toHaveAttribute('aria-checked', 'mixed');
  });

  test('clears the indeterminate DOM property when the state is dropped', () => {
    const { rerender } = render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isIndeterminate
      />,
    );

    rerender(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isIndeterminate={false}
      />,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).not.toBePartiallyChecked();
  });

  test('calls onChange with the toggled value when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isSelected={false}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('selects an indeterminate checkbox when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isIndeterminate
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('clicking the visible label toggles the checkbox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        isSelected={false}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('Accept terms'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('marks the control invalid when it fails validation', () => {
    render(
      <Checkbox id="checkbox" labelProps={{ label: 'Accept terms' }} invalid />,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toBeInvalid();
  });

  test('is not marked invalid by default', () => {
    render(<Checkbox id="checkbox" labelProps={{ label: 'Accept terms' }} />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeValid();
  });

  test('announces a required checkbox through its label', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms', required: true }}
      />,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms (required)' }),
    ).toBeInTheDocument();
  });

  test('exposes the label caption through its info button', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{
          label: 'Accept terms',
          caption: 'Version 2 of the terms',
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Version 2 of the terms' }),
    ).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        disabled
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toBeDisabled();
  });

  test('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        disabled
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('Accept terms'));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders caption text and links it to the checkbox', () => {
    render(
      <Checkbox
        id="checkbox"
        labelProps={{ label: 'Accept terms' }}
        caption="Some caption"
      />,
    );
    const caption = screen.getByText('Some caption');
    const control = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(caption).toBeInTheDocument();
    expect(control).toHaveAttribute('aria-describedby', caption.id);
  });

  test('grows the 20px control to the 24x24 minimum pointer target', () => {
    // Only the box carries a <label> here — no labelProps means no text label.
    // 20px cannot reach the 44px enhanced target without overhanging the adjacent
    // label, so it takes the minimum target instead. jsdom does no layout, so the
    // geometry itself is verified by compiling CSS.
    const { container } = render(
      <Checkbox id="checkbox" aria-label="Accept terms" />,
    );

    const box = container.querySelector('label[for="checkbox"]');

    expect(box).toHaveClass('dial-kit-minimum-target');
    expect(box).not.toHaveClass('dial-kit-enhanced-target');
  });
});
