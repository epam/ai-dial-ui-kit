import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { LiveRegionElement, LiveRegionPoliteness } from '@/types/live-region';
import { LiveRegion } from './LiveRegion';

describe('Dial UI Kit :: LiveRegion', () => {
  test.each([undefined, null, false, ''])(
    'renders the region while children is %j',
    (children) => {
      render(<LiveRegion>{children}</LiveRegion>);
      const region = screen.getByRole('status');
      expect(region).toBeEmptyDOMElement();
      expect(region).toHaveClass('dial-kit-live-region');
    },
  );

  test('keeps the same node when the message appears and clears', () => {
    const { rerender } = render(<LiveRegion>{''}</LiveRegion>);
    const before = screen.getByRole('status');

    rerender(<LiveRegion>Saved</LiveRegion>);
    const after = screen.getByRole('status');
    expect(after).toBe(before);
    expect(after).toHaveTextContent('Saved');

    rerender(<LiveRegion>{null}</LiveRegion>);
    expect(screen.getByRole('status')).toBe(before);
    expect(before).toBeEmptyDOMElement();
  });

  test.each([
    [undefined, 'status', 'polite'],
    [LiveRegionPoliteness.Polite, 'status', 'polite'],
    [LiveRegionPoliteness.Assertive, 'alert', 'assertive'],
  ] as const)(
    'politeness %s maps to role %s and aria-live %s',
    (politeness, role, live) => {
      render(<LiveRegion politeness={politeness}>Message</LiveRegion>);
      expect(screen.getByRole(role)).toHaveAttribute('aria-live', live);
    },
  );

  test('visuallyHidden applies sr-only', () => {
    render(<LiveRegion visuallyHidden>3 results</LiveRegion>);
    const region = screen.getByRole('status');
    expect(region).toHaveClass('sr-only');
    expect(region).not.toHaveClass('empty:sr-only');
  });

  test('a visible region collapses only while empty, without display:none', () => {
    render(<LiveRegion>Saved</LiveRegion>);
    const region = screen.getByRole('status');
    expect(region).toHaveClass('empty:sr-only');
    expect(region).not.toHaveClass('sr-only');
    expect(region).not.toHaveClass('hidden');
    expect(region).not.toHaveClass('empty:hidden');
  });

  test('atomic sets aria-atomic only when given', () => {
    const { rerender } = render(<LiveRegion>Saved</LiveRegion>);
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-atomic');

    rerender(<LiveRegion atomic>Saved</LiveRegion>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
  });

  test('renders the chosen element and passes through props', () => {
    render(
      <LiveRegion
        as={LiveRegionElement.Span}
        id="search-status"
        className="extra"
        aria-label="Search status"
      >
        No results
      </LiveRegion>,
    );
    const region = screen.getByRole('status', { name: 'Search status' });
    expect(region.tagName).toBe('SPAN');
    expect(region).toHaveAttribute('id', 'search-status');
    expect(region).toHaveClass('extra', 'dial-kit-live-region');
  });

  test('renders a div by default', () => {
    render(<LiveRegion />);
    expect(screen.getByRole('status').tagName).toBe('DIV');
  });
});
