import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialFormItem } from './FormItem';
import { FormItemOrientation } from '@/types/form-item';

describe('Dial UI Kit :: DialFormItem', () => {
  test('no label -> no aria-labelledby', () => {
    render(
      <DialFormItem elementId="nolabel">
        <input id="nolabel" />
      </DialFormItem>,
    );
    const group = screen.getByRole('group');
    expect(group).not.toHaveAttribute('aria-labelledby');
  });

  test('applies custom className to container', () => {
    render(
      <DialFormItem
        elementId="with-class"
        label="With class"
        className="ring-1"
      >
        <input id="with-class" />
      </DialFormItem>,
    );
    expect(screen.getByRole('group')).toHaveClass('ring-1');
  });

  test('horizontal orientation applies layout classes', () => {
    render(
      <DialFormItem
        elementId="agree"
        label="Agree"
        orientation={FormItemOrientation.Horizontal}
      >
        <input id="agree" type="checkbox" />
      </DialFormItem>,
    );
    const group = screen.getByRole('group');
    expect(group).toHaveClass('flex-row');
    expect(group).toHaveClass('items-end');
  });

  test('shows captionDescription below control', () => {
    render(
      <DialFormItem
        elementId="caption"
        label="Label"
        captionDescription="Helper caption"
      >
        <input id="caption" />
      </DialFormItem>,
    );
    expect(screen.getByText('Helper caption')).toBeInTheDocument();
  });

  test('captionDescription gets error color when error present', () => {
    render(
      <DialFormItem
        elementId="caption-error"
        label="Label"
        captionDescription="Caption text"
        error="Oops"
      >
        <input id="caption-error" />
      </DialFormItem>,
    );
    const caption = screen.getByText('Caption text');
    expect(caption).toHaveClass('text-error');
  });

  test('string error renders alert via DialErrorText and updates aria-describedby', () => {
    render(
      <DialFormItem elementId="age" label="Age" error="Required">
        <input id="age" />
      </DialFormItem>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Required');

    const group = screen.getByRole('group');
    expect(group.getAttribute('aria-describedby')).toContain('age-err');
  });

  test('ReactNode error renders inside alert container', () => {
    render(
      <DialFormItem
        elementId="custom-error"
        label="Label"
        error={
          <span role="contentinfo" aria-label="Custom error">
            Custom error
          </span>
        }
      >
        <input id="custom-error" />
      </DialFormItem>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('contentinfo', { name: 'Custom error' }),
    ).toHaveTextContent('Custom error');
  });

  test('boolean error does not render alert (used only to style caption/field)', () => {
    render(
      <DialFormItem elementId="bool-error" label="Label" error={true}>
        <input id="bool-error" />
      </DialFormItem>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('supports visually hidden label (sr-only on label)', () => {
    render(
      <DialFormItem elementId="hidden" label="Hidden label" labelVisuallyHidden>
        <input id="hidden" />
      </DialFormItem>,
    );
    expect(screen.getByText('Hidden label')).toBeInTheDocument();
  });

  test('renders optional indicator text when provided', () => {
    render(
      <DialFormItem
        elementId="opt"
        label="With optional"
        optional
        optionalText="(optional)"
      >
        <input id="opt" />
      </DialFormItem>,
    );
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });
});
