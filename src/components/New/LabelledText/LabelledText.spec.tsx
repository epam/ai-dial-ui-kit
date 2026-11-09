import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { LabelledText } from './LabelledText';

describe('Dial UI Kit :: LabelledText', () => {
  test('renders the label and the text', () => {
    render(<LabelledText label="Endpoint" text="https://example.com" />);

    expect(screen.getByText('Endpoint')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  test('renders children instead of text', () => {
    render(
      <LabelledText label="Status" text="ignored">
        <span>Custom content</span>
      </LabelledText>,
    );

    expect(screen.getByText('Custom content')).toBeInTheDocument();
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });

  test('renders the postfix beside the text', () => {
    render(
      <LabelledText
        label="Key"
        text="sk-0000"
        postfix={<button type="button">Copy key</button>}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Copy key' }),
    ).toBeInTheDocument();
  });

  test('renders only the label when there is no value', () => {
    const { container } = render(<LabelledText label="Empty" />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  test('caps the width of a plain value but not of custom content', () => {
    const { container, rerender } = render(
      <LabelledText label="A" text="value" />,
    );
    expect(container.firstElementChild).toHaveClass('max-w-[200px]');

    rerender(
      <LabelledText label="A">
        <span>value</span>
      </LabelledText>,
    );
    expect(container.firstElementChild).not.toHaveClass('max-w-[200px]');
  });

  test('merges className and stamps the public class on the root', () => {
    const { container } = render(
      <LabelledText label="A" text="value" className="custom" />,
    );

    expect(container.firstElementChild).toHaveClass(
      'custom',
      DIAL_KIT_CLASS.labelledText,
    );
  });
});
