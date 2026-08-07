import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { CalendarMode } from '@/types/calendar';
import { Calendar } from './Calendar';

describe('Dial UI Kit :: Calendar', () => {
  describe('date mode', () => {
    test('Should render the placeholder when there is no value', () => {
      render(<Calendar mode={CalendarMode.Date} placeholder="Select date" />);
      expect(
        screen.getByRole('button', { name: 'Select date' }),
      ).toBeInTheDocument();
    });

    test('Should render the formatted date when a value is provided', () => {
      render(
        <Calendar mode={CalendarMode.Date} value={new Date(2026, 2, 11)} />,
      );
      expect(
        screen.getByRole('button', { name: '11 Mar 2026' }),
      ).toBeInTheDocument();
    });

    test('Should open the month grid on click and select a day', () => {
      const onChange = vi.fn();
      render(
        <Calendar
          mode={CalendarMode.Date}
          value={new Date(2026, 2, 11)}
          onChange={onChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: '11 Mar 2026' }));
      expect(screen.getByText('March 2026')).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole('button', { name: 'Sunday, 15 March 2026' }),
      );
      expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 15));
      expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
    });

    test('Should navigate to the next and previous month', () => {
      render(
        <Calendar mode={CalendarMode.Date} value={new Date(2026, 2, 11)} />,
      );

      fireEvent.click(screen.getByRole('button', { name: '11 Mar 2026' }));
      expect(screen.getByText('March 2026')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(screen.getByText('April 2026')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
      expect(screen.getByText('March 2026')).toBeInTheDocument();
    });
  });

  describe('datetime mode', () => {
    test('Should render the combined date and time label and update on time change', () => {
      const onChange = vi.fn();
      render(
        <Calendar
          mode={CalendarMode.DateTime}
          value={new Date(2026, 2, 11, 9, 0)}
          onChange={onChange}
        />,
      );

      expect(
        screen.getByRole('button', { name: '11 Mar 2026, 09:00' }),
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole('button', { name: '11 Mar 2026, 09:00' }),
      );
      fireEvent.change(screen.getByLabelText('Time'), {
        target: { value: '14:30' },
      });

      expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 11, 14, 30));
    });
  });

  describe('time mode', () => {
    test('Should forward a custom placeholder to the time field', () => {
      render(<Calendar mode={CalendarMode.Time} placeholder="hh:mm" />);
      expect(screen.getByPlaceholderText('hh:mm')).toBeInTheDocument();
    });

    test('Should render a masked time field and forward complete changes', () => {
      const onChange = vi.fn();
      render(
        <Calendar mode={CalendarMode.Time} value="09:00" onChange={onChange} />,
      );

      const input = screen.getByDisplayValue('09:00');
      fireEvent.change(input, { target: { value: '1015' } });
      expect(onChange).toHaveBeenCalledWith('10:15');
    });

    test('Should not forward an incomplete time and should clamp out-of-range segments', () => {
      const onChange = vi.fn();
      render(
        <Calendar mode={CalendarMode.Time} value="" onChange={onChange} />,
      );

      const input = screen.getByPlaceholderText('--:--');

      fireEvent.change(input, { target: { value: '9' } });
      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('9');

      fireEvent.change(input, { target: { value: '99' } });
      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('23');

      fireEvent.change(input, { target: { value: '2399' } });
      expect(onChange).toHaveBeenCalledWith('23:59');
    });
  });

  describe('weekday mode', () => {
    test('Should render weekday options and forward the selected value', () => {
      const onChange = vi.fn();
      render(
        <Calendar
          mode={CalendarMode.Weekday}
          placeholder="Select day"
          onChange={onChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /select day/i }));
      fireEvent.click(screen.getByRole('option', { name: 'Monday' }));
      expect(onChange).toHaveBeenCalledWith('1');
    });

    test('Should forward a custom placeholder to the weekday field', () => {
      render(<Calendar mode={CalendarMode.Weekday} placeholder="Pick a day" />);
      expect(
        screen.getByRole('button', { name: 'Pick a day' }),
      ).toBeInTheDocument();
    });
  });

  describe('default placeholders per mode', () => {
    test('Should fall back to a mode-appropriate placeholder when none is provided', () => {
      const { rerender } = render(<Calendar mode={CalendarMode.Date} />);
      expect(
        screen.getByRole('button', { name: 'Select date' }),
      ).toBeInTheDocument();

      rerender(<Calendar mode={CalendarMode.DateTime} />);
      expect(
        screen.getByRole('button', { name: 'Select date and time' }),
      ).toBeInTheDocument();

      rerender(<Calendar mode={CalendarMode.Time} />);
      expect(screen.getByPlaceholderText('--:--')).toBeInTheDocument();

      rerender(<Calendar mode={CalendarMode.Weekday} />);
      expect(
        screen.getByRole('button', { name: 'Select day' }),
      ).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    test('Should name each day cell with its full date', () => {
      render(
        <Calendar mode={CalendarMode.Date} value={new Date(2026, 2, 11)} />,
      );

      fireEvent.click(screen.getByRole('button', { name: '11 Mar 2026' }));

      expect(
        screen.getByRole('button', { name: 'Sunday, 1 March 2026' }),
      ).toBeInTheDocument();
    });

    test('Should distinguish days spilling over from an adjacent month', () => {
      render(
        <Calendar mode={CalendarMode.Date} value={new Date(2026, 2, 11)} />,
      );

      fireEvent.click(screen.getByRole('button', { name: '11 Mar 2026' }));

      expect(
        screen.getByRole('button', { name: 'Saturday, 28 February 2026' }),
      ).toBeInTheDocument();
    });

    test('Should name the popover so it is not announced as an unlabelled dialog', () => {
      render(<Calendar mode={CalendarMode.Date} label="Start date" />);

      fireEvent.click(screen.getByRole('button', { name: /Start date/ }));

      expect(
        screen.getByRole('dialog', { name: 'Start date' }),
      ).toBeInTheDocument();
    });

    test('Should name the trigger from both the label and the current value', () => {
      render(
        <Calendar
          mode={CalendarMode.Date}
          label="Start date"
          value={new Date(2026, 2, 11)}
        />,
      );

      // `<label htmlFor>` is inert on a div[role="button"], so without the
      // explicit wiring the field name would be missing entirely.
      expect(
        screen.getByRole('button', { name: 'Start date 11 Mar 2026' }),
      ).toBeInTheDocument();
    });

    test('Should hide the decorative weekday header row from assistive tech', () => {
      render(
        <Calendar mode={CalendarMode.Date} value={new Date(2026, 2, 11)} />,
      );

      fireEvent.click(screen.getByRole('button', { name: '11 Mar 2026' }));

      expect(screen.getByText('Mon')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('localization', () => {
    test('Should localize month/weekday names and date formatting via the locale prop', () => {
      render(
        <Calendar
          mode={CalendarMode.Date}
          value={new Date(2026, 2, 11)}
          locale="de-DE"
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /11.*2026/ }));
      expect(screen.getByText('März 2026')).toBeInTheDocument();
      expect(screen.getByText('Mo')).toBeInTheDocument();
    });
  });
});
