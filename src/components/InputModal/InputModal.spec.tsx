import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialInputModal } from './InputModal';
import { PopupState } from '@/types/popup';

const mockFunction = vi.fn();

describe('Common components - InputModal', () => {
  test('Should render successfully', () => {
    const { baseElement } = render(
      <DialInputModal
        modalState={PopupState.Opened}
        onOpenModal={mockFunction}
        emptyValueText="None"
      >
        <div></div>
      </DialInputModal>,
    );
    expect(baseElement).toBeTruthy();
  });

  test('Should render with empty value successfully', () => {
    const { baseElement } = render(
      <DialInputModal
        modalState={PopupState.Opened}
        onOpenModal={mockFunction}
        selectedValue={''}
        emptyValueText="None"
      >
        <div></div>
      </DialInputModal>,
    );
    expect(baseElement).toBeTruthy();
  });

  test('Should render with a single value successfully', () => {
    const singleValue = 'Single Value';
    render(
      <DialInputModal
        modalState={PopupState.Closed}
        onOpenModal={mockFunction}
        selectedValue={singleValue}
        emptyValueText="None"
      >
        <div></div>
      </DialInputModal>,
    );

    const renderedValue = screen.getByText(singleValue);
    expect(renderedValue).toBeTruthy();
  });

  test('Should render with multiple values successfully', () => {
    const multipleValues = ['Value 1', 'Value 2', 'Value 3'];
    render(
      <DialInputModal
        modalState={PopupState.Closed}
        onOpenModal={mockFunction}
        selectedValue={multipleValues}
        emptyValueText="None"
      >
        <div></div>
      </DialInputModal>,
    );

    multipleValues.forEach((value) => {
      const renderedValue = screen.getByText(value);
      expect(renderedValue).toBeTruthy();
    });
  });

  test('Should not trigger onOpenModal when readonly is true', () => {
    const singleValue = 'Readonly Value';
    render(
      <DialInputModal
        modalState={PopupState.Closed}
        onOpenModal={mockFunction}
        selectedValue={singleValue}
        emptyValueText="None"
        readonly={true}
      >
        <div></div>
      </DialInputModal>,
    );

    const buttonElement = screen.getByRole('button', { name: 'open-popup' });
    fireEvent.click(buttonElement);

    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('Should not trigger onOpenModal when readonly is true with multiple values', () => {
    const multipleValues = ['Value 1', 'Value 2', 'Value 3'];
    render(
      <DialInputModal
        modalState={PopupState.Closed}
        onOpenModal={mockFunction}
        selectedValue={multipleValues}
        emptyValueText="None"
        readonly={true}
      >
        <div></div>
      </DialInputModal>,
    );

    const containerElement = screen.getByText('Value 1').closest('div');
    expect(containerElement).toHaveClass('dial-input-disable');

    fireEvent.click(containerElement!);

    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('Should render errorText when it is set', () => {
    const errorText = 'This is an error';
    render(
      <DialInputModal
        modalState={PopupState.Closed}
        onOpenModal={mockFunction}
        selectedValue="Some Value"
        emptyValueText="None"
        errorText={errorText}
      >
        <div></div>
      </DialInputModal>,
    );

    const renderedErrorText = screen.getByText(errorText);
    expect(renderedErrorText).toBeTruthy();
  });
});
