import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialRadioGroupPopupField } from './RadioGroupPopupField';

const radioButtons = [
  { id: 'opt-1', name: 'Option 1' },
  { id: 'opt-2', name: 'Option 2' },
  { id: 'opt-3', name: 'Option 3' },
];

describe('Dial UI Kit :: DialRadioGroupPopupField', () => {
  test('renders label and empty value text', () => {
    render(
      <DialRadioGroupPopupField
        label="Group"
        htmlFor="group"
        header="Choose an option"
        emptyValueText="None"
        radioButtons={radioButtons}
        selectedRadioValue="opt-1"
        onChangeRadioField={() => null}
        id="group-id"
        isValid={true}
        onApply={() => null}
      />,
    );

    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  test('shows custom input value when provided', () => {
    render(
      <DialRadioGroupPopupField
        label="Custom"
        htmlFor="custom"
        header="Choose"
        emptyValueText="None"
        customInputValue="Custom Value"
        radioButtons={radioButtons}
        selectedRadioValue="opt-2"
        onChangeRadioField={() => null}
        id="custom-id"
        isValid={true}
        onApply={() => null}
      />,
    );

    expect(screen.getByText('Custom Value')).toBeInTheDocument();
  });

  test('opens popup on trigger click (not readonly) and renders title', () => {
    render(
      <DialRadioGroupPopupField
        label="Group"
        htmlFor="group"
        header="Select one"
        emptyValueText="None"
        radioButtons={radioButtons}
        selectedRadioValue="opt-1"
        onChangeRadioField={() => null}
        id="group-id"
        isValid={true}
        onApply={() => null}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'open-popup' });
    fireEvent.click(trigger);

    expect(screen.getByText('Select one')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  test('does not open when disabled is true', () => {
    render(
      <DialRadioGroupPopupField
        label="Disabled"
        htmlFor="disabled"
        header="Hidden dialog"
        emptyValueText="None"
        radioButtons={radioButtons}
        selectedRadioValue="opt-1"
        onChangeRadioField={() => null}
        id="readonly-id"
        isValid={true}
        onApply={() => null}
        disabled={true}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'open-popup' });
    fireEvent.click(trigger);

    expect(screen.queryByText('Hidden dialog')).not.toBeInTheDocument();
  });

  test('clicking Cancel closes and calls onClose', () => {
    const onClose = vi.fn();

    render(
      <DialRadioGroupPopupField
        label="Group"
        htmlFor="group"
        header="Select"
        emptyValueText="None"
        radioButtons={radioButtons}
        selectedRadioValue="opt-1"
        onChangeRadioField={() => null}
        id="group-id"
        isValid={true}
        onApply={() => null}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'open-popup' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('clicking Apply calls onApply and then onClose', () => {
    const onApply = vi.fn();
    const onClose = vi.fn();

    render(
      <DialRadioGroupPopupField
        label="Group"
        htmlFor="group"
        header="Select"
        emptyValueText="None"
        radioButtons={radioButtons}
        selectedRadioValue="opt-2"
        onChangeRadioField={() => null}
        id="group-id"
        isValid={true}
        onApply={onApply}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'open-popup' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
