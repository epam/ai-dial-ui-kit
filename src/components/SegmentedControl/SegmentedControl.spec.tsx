import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { SegmentedControlOption } from '@/models/segmented-control';
import { DialSegmentedControl } from './SegmentedControl';

const options: SegmentedControlOption<string>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('Dial UI Kit :: DialSegmentedControl', () => {
  test('renders all options with correct selected state', () => {
    render(
      <DialSegmentedControl
        ariaLabel="Period"
        options={options}
        value="week"
        onChange={() => null}
      />,
    );

    expect(screen.getByRole('tablist', { name: 'Period' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: 'Week' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Day' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  test('fires onChange with the clicked option value', () => {
    const onChange = vi.fn();
    render(
      <DialSegmentedControl
        options={options}
        value="day"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Month' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('month');
  });

  test('does not fire onChange for a disabled option', () => {
    const onChange = vi.fn();
    render(
      <DialSegmentedControl
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', disabled: true },
        ]}
        value="day"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Week' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not fire onChange when the whole control is disabled', () => {
    const onChange = vi.fn();
    render(
      <DialSegmentedControl
        options={options}
        value="day"
        onChange={onChange}
        disabled
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Week' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('moves selection with ArrowRight and ArrowLeft across enabled options', () => {
    const onChange = vi.fn();
    render(
      <DialSegmentedControl
        options={options}
        value="week"
        onChange={onChange}
      />,
    );

    const selected = screen.getByRole('tab', { name: 'Week' });

    fireEvent.keyDown(selected, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('month');

    fireEvent.keyDown(selected, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('day');
  });

  test('skips disabled options during keyboard navigation', () => {
    const onChange = vi.fn();
    render(
      <DialSegmentedControl
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', disabled: true },
          { value: 'month', label: 'Month' },
        ]}
        value="day"
        onChange={onChange}
      />,
    );

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Day' }), {
      key: 'ArrowRight',
    });

    expect(onChange).toHaveBeenCalledWith('month');
  });

  test('renders with only two segments', () => {
    render(
      <DialSegmentedControl
        options={[
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ]}
        value="on"
        onChange={() => null}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });
});
