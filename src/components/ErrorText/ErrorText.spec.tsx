import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { DialErrorText } from './ErrorText';

describe('Dial UI Kit :: ErrorText', () => {
  test('Should render error text when provided', () => {
    render(<DialErrorText errorText="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  test('Should render nothing when errorText is not provided', () => {
    const { container } = render(<DialErrorText />);
    expect(container).toBeEmptyDOMElement();
  });

  test('Should pass through span props and merge className', () => {
    render(
      <DialErrorText
        errorText="With extra props"
        className="extra-class"
        aria-label="error-label"
        data-testid="error-text"
      />,
    );

    const el = screen.getByTestId('error-text');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('With extra props');
    expect(el).toHaveAttribute('aria-label', 'error-label');
    expect(el.className).toContain('text-error');
    expect(el.className).toContain('dial-tiny');
    expect(el.className).toContain('mt-1');
    expect(el.className).toContain('extra-class');
  });

  test('Should pass through span props and merge className', () => {
    render(
      <DialErrorText
        errorText="With extra props"
        className="extra-class"
        aria-label="error-label"
        data-testid="error-text"
      />,
    );

    const el = screen.getByTestId('error-text');

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('With extra props');
    expect(el).toHaveAttribute('aria-label', 'error-label');
    expect(el.className).toContain('text-error');
    expect(el.className).toContain('dial-tiny');
    expect(el.className).toContain('mt-1');
    expect(el.className).toContain('extra-class');
  });
});
