import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Slider } from './Slider';

describe('Dial UI Kit :: Slider', () => {
  test('renders with an accessible name from its label', () => {
    render(
      <Slider
        id="temperature"
        labelProps={{ label: 'Temperature' }}
        value={0.5}
      />,
    );

    expect(
      screen.getByRole('slider', { name: 'Temperature' }),
    ).toBeInTheDocument();
  });

  test('falls back to aria-label when no visible label is provided', () => {
    render(<Slider aria-label="Temperature" value={0.5} />);

    expect(
      screen.getByRole('slider', { name: 'Temperature' }),
    ).toBeInTheDocument();
  });

  test('reports the current value and its bounds', () => {
    render(<Slider aria-label="Temperature" value={0.5} min={0} max={1} />);

    const slider = screen.getByRole('slider', { name: 'Temperature' });
    expect(slider).toHaveValue('0.5');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '1');
  });

  test('calls onChange with the new numeric value', () => {
    const onChange = vi.fn();
    render(
      <Slider
        aria-label="Temperature"
        value={0.5}
        min={0}
        max={1}
        step={0.1}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Temperature' }), {
      target: { value: '0.7' },
    });

    expect(onChange).toHaveBeenCalledWith(0.7);
  });

  // The arrow / Home / End steps come from the native range input, and jsdom
  // implements none of them — so the only thing assertable here is that the
  // control really is a range input carrying the step the browser will use.
  // Verify the stepping itself in a browser.
  test('leaves keyboard stepping to a native range input', () => {
    render(
      <Slider
        aria-label="Temperature"
        value={0.5}
        min={0}
        max={1}
        step={0.1}
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Temperature' });
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('step', '0.1');
  });

  test('takes focus so it can be operated from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="Temperature" value={0.5} />);

    await user.tab();

    expect(screen.getByRole('slider', { name: 'Temperature' })).toHaveFocus();
  });

  test('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        aria-label="Temperature"
        value={0.5}
        disabled
        onChange={onChange}
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Temperature' });
    await user.click(slider);
    await user.keyboard('{ArrowRight}');

    expect(slider).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('announces the formatted value through aria-valuetext', () => {
    render(
      <Slider
        aria-label="Temperature"
        value={0.7}
        formatValue={(v) => `${Math.round(v * 100)}%`}
      />,
    );

    expect(screen.getByRole('slider', { name: 'Temperature' })).toHaveAttribute(
      'aria-valuetext',
      '70%',
    );
  });

  test('leaves aria-valuetext off when the raw value is what is shown', () => {
    render(<Slider aria-label="Temperature" value={0.7} />);

    expect(
      screen.getByRole('slider', { name: 'Temperature' }),
    ).not.toHaveAttribute('aria-valuetext');
  });

  test('shows the formatted value next to the label when showValue is set', () => {
    render(
      <Slider
        labelProps={{ label: 'Temperature' }}
        value={0.7}
        formatValue={(v) => `${Math.round(v * 100)}%`}
        showValue
      />,
    );

    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  test('formats the displayed value to the precision of the step', () => {
    render(
      <Slider
        aria-label="Level"
        value={50}
        min={0}
        max={100}
        step={1}
        showValue
      />,
    );

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('hides the value from assistive tech, which reads it off the input', () => {
    const { container } = render(
      <Slider aria-label="Temperature" value={0.5} showValue />,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      '0.5',
    );
  });

  test('renders no value when showValue is not set', () => {
    render(<Slider aria-label="Temperature" value={0.5} />);

    expect(screen.queryByText('0.5')).not.toBeInTheDocument();
  });

  test('fills the track up to the centre of the thumb', () => {
    const { container } = render(
      <Slider aria-label="Temperature" value={0.5} min={0} max={1} />,
    );

    // 50% of the track, pulled back to where the thumb centre actually sits.
    expect(container.querySelector('[style*="calc"]')).toHaveStyle({
      width: 'calc(50% + 0px)',
    });
  });

  test('leaves the fill at the thumb centre for a zero-width range', () => {
    const { container } = render(
      <Slider aria-label="Temperature" value={5} min={5} max={5} />,
    );

    expect(container.querySelector('[style*="calc"]')).toHaveStyle({
      width: 'calc(0% + 8px)',
    });
  });

  test('renders three labels', () => {
    render(
      <Slider
        aria-label="Temperature"
        value={0.5}
        labels={['Precise', 'Neutral', 'Creative']}
      />,
    );

    expect(screen.getByText('Precise')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Creative')).toBeInTheDocument();
  });

  test('renders two labels', () => {
    render(
      <Slider aria-label="Temperature" value={0.5} labels={['Min', 'Max']} />,
    );

    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });

  test('describes the slider by its caption', () => {
    render(
      <Slider
        id="temperature"
        aria-label="Temperature"
        value={0.5}
        caption="Higher values are more creative"
      />,
    );

    expect(
      screen.getByRole('slider', { name: 'Temperature' }),
    ).toHaveAccessibleDescription('Higher values are more creative');
  });

  test('replaces the caption with the error and describes the slider by it', () => {
    render(
      <Slider
        id="temperature"
        aria-label="Temperature"
        value={0.5}
        caption="Higher values are more creative"
        error="Out of range"
      />,
    );

    expect(
      screen.queryByText('Higher values are more creative'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('slider', { name: 'Temperature' }),
    ).toHaveAccessibleDescription('Out of range');
  });

  test('applies containerClassName to the outer container', () => {
    const { container } = render(
      <Slider
        aria-label="Temperature"
        value={0.5}
        containerClassName="custom"
      />,
    );

    expect(container.firstChild).toHaveClass('custom');
  });

  test('applies className to the range input', () => {
    render(
      <Slider aria-label="Temperature" value={0.5} className="custom-input" />,
    );

    expect(screen.getByRole('slider', { name: 'Temperature' })).toHaveClass(
      'custom-input',
    );
  });
});
