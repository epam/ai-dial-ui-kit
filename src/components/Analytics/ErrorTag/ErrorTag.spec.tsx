import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAnalyticsErrorTag } from './ErrorTag';

describe('Dial UI Kit :: DialAnalyticsErrorTag', () => {
  test('renders the default "Error" label with error styles', () => {
    const { container } = render(<DialAnalyticsErrorTag />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    const tag = container.firstChild as HTMLElement;
    expect(tag.className).toMatch(/bg-error/);
    expect(tag.className).toMatch(/text-error/);
    expect(tag.className).toMatch(/border-transparent/);
    expect(tag.className).toMatch(/dial-tiny-semi-text/);
  });

  test('supports a custom label and className', () => {
    const { container } = render(
      <DialAnalyticsErrorTag label="Failed" className="u-test" />,
    );

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect((container.firstChild as HTMLElement).className).toMatch(/u-test/);
  });
});
