import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialLabel } from './Label';

describe('Dial UI Kit :: DialFieldLabel', () => {
  test('Should render with fieldLabel and be accessible by htmlFor', () => {
    render(
      <>
        <DialLabel fieldLabel="Email Address" htmlFor="email-input" />
        <input id="email-input" type="text" />
      </>,
    );
    const input = screen.getByLabelText('Email Address');
    const labelElement = screen.getByText('Email Address').closest('label');
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'email-input');
  });

  test('Should not render when fieldLabel is not provided', () => {
    const { container } = render(<DialLabel htmlFor="test-input" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should display optional text when optional is true', () => {
    render(
      <DialLabel
        fieldLabel="Optional Field"
        htmlFor="optional-input"
        required
      />,
    );
    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  test('Should not display optional text when optional is false', () => {
    render(
      <DialLabel
        fieldLabel="Required Field"
        htmlFor="required-input"
        required={false}
      />,
    );
    expect(screen.getByText('Required Field')).toBeInTheDocument();
    expect(screen.queryByText('(Optional)')).not.toBeInTheDocument();
  });

  test('Should apply custom CSS class', () => {
    render(
      <DialLabel
        fieldLabel="Styled Field"
        htmlFor="styled-input"
        className="custom-label-class"
      />,
    );
    const label = screen.getByText('Styled Field').closest('label');
    expect(label).toHaveClass('custom-label-class');
  });

  test('Should apply default CSS classes', () => {
    render(<DialLabel fieldLabel="Default Field" htmlFor="default-input" />);
    const label = screen.getByText('Default Field').closest('label');
    expect(label).toHaveClass('dial-tiny', 'text-secondary');
  });

  test('Should apply default mb-2 class when className does not include mb', () => {
    render(
      <DialLabel
        fieldLabel="Default Margin"
        htmlFor="margin-input"
        className="custom-class"
      />,
    );
    const label = screen.getByText('Default Margin').closest('label');
    expect(label).toHaveClass('mb-2');
  });

  test('Should not apply mb-2 when className includes mb', () => {
    render(
      <DialLabel
        fieldLabel="Custom Margin"
        htmlFor="custom-margin-input"
        className="mb-4 custom-class"
      />,
    );
    const label = screen.getByText('Custom Margin').closest('label');
    expect(label).toHaveClass('mb-4');
    expect(label).not.toHaveClass('mb-2');
  });

  test('Should handle empty fieldLabel string', () => {
    const { container } = render(
      <DialLabel fieldLabel="" htmlFor="empty-input" />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('Should work with optional field', () => {
    render(
      <DialLabel
        fieldLabel="Full Featured"
        htmlFor="full-input"
        required
        className="special-label"
      />,
    );

    const label = screen.getByText('Full Featured').closest('label');
    expect(label).toHaveClass('special-label', 'dial-tiny', 'text-secondary');
    expect(screen.getByText('Full Featured')).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'full-input');
  });

  test('returns null when fieldLabel is an empty string', () => {
    const { container } = render(
      <DialLabel htmlFor="email-input" fieldLabel="" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
