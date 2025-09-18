import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialFieldLabel } from './Field';

describe('Dial UI Kit :: DialFieldLabel', () => {
  test('Should render with fieldTitle and be accessible by htmlFor', () => {
    render(
      <>
        <DialFieldLabel fieldTitle="Email Address" htmlFor="email-input" />
        <input id="email-input" type="text" />
      </>,
    );
    const input = screen.getByLabelText('Email Address');
    const labelElement = screen.getByText('Email Address').closest('label');
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'email-input');
  });

  test('Should not render when fieldTitle is not provided', () => {
    const { container } = render(<DialFieldLabel htmlFor="test-input" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should display optional text when optional is true', () => {
    render(
      <DialFieldLabel
        fieldTitle="Optional Field"
        htmlFor="optional-input"
        optional
      />,
    );
    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  test('Should display custom optionalText when provided', () => {
    render(
      <DialFieldLabel
        fieldTitle="Custom Optional"
        htmlFor="custom-input"
        optional
        optionalText="(Not required)"
      />,
    );
    expect(screen.getByText('Custom Optional')).toBeInTheDocument();
    expect(screen.getByText('(Not required)')).toBeInTheDocument();
  });

  test('Should not display optional text when optional is false', () => {
    render(
      <DialFieldLabel
        fieldTitle="Required Field"
        htmlFor="required-input"
        optional={false}
      />,
    );
    expect(screen.getByText('Required Field')).toBeInTheDocument();
    expect(screen.queryByText('(Optional)')).not.toBeInTheDocument();
  });

  test('Should apply custom CSS class', () => {
    render(
      <DialFieldLabel
        fieldTitle="Styled Field"
        htmlFor="styled-input"
        cssClass="custom-label-class"
      />,
    );
    const label = screen.getByText('Styled Field').closest('label');
    expect(label).toHaveClass('custom-label-class');
  });

  test('Should apply default CSS classes', () => {
    render(
      <DialFieldLabel fieldTitle="Default Field" htmlFor="default-input" />,
    );
    const label = screen.getByText('Default Field').closest('label');
    expect(label).toHaveClass('dial-tiny', 'text-secondary');
  });

  test('Should apply default mb-2 class when cssClass does not include mb', () => {
    render(
      <DialFieldLabel
        fieldTitle="Default Margin"
        htmlFor="margin-input"
        cssClass="custom-class"
      />,
    );
    const label = screen.getByText('Default Margin').closest('label');
    expect(label).toHaveClass('mb-2');
  });

  test('Should not apply mb-2 when cssClass includes mb', () => {
    render(
      <DialFieldLabel
        fieldTitle="Custom Margin"
        htmlFor="custom-margin-input"
        cssClass="mb-4 custom-class"
      />,
    );
    const label = screen.getByText('Custom Margin').closest('label');
    expect(label).toHaveClass('mb-4');
    expect(label).not.toHaveClass('mb-2');
  });

  test('Should handle empty fieldTitle string', () => {
    const { container } = render(
      <DialFieldLabel fieldTitle="" htmlFor="empty-input" />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('Should work with both optional and custom optionalText', () => {
    render(
      <DialFieldLabel
        fieldTitle="Full Featured"
        htmlFor="full-input"
        optional
        optionalText="(Choose if needed)"
        cssClass="special-label"
      />,
    );

    const label = screen.getByText('Full Featured').closest('label');
    expect(label).toHaveClass('special-label', 'dial-tiny', 'text-secondary');
    expect(screen.getByText('Full Featured')).toBeInTheDocument();
    expect(screen.getByText('(Choose if needed)')).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'full-input');
  });
});
