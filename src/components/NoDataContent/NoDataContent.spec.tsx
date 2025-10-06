import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialNoDataContent } from './NoDataContent';

describe('Dial UI Kit :: NoDataContent', () => {
  test('renders icon and title', () => {
    render(<DialNoDataContent emptyDataTitle="No data available" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('renders icon and title', () => {
    render(
      <DialNoDataContent emptyDataTitle="No data available" icon={<div></div>} />,
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
