import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Textarea, TextareaResize } from './Textarea';

describe('Dial UI Kit :: DialTextarea', () => {
  test('Should render successfully', () => {
    const { baseElement } = render(<Textarea id="testArea" />);
    expect(baseElement).toBeTruthy();
  });

  test('Should set string value', () => {
    const res = render(<Textarea id="testArea" value="str" />);
    const input = res.getByDisplayValue('str');
    expect(input).toBeTruthy();
    expect(input.id).toBe('testArea');
  });

  test('Should check invalid true', () => {
    const res = render(<Textarea id="testArea" value="str" invalid={true} />);
    const input = res.getByDisplayValue('str');
    expect(input).toBeTruthy();

    const hasError = input.className.includes('dial-kit-input-error');
    expect(hasError).toBeTruthy();
  });

  test('Should check OnChange', () => {
    let value = 1;
    const onChange = (v: string) => {
      value = Number(v);
    };

    const { baseElement } = render(
      <Textarea id="testArea" value={value} onChange={onChange} />,
    );
    const input = baseElement.getElementsByTagName('textarea')[0];

    expect(input).toBeTruthy();
    expect(Number(input.value)).toBe(1);
    fireEvent.change(input, { target: { value: 2 } });
    expect(value).toBe(2);
  });

  test('Should default to non-resizable', () => {
    const res = render(<Textarea id="testArea" />);
    const input = res.getByRole('textbox');
    expect(input.className).toContain('resize-none');
  });

  test('Should resize both directions when resize is true', () => {
    const res = render(<Textarea id="testArea" resize={true} />);
    const input = res.getByRole('textbox');
    expect(input.className).toContain('resize');
    expect(input.className).not.toContain('resize-none');
    expect(input.className).not.toContain('resize-x');
    expect(input.className).not.toContain('resize-y');
  });

  test('Should resize only horizontally when resize is TextareaResize.Horizontal', () => {
    const res = render(
      <Textarea id="testArea" resize={TextareaResize.Horizontal} />,
    );
    const input = res.getByRole('textbox');
    expect(input.className).toContain('resize-x');
  });

  test('Should resize only vertically when resize is TextareaResize.Vertical', () => {
    const res = render(
      <Textarea id="testArea" resize={TextareaResize.Vertical} />,
    );
    const input = res.getByRole('textbox');
    expect(input.className).toContain('resize-y');
  });
});
