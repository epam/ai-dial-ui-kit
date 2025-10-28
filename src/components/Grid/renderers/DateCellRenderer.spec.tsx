import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialDateCellRenderer } from './DateCellRenderer';

describe('Dial UI Kit :: DialDateCellRenderer (MMM dd, yyyy)', () => {
  test('renders ISO string as "Jul 20, 2025" with <time>', () => {
    render(
      <DialDateCellRenderer
        value="2025-07-20T00:00:00Z"
        locale="en-US"
        timeZone="UTC"
      />,
    );
    const timeEl = screen.getByText('Jul 20, 2025').closest('time');
    expect(timeEl).toBeInTheDocument();
    expect(timeEl).toHaveAttribute('dateTime', '2025-07-20T00:00:00.000Z');
  });

  test('renders numeric timestamp (ms) correctly', () => {
    render(
      <DialDateCellRenderer
        value={1752969600000}
        locale="en-US"
        timeZone="UTC"
      />,
    );
    expect(screen.getByText('Jul 20, 2025')).toBeInTheDocument();
  });

  test('renders placeholder on invalid value', () => {
    render(<DialDateCellRenderer value="not-a-date" emptyPlaceholder="—" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('forwards cssClass to wrapper', () => {
    render(<DialDateCellRenderer value="2025-07-20" cssClass="custom-class" />);
    screen.logTestingPlaygroundURL();
    expect(screen.getByText('Jul 20, 2025').parentNode).toHaveClass(
      'custom-class',
    );
  });
});
