import { afterEach, describe, expect, test, vi } from 'vitest';
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

  describe('Inverted', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('return inverted link button with Link appearance - dial-kit-inverted-link-button', () => {
      expect(
        getButtonClassNames(ButtonVariant.Inverted, ButtonAppearance.Link),
      ).toEqual('dial-kit-inverted-link-button');
    });

    test('warn and fall back to primary solid for an unsupported appearance', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(
        getButtonClassNames(ButtonVariant.Inverted, ButtonAppearance.Solid),
      ).toEqual('dial-kit-primary-solid-button');
      expect(warn).toHaveBeenCalledOnce();
    });
  });
});
