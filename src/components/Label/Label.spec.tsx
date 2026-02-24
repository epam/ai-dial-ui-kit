import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialLabel } from './Label';

describe('Dial UI Kit :: DialLabel', () => {
  test('Should render with label and be accessible by htmlFor', () => {
    render(
      <>
        <DialLabel label="Email Address" htmlFor="email-input" />
        <input id="email-input" type="text" />
      </>,
    );
    const input = screen.getByLabelText('Email Address');
    const labelElement = screen.getByText('Email Address').closest('label');
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'email-input');
  });

  test('Should not render when label is not provided', () => {
    const { container } = render(<DialLabel htmlFor="test-input" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should display optional text when optional is true', () => {
    render(
      <DialLabel label="Optional Field" htmlFor="optional-input" required />,
    );
    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('Should not display optional text when optional is false', () => {
    render(
      <DialLabel
        label="Required Field"
        htmlFor="required-input"
        required={false}
      />,
    );
    expect(screen.getByText('Required Field')).toBeInTheDocument();
  });

  test('Should apply custom CSS class', () => {
    render(
      <DialLabel
        label="Styled Field"
        htmlFor="styled-input"
        className="custom-label-class"
      />,
    );
    const label = screen.getByText('Styled Field').closest('label');
    expect(label).toHaveClass('custom-label-class');
  });

  test('Should apply default CSS classes', () => {
    render(<DialLabel label="Default Field" htmlFor="default-input" />);
    const label = screen.getByText('Default Field').closest('label');
    expect(label).toHaveClass('dial-tiny-text', 'text-secondary');
  });

  test('Should handle empty label string', () => {
    const { container } = render(<DialLabel label="" htmlFor="empty-input" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should work with optional field', () => {
    render(
      <DialLabel
        label="Full Featured"
        htmlFor="full-input"
        required
        className="special-label"
      />,
    );

    const label = screen.getByText('Full Featured').closest('label');
    expect(label).toHaveClass(
      'special-label',
      'dial-tiny-text',
      'text-secondary',
    );
    expect(screen.getByText('Full Featured')).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'full-input');
  });

  test('returns null when label is an empty string', () => {
    const { container } = render(<DialLabel htmlFor="email-input" label="" />);
    expect(container.firstChild).toBeNull();
  });
});
