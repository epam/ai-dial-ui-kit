import { describe, expect, test } from 'vitest';
import { getButtonClassNames } from '../utils';
import { ButtonAppearance, ButtonVariant } from '@/types/button';

describe('getButtonClassNames utility', () => {
  test('return default button - dial-primary-solid-button', () => {
    expect(getButtonClassNames()).toEqual('dial-primary-solid-button');
  });

  test('return neutral button with Outlined appearance - dial-neutral-outlined-button', () => {
    expect(
      getButtonClassNames(ButtonVariant.Neutral, ButtonAppearance.Outlined),
    ).toEqual('dial-neutral-outlined-button');
  });

  test('return default button - dial-primary-solid-button', () => {
    expect(
      getButtonClassNames(ButtonVariant.Neutral, ButtonAppearance.Solid),
    ).toEqual('dial-primary-solid-button');
  });
});
