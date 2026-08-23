import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Label } from './Label';

describe('Dial UI Kit :: Label', () => {
  test('Should render with label and be accessible by htmlFor', () => {
    render(
      <>
        <Label label="Email Address" htmlFor="email-input" />
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
    const { container } = render(<Label htmlFor="test-input" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should display optional text when optional is true', () => {
    render(<Label label="Optional Field" htmlFor="optional-input" required />);
    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('Should not display optional text when optional is false', () => {
    render(
      <Label
        label="Required Field"
        htmlFor="required-input"
        required={false}
      />,
    );
    expect(screen.getByText('Required Field')).toBeInTheDocument();
  });

  test('Should apply custom CSS class', () => {
    render(
      <Label
        label="Styled Field"
        htmlFor="styled-input"
        className="custom-label-class"
      />,
    );
    const label = screen.getByText('Styled Field').closest('label');
    expect(label).toHaveClass('custom-label-class');
  });

  test('Should apply default CSS classes', () => {
    render(<Label label="Default Field" htmlFor="default-input" />);
    const label = screen.getByText('Default Field').closest('label');
    expect(label).toHaveClass('dial-tiny-semi-text', 'text-secondary');
  });

  test('Should handle empty label string', () => {
    const { container } = render(<Label label="" htmlFor="empty-input" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should work with optional field', () => {
    render(
      <Label
        label="Full Featured"
        htmlFor="full-input"
        required
        className="special-label"
      />,
    );

    const label = screen.getByText('Full Featured').closest('label');
    expect(label).toHaveClass(
      'special-label',
      'dial-tiny-semi-text',
      'text-secondary',
    );
    expect(screen.getByText('Full Featured')).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'full-input');
  });

  test('returns null when label is an empty string', () => {
    const { container } = render(<Label htmlFor="email-input" label="" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should announce the requirement instead of a bare asterisk', () => {
    render(
      <>
        <Label label="Phone Number" htmlFor="phone-input" required />
        <input id="phone-input" type="text" />
      </>,
    );

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox')).toHaveAccessibleName(
      'Phone Number (required)',
    );
  });

  test('Should name the caption info button', () => {
    render(
      <Label
        label="Phone Number"
        htmlFor="phone-input"
        caption="Digits only"
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Digits only');
  });

  test('Should render no info button without a caption', () => {
    render(<Label label="Phone Number" htmlFor="phone-input" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('Should keep the info button outside the label element', () => {
    render(
      <>
        <Label
          label="Phone Number"
          htmlFor="phone-input"
          caption="Digits only"
        />
        <input id="phone-input" type="text" />
      </>,
    );

    const label = screen.getByText('Phone Number').closest('label');
    expect(label).not.toContainElement(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Phone Number');
  });

  test('Should apply containerClassName to the wrapper, not to the label', () => {
    render(
      <Label
        label="Shrinking Field"
        htmlFor="shrinking-input"
        containerClassName="min-w-0 flex-1"
      />,
    );

    const label = screen.getByText('Shrinking Field').closest('label');

    expect(label).not.toHaveClass('flex-1');
    expect(label?.parentElement).toHaveClass('min-w-0', 'flex-1');
  });

  test('Should not leak containerClassName onto the label element', () => {
    render(
      <Label
        label="Attribute Field"
        htmlFor="attribute-input"
        containerClassName="flex-1"
      />,
    );

    const label = screen.getByText('Attribute Field').closest('label');

    expect(label).not.toHaveAttribute('containerClassName');
  });
});
