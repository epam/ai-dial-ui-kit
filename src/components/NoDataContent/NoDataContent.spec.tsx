import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialNoDataContent } from './NoDataContent';

describe('Dial UI Kit :: NoDataContent', () => {
  test('renders default icon and title', () => {
    render(
      <DialNoDataContent
        title="No data available"
        description="Description message"
      />,
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('renders icon and title', () => {
    render(
      <DialNoDataContent title="No data available" icon={<div>Icon</div>} />,
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
