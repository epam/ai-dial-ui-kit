import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialTextarea } from './Textarea';

describe('Common components :: DialTextarea', () => {
  test('Should render successfully', () => {
    const { baseElement } = render(<DialTextarea textareaId="testArea" />);
    expect(baseElement).toBeTruthy();
  });

  test('Should set string value', () => {
    const res = render(<DialTextarea textareaId="testArea" value="str" />);
    const input = res.getByDisplayValue('str');
    expect(input).toBeTruthy();
    expect(input.id).toBe('testArea');
  });

  test('Should check invalid true', () => {
    const res = render(
      <DialTextarea textareaId="testArea" value="str" invalid={true} />,
    );
    const input = res.getByDisplayValue('str');
    expect(input).toBeTruthy();

    const hasError = input.className.includes('dial-input-error');
    expect(hasError).toBeTruthy();
  });

  test('Should check OnChange', () => {
    let value = 1;
    const onChange = (v: string) => {
      value = Number(v);
    };

    const { baseElement } = render(
      <DialTextarea textareaId="testArea" value={value} onChange={onChange} />,
    );
    const input = baseElement.getElementsByTagName('textarea')[0];

    expect(input).toBeTruthy();
    expect(Number(input.value)).toBe(1);
    fireEvent.change(input, { target: { value: 2 } });
    expect(value).toBe(2);
  });
});
