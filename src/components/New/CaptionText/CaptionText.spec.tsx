import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { LiveRegionPoliteness } from '@/types/live-region';
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Required')).toHaveClass('dial-kit-error-text');
  });

  test('without announce, empty text still renders nothing', () => {
    const { container } = render(<ErrorText text="" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Dial UI Kit :: CaptionText — announce', () => {
  test('ErrorText keeps an assertive region mounted before the error appears', () => {
    const { rerender } = render(
      <ErrorText
        id="submit-error"
        text=""
        announce={LiveRegionPoliteness.Assertive}
      />,
    );
    const region = screen.getByRole('alert');
    expect(region).toHaveAttribute('aria-live', 'assertive');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region).toBeEmptyDOMElement();

    rerender(
      <ErrorText
        id="submit-error"
        text="Could not save"
        announce={LiveRegionPoliteness.Assertive}
      />,
    );
    expect(screen.getByRole('alert')).toBe(region);
    expect(region).toHaveTextContent('Could not save');

    const text = screen.getByText('Could not save');
    expect(text).not.toBe(region);
    expect(text).toHaveAttribute('id', 'submit-error');
    expect(text).toHaveClass('dial-kit-error-text', 'text-error');
  });

  test('CaptionText announces politely and keeps id and className on the text', () => {
    const { rerender } = render(
      <CaptionText announce={LiveRegionPoliteness.Polite} />,
    );
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region.tagName).toBe('SPAN');

    rerender(
      <CaptionText
        id="hint"
        className="extra"
        text="Saved"
        announce={LiveRegionPoliteness.Polite}
      />,
    );
    expect(screen.getByRole('status')).toBe(region);
    const text = screen.getByText('Saved');
    expect(text).toHaveAttribute('id', 'hint');
    expect(text).toHaveClass('extra', 'dial-kit-caption-text');
    expect(region).not.toHaveAttribute('id');
  });

  test('aria-describedby resolves to the announced text', () => {
    render(
      <>
        <input aria-label="Name" aria-describedby="name-error" />
        <ErrorText
          id="name-error"
          text="Required"
          announce={LiveRegionPoliteness.Polite}
        />
      </>,
    );
    expect(
      screen.getByRole('textbox', { name: 'Name' }),
    ).toHaveAccessibleDescription('Required');
  });
});
