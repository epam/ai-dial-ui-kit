import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialInputPopup } from './InputPopup';

const mockFunction = vi.fn();

describe('Dial UI Kit :: DialInputPopup', () => {
  test('Should render successfully', () => {
    render(
      <DialInputPopup open onOpen={mockFunction} emptyValueText="None">
        <div>Modal Content</div>
      </DialInputPopup>,
    );

    const modalContent = screen.getByText('Modal Content');
    expect(modalContent).toBeInTheDocument();

    const emptyValueText = screen.getByText('None');
    expect(emptyValueText).toBeInTheDocument();
  });

  test('Should render with empty value successfully', () => {
    render(
      <DialInputPopup
        open
        onOpen={mockFunction}
        selectedValue={''}
        emptyValueText="None"
      >
        <div>Modal Content</div>
      </DialInputPopup>,
    );

    const modalContent = screen.getByText('Modal Content');
    expect(modalContent).toBeInTheDocument();

    const emptyValueText = screen.getByText('None');
    expect(emptyValueText).toBeInTheDocument();
  });

  test('Should render with a single value successfully', () => {
    const singleValue = 'Single Value';
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue={singleValue}
        emptyValueText="None"
      >
        <div></div>
      </DialInputPopup>,
    );

    const renderedValue = screen.getByText(singleValue);
    expect(renderedValue).toBeTruthy();
  });

  test('Should render with multiple values successfully', () => {
    const multipleValues = ['Value 1', 'Value 2', 'Value 3'];
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue={multipleValues}
        emptyValueText="None"
      >
        <div></div>
      </DialInputPopup>,
    );

    multipleValues.forEach((value) => {
      const renderedValue = screen.getByText(value);
      expect(renderedValue).toBeTruthy();
    });
  });

  test('Should not trigger onOpenModal when disabled is true', () => {
    const singleValue = 'Disabled Value';
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue={singleValue}
        emptyValueText="None"
        disabled={true}
      >
        <div></div>
      </DialInputPopup>,
    );

    const buttonElement = screen.getByRole('button', { name: 'open-popup' });
    fireEvent.click(buttonElement);

    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('Should not trigger onOpenModal when disabled is true with multiple values', () => {
    const multipleValues = ['Value 1', 'Value 2', 'Value 3'];
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue={multipleValues}
        emptyValueText="None"
        disabled={true}
      >
        <div />
      </DialInputPopup>,
    );

    fireEvent.click(screen.getByText('Value 1'));

    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('Should render errorText when it is set', () => {
    const errorText = 'This is an error';
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue="Some Value"
        emptyValueText="None"
        errorText={errorText}
      >
        <div></div>
      </DialInputPopup>,
    );

    const renderedErrorText = screen.getByText(errorText);
    expect(renderedErrorText).toBeTruthy();
  });

  // --- Editable mode tests ---

  test('Should render an editable input when editable is true', () => {
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue="Editable Value"
        emptyValueText="None"
        editable
      >
        <div></div>
      </DialInputPopup>,
    );

    const input = screen.getByRole('textbox', { name: 'input-popup-field' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Editable Value');
  });

  test('Should call onValueChange when user types in editable mode', () => {
    const onValueChange = vi.fn();
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue=""
        emptyValueText="None"
        editable
        onValueChange={onValueChange}
      >
        <div></div>
      </DialInputPopup>,
    );

    const input = screen.getByRole('textbox', { name: 'input-popup-field' });
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(onValueChange).toHaveBeenCalledWith('Hello');
  });

  test('Should only open popup via icon click in editable mode', () => {
    const onOpen = vi.fn();
    render(
      <DialInputPopup
        onOpen={onOpen}
        selectedValue="Test"
        emptyValueText="None"
        editable
      >
        <div>Popup Content</div>
      </DialInputPopup>,
    );

    // Clicking the input should NOT trigger onOpen
    const input = screen.getByRole('textbox', { name: 'input-popup-field' });
    fireEvent.click(input);
    expect(onOpen).not.toHaveBeenCalled();

    // Clicking the icon button should trigger onOpen
    const iconButton = screen.getByRole('button', { name: 'open-popup' });
    fireEvent.click(iconButton);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('Should disable the editable input when disabled is true', () => {
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue="Disabled"
        emptyValueText="None"
        editable
        disabled
      >
        <div></div>
      </DialInputPopup>,
    );

    const input = screen.getByRole('textbox', { name: 'input-popup-field' });
    expect(input).toBeDisabled();
  });

  test('Should show placeholder in editable mode when no value', () => {
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue=""
        placeholder="Type here..."
        editable
      >
        <div></div>
      </DialInputPopup>,
    );

    const input = screen.getByRole('textbox', { name: 'input-popup-field' });
    expect(input).toHaveAttribute('placeholder', 'Type here...');
  });

  test('Should show errorText in editable mode', () => {
    const errorText = 'Field is required';
    render(
      <DialInputPopup
        onOpen={mockFunction}
        selectedValue=""
        emptyValueText="None"
        editable
        errorText={errorText}
      >
        <div></div>
      </DialInputPopup>,
    );

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });
});
