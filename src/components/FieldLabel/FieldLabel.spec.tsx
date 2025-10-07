import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialFieldLabel } from './FieldLabel';

describe('Dial UI Kit :: FieldLabel', () => {
  it('renders label and text', () => {
    render(<DialFieldLabel label="Test Label" text="Test Text" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders children instead of text if provided', () => {
    render(
      <DialFieldLabel
        label="Child Label"
        content={<span>Child Content</span>}
      />,
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
    expect(screen.getByText('Child Label')).toBeInTheDocument();
  });

  it('renders copy button if copyButton is true', () => {
    render(
      <DialFieldLabel
        label="Copy Label"
        text="Copy Text"
        contentAfterText={<span>copy</span>}
      />,
    );
    expect(screen.getByLabelText('copy')).toBeInTheDocument();
  });

  it('renders without text', () => {
    render(<DialFieldLabel label="No Text" />);
    expect(screen.getByText('No Text')).toBeInTheDocument();
  });
});
