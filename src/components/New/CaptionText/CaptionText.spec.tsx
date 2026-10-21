import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { CaptionText, ErrorText } from './CaptionText';

describe('Dial UI Kit :: DialCaptionText', () => {
  test('Should render text when provided', () => {
    render(<CaptionText text="This is an text" />);
    expect(screen.getByText('This is an text')).toBeInTheDocument();
  });

  test('Should render nothing when text is not provided', () => {
    const { container } = render(<CaptionText />);
    expect(container).toBeEmptyDOMElement();
  });

  test('Should pass through span props and merge className', () => {
    render(
      <CaptionText
        text="With extra props"
        className="extra-class"
        aria-label="caption-label"
      />,
    );

    const el = screen.getByText('With extra props');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('With extra props');
    expect(el).toHaveAttribute('aria-label', 'caption-label');
    expect(el.className).toContain('dial-tiny-text');
    expect(el.className).toContain('extra-class');
  });

  test('Should pass through span props and merge className', () => {
    render(
      <CaptionText
        text="With extra props"
        className="extra-class"
        aria-label="caption-label"
      />,
    );

    const el = screen.getByText('With extra props');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('With extra props');
    expect(el).toHaveAttribute('aria-label', 'caption-label');
    expect(el.className).toContain('dial-tiny-text');
    expect(el.className).toContain('extra-class');
  });
});

describe('Dial UI Kit :: CaptionText — semantics', () => {
  test('renders an error without a live-region role', () => {
    render(<ErrorText text="Required" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Required')).toHaveClass('dial-kit-error-text');
  });
});
