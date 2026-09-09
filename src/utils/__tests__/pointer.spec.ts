import { afterEach, describe, expect, test, vi } from 'vitest';

import { hasNoHoverSupport, NO_HOVER_MEDIA_QUERY } from '@/utils/pointer';

/*
 * jsdom ships no `matchMedia`, so each test installs the answer it wants and
 * removes it again afterwards.
 */
const setMatchMedia = (value: typeof window.matchMedia | undefined) =>
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value,
  });

const stubMatchMedia = (matches: boolean) => {
  const matchMedia = vi.fn((media: string) => ({
    matches,
    media,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  setMatchMedia(matchMedia);

  return matchMedia;
};

describe('Dial UI Kit :: hasNoHoverSupport', () => {
  afterEach(() => setMatchMedia(undefined));

  test('Should report no hover when the device matches hover: none', () => {
    const matchMedia = stubMatchMedia(true);

    expect(hasNoHoverSupport()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith(NO_HOVER_MEDIA_QUERY);
  });

  test('Should report hover when the device does not match hover: none', () => {
    stubMatchMedia(false);

    expect(hasNoHoverSupport()).toBe(false);
  });

  test('Should assume hover is available when matchMedia is unsupported', () => {
    setMatchMedia(undefined);

    // Dropping a hover-only affordance on a guess is the worse failure, so an
    // environment that cannot answer the question counts as hover-capable.
    expect(hasNoHoverSupport()).toBe(false);
  });
});
