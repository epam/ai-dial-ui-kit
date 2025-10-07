import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialLabelledText } from './LabelledText';

describe('Dial UI Kit :: FieldLabel', () => {
  it('renders label and text', () => {
    render(<DialLabelledText label="Test Label" text="Test Text" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders children instead of text if provided', () => {
    render(
      <DialLabelledText label="Child Label">
        <span>Child Content</span>
      </DialLabelledText>,
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
    expect(screen.getByText('Child Label')).toBeInTheDocument();
  });

  it('renders copy button if copyButton is true', () => {
    render(
      <DialLabelledText
        label="Copy Label"
        text="Copy Text"
        postfix={<span>copy</span>}
      />,
    );
    expect(screen.getByText('copy')).toBeInTheDocument();
  });

  it('renders without text', () => {
    render(<DialLabelledText label="No Text" />);
    expect(screen.getByText('No Text')).toBeInTheDocument();
  });
});
