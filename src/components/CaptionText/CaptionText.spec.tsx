import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { DialCaptionText } from './CaptionText';

describe('Dial UI Kit :: DialCaptionText', () => {
  test('Should render text when provided', () => {
    render(<DialCaptionText text="This is an text" />);
    expect(screen.getByText('This is an text')).toBeInTheDocument();
  });

  test('Should render nothing when text is not provided', () => {
    const { container } = render(<DialCaptionText />);
    expect(container).toBeEmptyDOMElement();
  });

  test('Should pass through span props and merge className', () => {
    render(
      <DialCaptionText
        text="With extra props"
        className="extra-class"
        aria-label="caption-label"
      />,
    );

    const el = screen.getByText('With extra props');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('With extra props');
    expect(el).toHaveAttribute('aria-label', 'caption-label');
    expect(el.className).toContain('text-error');
    expect(el.className).toContain('dial-tiny-text');
    expect(el.className).toContain('mt-1');
    expect(el.className).toContain('extra-class');
  });

  test('Should pass through span props and merge className', () => {
    render(
      <DialCaptionText
        text="With extra props"
        className="extra-class"
        aria-label="caption-label"
      />,
    );

    const el = screen.getByText('With extra props');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('With extra props');
    expect(el).toHaveAttribute('aria-label', 'caption-label');
    expect(el.className).toContain('text-error');
    expect(el.className).toContain('dial-tiny-text');
    expect(el.className).toContain('mt-1');
    expect(el.className).toContain('extra-class');
  });
});
