import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { DialSlider } from './Slider';

describe('Dial UI Kit :: DialSlider', () => {
  test('renders with correct ARIA attributes', () => {
    render(
      <DialSlider
        value={0.5}
        min={0}
        max={1}
        aria-label="Temperature"
        onChange={() => undefined}
      />,
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '0.5');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '1');
    expect(slider).toHaveAttribute('aria-label', 'Temperature');
  });

  test('displays formatted value in thumb', () => {
    render(<DialSlider value={0.5} onChange={() => undefined} />);
    expect(screen.getByRole('slider')).toHaveTextContent('0.5');
  });

  test('uses custom formatValue', () => {
    render(
      <DialSlider
        value={0.7}
        formatValue={(v) => `${Math.round(v * 100)}%`}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByRole('slider')).toHaveTextContent('70%');
  });

  test('fires onChange on ArrowRight and ArrowLeft', () => {
    const onChange = vi.fn();
    render(
      <DialSlider value={0.5} min={0} max={1} step={0.1} onChange={onChange} />,
    );
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(0.6);

    onChange.mockClear();
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(0.4);
  });

  test('fires onChange on ArrowUp and ArrowDown', () => {
    const onChange = vi.fn();
    render(
      <DialSlider value={0.5} min={0} max={1} step={0.1} onChange={onChange} />,
    );
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(0.6);

    onChange.mockClear();
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(0.4);
  });

  test('jumps to min/max on Home/End keys', () => {
    const onChange = vi.fn();
    render(
      <DialSlider value={0.5} min={0} max={1} step={0.1} onChange={onChange} />,
    );
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(0);

    onChange.mockClear();
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test('clamps at max boundary', () => {
    const onChange = vi.fn();
    render(
      <DialSlider value={1} min={0} max={1} step={0.1} onChange={onChange} />,
    );
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('clamps at min boundary', () => {
    const onChange = vi.fn();
    render(
      <DialSlider value={0} min={0} max={1} step={0.1} onChange={onChange} />,
    );
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not fire onChange when disabled', () => {
    const onChange = vi.fn();
    render(<DialSlider value={0.5} disabled onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('thumb is not focusable when disabled', () => {
    render(<DialSlider value={0.5} disabled onChange={() => undefined} />);
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '-1');
  });

  test('renders three labels', () => {
    render(
      <DialSlider
        value={0.5}
        labels={['Precise', 'Neutral', 'Creative']}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText('Precise')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Creative')).toBeInTheDocument();
  });

  test('renders two labels', () => {
    render(
      <DialSlider
        value={0.5}
        labels={['Min', 'Max']}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });

  test('renders no labels when omitted', () => {
    const { queryByText } = render(
      <DialSlider value={0.5} onChange={() => undefined} />,
    );
    expect(queryByText('Precise')).not.toBeInTheDocument();
  });

  test('applies className to outer container', () => {
    const { container } = render(
      <DialSlider
        value={0.5}
        className="custom-class"
        onChange={() => undefined}
      />,
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('integer step formats value without decimals', () => {
    render(
      <DialSlider
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByRole('slider')).toHaveTextContent('50');
  });
});
