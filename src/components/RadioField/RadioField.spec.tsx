import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialRadioField } from './RadioField';
import { RadioFieldOrientation } from '@/types/radioField';

const radios = [
  { id: 'none', name: '— None —' },
  { id: 'all', name: 'All attachments' },
];

describe('Dial UI Kit :: DialRadioField', () => {
  test('renders field title via DialField and radios', () => {
    render(
      <DialRadioField
        fieldTitle="Attachments"
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioFieldOrientation.Row}
        onChange={() => null}
      />,
    );

    expect(screen.getByText('Attachments')).toBeInTheDocument();

    const group = screen.getByRole('radiogroup', { name: 'Attachments' });
    expect(group).toBeInTheDocument();

    const radioNone = screen.getByRole('radio', { name: '— None —' });
    const radioAll = screen.getByRole('radio', { name: 'All attachments' });
    expect(radioNone).toBeChecked();
    expect(radioAll).not.toBeChecked();
  });

  test('applies orientation classes', () => {
    const { rerender } = render(
      <DialRadioField
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioFieldOrientation.Row}
        onChange={() => null}
      />,
    );

    const wrapper = screen.getByTestId('radiofield-options');
    expect(wrapper).toHaveClass('flex-row');
    expect(wrapper).toHaveClass('gap-x-6');

    rerender(
      <DialRadioField
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioFieldOrientation.Column}
        onChange={() => null}
      />,
    );
    expect(wrapper).toHaveClass('flex-col');
    expect(wrapper).toHaveClass('gap-y-3');
  });

  test('forwards disabled state to children', () => {
    render(
      <DialRadioField
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioFieldOrientation.Row}
        disabled
        onChange={() => null}
      />,
    );

    const group = screen.getByRole('radiogroup');
    const withinGroup = within(group);
    expect(withinGroup.getByRole('radio', { name: '— None —' })).toBeDisabled();
    expect(
      withinGroup.getByRole('radio', { name: 'All attachments' }),
    ).toBeDisabled();
  });

  test('emits onChange with clicked radio id', () => {
    const onChange = vi.fn();
    render(
      <DialRadioField
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioFieldOrientation.Row}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'All attachments' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('all');
  });

  test('passes radioCssClass to inputs', () => {
    render(
      <DialRadioField
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioFieldOrientation.Row}
        radioCssClass="ring-1"
        onChange={() => null}
      />,
    );
    expect(screen.getAllByRole('radio')[0]).toHaveClass('ring-1');
  });
});
