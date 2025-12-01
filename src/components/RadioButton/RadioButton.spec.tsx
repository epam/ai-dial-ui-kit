import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialRadioButton } from './RadioButton';

describe('Dial UI Kit :: DialRadioButton', () => {
  test('renders radio with label and attributes', () => {
    render(
      <DialRadioButton
        name="group1"
        value="opt-a"
        inputId="radio-a"
        title="Option A"
      />,
    );
    const radio = screen.getByRole('radio', { name: 'Option A' });
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute('name', 'group1');
    expect(radio).toHaveAttribute('value', 'opt-a');
  });

  test('renders without title when not provided', () => {
    render(<DialRadioButton name="group1" value="opt-x" inputId="radio-x" />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
    expect(screen.queryByLabelText(/.+/)).not.toBeInTheDocument();
  });

  test('applies custom classes', () => {
    render(
      <DialRadioButton
        name="group1"
        value="opt-y"
        inputId="radio-y"
        title="With classes"
        className="custom-input"
        labelClassName="custom-label"
        description="desc text"
        descriptionClassName="custom-desc"
        checked
      />,
    );
    expect(screen.getByRole('radio')).toHaveClass('custom-input');
    expect(screen.getByText('With classes')).toHaveClass('custom-label');
    expect(screen.getByText('desc text')).toHaveClass('custom-desc');
  });

  test('calls onChange with value when changed', () => {
    const onChange = vi.fn();
    render(
      <DialRadioButton
        name="group1"
        value="opt-b"
        inputId="radio-b"
        title="Option B"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Option B' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('opt-b');
  });

  test('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(
      <DialRadioButton
        name="group1"
        value="opt-c"
        inputId="radio-c"
        title="Option C"
        disabled
        onChange={onChange}
      />,
    );
    const radio = screen.getByRole('radio', { name: 'Option C' });
    expect(radio).toBeDisabled();
    fireEvent.click(radio);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders description only when checked', () => {
    const { rerender } = render(
      <DialRadioButton
        name="group1"
        value="opt-d"
        inputId="radio-d"
        title="Option D"
        description="Extra details"
        checked={false}
      />,
    );
    expect(screen.queryByText('Extra details')).not.toBeInTheDocument();

    rerender(
      <DialRadioButton
        name="group1"
        value="opt-d"
        inputId="radio-d"
        title="Option D"
        description="Extra details"
        checked
      />,
    );
    expect(screen.getByText('Extra details')).toBeInTheDocument();
  });

  test('adds aria-describedby when checked and description present', () => {
    render(
      <DialRadioButton
        name="group1"
        value="opt-e"
        inputId="radio-e"
        title="Option E"
        description="Desc"
        checked
      />,
    );
    const radio = screen.getByRole('radio', { name: 'Option E' });
    expect(radio).toHaveAttribute('aria-describedby', 'radio-e-desc');
  });

  test('onChange is not called when already checked radio is clicked again', () => {
    const onChange = vi.fn();
    render(
      <DialRadioButton
        name="group1"
        value="opt-f"
        inputId="radio-f"
        title="Option F"
        checked
        onChange={onChange}
      />,
    );
    const radio = screen.getByRole('radio', { name: 'Option F' });
    fireEvent.click(radio);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not render label when title is missing (null branch)', () => {
    const { container } = render(
      <DialRadioButton name="group1" value="opt-n" inputId="radio-n" />,
    );

    expect(container.querySelector('label')).toBeNull();

    const radio = container.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    expect(radio).toBeInTheDocument();

    // when no title, the input shouldn't get the spacing class
    expect(radio).not.toHaveClass('mr-2');

    // no description relationship when there's no description/checked
    expect(radio).not.toHaveAttribute('aria-describedby');
  });
});
