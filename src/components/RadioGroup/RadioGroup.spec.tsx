import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialRadioGroup } from './RadioGroup';
import { RadioGroupOrientation } from '@/types/radio-group';

const radios = [
  { id: 'none', name: '— None —', content: <div>No extras</div> },
  {
    id: 'all',
    name: 'All attachments',
    content: <div>Everything included</div>,
  },
];

describe('Dial UI Kit :: DialRadioGroup', () => {
  test('renders radiogroup with accessible name and radios', () => {
    render(
      <DialRadioGroup
        fieldTitle="Attachments"
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        onChange={() => null}
      />,
    );

    const group = screen.getByRole('radiogroup', { name: 'Attachments' });
    expect(group).toBeInTheDocument();

    expect(screen.getByRole('radio', { name: '— None —' })).toBeChecked();
    expect(
      screen.getByRole('radio', { name: 'All attachments' }),
    ).not.toBeChecked();
  });

  test('fires onChange with selected id', () => {
    const onChange = vi.fn();
    render(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'All attachments' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('all');
  });

  test('applies orientation classes', () => {
    const { rerender } = render(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        onChange={() => null}
      />,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveClass('flex-row');
    expect(group).toHaveClass('gap-x-4');

    rerender(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Column}
        onChange={() => null}
      />,
    );
    expect(group).toHaveClass('flex-col');
    expect(group).toHaveClass('gap-y-2');
  });

  test('shows content only for active radio', () => {
    const { rerender } = render(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        onChange={() => null}
      />,
    );
    expect(screen.getByText('No extras')).toBeInTheDocument();
    expect(screen.queryByText('Everything included')).not.toBeInTheDocument();

    rerender(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="all"
        orientation={RadioGroupOrientation.Row}
        onChange={() => null}
      />,
    );
    expect(screen.getByText('Everything included')).toBeInTheDocument();
    expect(screen.queryByText('No extras')).not.toBeInTheDocument();
  });

  test('forwards css classes to input and label', () => {
    render(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        radioClassName="ring-1"
        labelClassName="text-primary font-medium"
        onChange={() => null}
      />,
    );
    const radio = screen.getByRole('radio', { name: '— None —' });
    expect(radio).toHaveClass('ring-1');

    // The label element contains the text content
    const label = screen.getByText('— None —');
    expect(label).toHaveClass('text-primary');
    expect(label).toHaveClass('font-medium');
  });

  test('forwards disabled state to children', () => {
    render(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radios}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        disabled
        onChange={() => null}
      />,
    );
    expect(screen.getByRole('radio', { name: '— None —' })).toBeDisabled();
    expect(
      screen.getByRole('radio', { name: 'All attachments' }),
    ).toBeDisabled();
  });

  test('caption is rendered when provided', () => {
    const radiosWithCaption = [
      { id: 'none', name: '— None —', caption: 'caption 1' },
      {
        id: 'all',
        name: 'All attachments',
        caption: 'caption',
      },
    ];
    render(
      <DialRadioGroup
        elementId="attachments"
        radioButtons={radiosWithCaption}
        activeRadioButton="none"
        orientation={RadioGroupOrientation.Row}
        disabled
        onChange={() => null}
      />,
    );
    const caption = screen.getByText('caption');
    const caption1 = screen.getByText('caption 1');
    expect(caption).toBeInTheDocument();
    expect(caption1).toBeInTheDocument();
  });
});
