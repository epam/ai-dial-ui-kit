import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { LabelledText } from './LabelledText';

describe('Dial UI Kit :: LabelledText', () => {
  test('exposes the text as the definition of the label term', () => {
    render(<LabelledText label="Endpoint" text="https://example.com" />);

    expect(screen.getByRole('term')).toHaveTextContent('Endpoint');
    expect(screen.getByRole('definition')).toHaveTextContent(
      'https://example.com',
    );
  });

  test('renders children instead of text', () => {
    render(
      <LabelledText label="Status" text="ignored">
        <span>Custom content</span>
      </LabelledText>,
    );

    const definition = screen.getByRole('definition');
    expect(within(definition).getByText('Custom content')).toBeInTheDocument();
    expect(within(definition).queryByText('ignored')).not.toBeInTheDocument();
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
      within(screen.getByRole('definition')).getByRole('button', {
        name: 'Copy key',
      }),
    ).toBeInTheDocument();
  });

  test('renders no definition when there is no value', () => {
    render(<LabelledText label="Empty" />);

    expect(screen.getByRole('term')).toHaveTextContent('Empty');
    expect(screen.queryByRole('definition')).not.toBeInTheDocument();
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
