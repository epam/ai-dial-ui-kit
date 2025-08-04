import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import DialTextAreaField from './TextAreaField';

describe('Dial UI Kit :: DialTextAreaField', () => {
  test('Should render with basic props', () => {
    render(
      <DialTextAreaField fieldTitle="Test Field" elementId="test-textarea" />,
    );

    expect(screen.getByText('Test Field')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Test Field' }),
    ).toBeInTheDocument();
  });

  test('Should call onChange with string value', () => {
    const handleChange = vi.fn();
    render(
      <DialTextAreaField
        fieldTitle="Test Field"
        elementId="test-textarea"
        onChange={handleChange}
      />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Test Field' });
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(handleChange).toHaveBeenCalledWith('New content');
  });

  test('Should apply custom CSS classes', () => {
    render(
      <DialTextAreaField
        fieldTitle="Test Field"
        elementId="test-textarea"
        elementCssClass="custom-class"
      />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Test Field' });
    expect(textarea).toHaveClass('custom-class');
  });
});
