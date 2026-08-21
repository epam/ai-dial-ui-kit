import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, test, expect, vi } from 'vitest';
import { Radio } from './Radio';

describe('Dial UI Kit :: Radio', () => {
  test('renders with an accessible name from its label', () => {
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan' }}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeInTheDocument();
  });

  test('falls back to aria-label when no visible label is provided', () => {
    render(<Radio id="radio" name="group" value="a" aria-label="Pro plan" />);
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeInTheDocument();
  });

  test('reflects isSelected through the checked state', () => {
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan' }}
        isSelected
      />,
    );
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeChecked();
  });

  test('calls onChange with its value when selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Radio
        id="radio"
        name="group"
        value="pro"
        labelProps={{ label: 'Pro plan' }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Pro plan' }));

    expect(onChange).toHaveBeenCalledWith('pro');
  });

  test('does not fire onChange when an already selected radio is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Radio
        id="radio"
        name="group"
        value="pro"
        labelProps={{ label: 'Pro plan' }}
        isSelected
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Pro plan' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('clicking the visible label selects the radio', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Radio
        id="radio"
        name="group"
        value="pro"
        labelProps={{ label: 'Pro plan' }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('Pro plan'));

    expect(onChange).toHaveBeenCalledWith('pro');
  });

  test('radios sharing a name are mutually exclusive', async () => {
    const user = userEvent.setup();
    const Group = () => {
      const [plan, setPlan] = useState('free');

      return (
        <>
          <Radio
            id="free"
            name="plan"
            value="free"
            labelProps={{ label: 'Free' }}
            isSelected={plan === 'free'}
            onChange={setPlan}
          />
          <Radio
            id="pro"
            name="plan"
            value="pro"
            labelProps={{ label: 'Pro' }}
            isSelected={plan === 'pro'}
            onChange={setPlan}
          />
        </>
      );
    };
    render(<Group />);

    await user.click(screen.getByRole('radio', { name: 'Pro' }));

    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  });

  test('announces a required radio through its label', () => {
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan', required: true }}
      />,
    );

    expect(
      screen.getByRole('radio', { name: 'Pro plan (required)' }),
    ).toBeInTheDocument();
  });

  test('exposes the label caption through its info button', () => {
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan', caption: 'Billed yearly' }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Billed yearly' }),
    ).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan' }}
        disabled
      />,
    );
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeDisabled();
  });

  test('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan' }}
        disabled
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('Pro plan'));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('grows the 20px control to the 24x24 minimum pointer target', () => {
    // Only the circle carries a <label> here — no labelProps means no text label.
    // 20px cannot reach the 44px enhanced target without overhanging the adjacent
    // label, so it takes the minimum target instead. jsdom does no layout, so the
    // geometry itself is verified by compiling CSS.
    const { container } = render(
      <Radio id="radio" name="group" value="a" aria-label="Pro plan" />,
    );

    const circle = container.querySelector('label[for="radio"]');

    expect(circle).toHaveClass('dial-kit-minimum-target');
    expect(circle).not.toHaveClass('dial-kit-enhanced-target');
  });

  test('renders caption text and links it to the radio', () => {
    render(
      <Radio
        id="radio"
        name="group"
        value="a"
        labelProps={{ label: 'Pro plan' }}
        caption="Some caption"
      />,
    );
    const caption = screen.getByText('Some caption');
    const control = screen.getByRole('radio', { name: 'Pro plan' });

    expect(caption).toBeInTheDocument();
    expect(control).toHaveAttribute('aria-describedby', caption.id);
  });
});
