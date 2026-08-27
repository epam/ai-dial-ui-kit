import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { DateCellRenderer } from './DateCellRenderer';

describe('Dial UI Kit :: DateCellRenderer', () => {
  test('renders an ISO string inside a machine-readable <time>', () => {
    render(
      <DateCellRenderer
        value="2025-07-20T00:00:00Z"
        locale="en-US"
        options={{ timeZone: 'UTC' }}
      />,
    );

    const timeElement = screen.getByText('7/20/2025').closest('time');

    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('dateTime', '2025-07-20T00:00:00.000Z');
  });

  test('reads a numeric value as epoch milliseconds', () => {
    render(
      <DateCellRenderer
        value={1752969600000}
        locale="en-US"
        options={{ timeZone: 'UTC' }}
      />,
    );

    expect(screen.getByText('7/20/2025')).toBeInTheDocument();
  });

  test('reads an integer string as epoch milliseconds too', () => {
    render(
      <DateCellRenderer
        value="1752969600000"
        locale="en-US"
        options={{ timeZone: 'UTC' }}
      />,
    );

    expect(screen.getByText('7/20/2025')).toBeInTheDocument();
  });

  test('falls back to the placeholder on an unusable value', () => {
    render(<DateCellRenderer value="not-a-date" emptyPlaceholder="—" />);

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(document.querySelector('time')).toBeNull();
  });

  test('renders nothing readable when there is no value and no placeholder', () => {
    const { container } = render(<DateCellRenderer value={null} />);

    expect(container).toHaveTextContent('');
    expect(document.querySelector('time')).toBeNull();
  });

  test('formats with the locale it is given', () => {
    render(
      <DateCellRenderer
        value="2025-07-20T00:00:00Z"
        locale="de-DE"
        options={{ timeZone: 'UTC', dateStyle: 'short' }}
      />,
    );

    expect(screen.getByText('20.07.25')).toBeInTheDocument();
  });
});
