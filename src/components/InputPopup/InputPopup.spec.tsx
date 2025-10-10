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
        <div></div>
      </DialInputPopup>,
    );

    const containerElement = screen.getByText('Value 1').closest('div');
    expect(containerElement).toHaveClass('dial-input-disable');

    fireEvent.click(containerElement!);

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
});
