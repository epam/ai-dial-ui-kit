import { describe, expect, test } from 'vitest';
import { getButtonClassNames } from '../utils';
import { ButtonAppearance, ButtonVariant } from '@/types/button';

describe('getButtonClassNames utility', () => {
  test('return default button - dial-primary-solid-button', () => {
    expect(getButtonClassNames()).toEqual('dial-kit-primary-solid-button');
  });

  test('return neutral button with Outlined appearance - dial-neutral-outlined-button', () => {
    expect(
      getButtonClassNames(ButtonVariant.Neutral, ButtonAppearance.Outlined),
    ).toEqual('dial-kit-neutral-outlined-button');
  });

  test('return default button - dial-primary-solid-button', () => {
    expect(
      getButtonClassNames(ButtonVariant.Neutral, ButtonAppearance.Solid),
    ).toEqual('dial-kit-neutral-solid-button');
  });
});
