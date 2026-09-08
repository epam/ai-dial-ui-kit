import { act, render, screen } from '@testing-library/react';
import type { FC } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { useHasHover } from '../use-has-hover';

type ChangeListener = (event: MediaQueryListEvent) => void;

/*
 * jsdom ships no `matchMedia`, so each test installs a stub that records the
 * `change` listener the hook subscribes with and can fire it on demand.
 */
const setMatchMedia = (value: typeof window.matchMedia | undefined) =>
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value,
  });

const stubMatchMedia = (initialMatches: boolean) => {
  const listeners = new Set<ChangeListener>();
  const removeEventListener = vi.fn((_type: string, listener: ChangeListener) =>
    listeners.delete(listener),
  );

  setMatchMedia(
    vi.fn((media: string) => ({
      matches: initialMatches,
      media,
      addEventListener: (_type: string, listener: ChangeListener) => {
        listeners.add(listener);
      },
      removeEventListener,
    })) as unknown as typeof window.matchMedia,
  );

  const emitChange = (matches: boolean) =>
    act(() => {
      listeners.forEach((listener) =>
        listener({ matches } as MediaQueryListEvent),
      );
    });

  return { emitChange, removeEventListener, listeners };
};

const Harness: FC = () => <span>{useHasHover() ? 'hover' : 'no hover'}</span>;

describe('Dial UI Kit :: useHasHover', () => {
  afterEach(() => setMatchMedia(undefined));

  test('Should report hover on a device that does not match hover: none', () => {
    stubMatchMedia(false);

    render(<Harness />);

    expect(screen.getByText('hover')).toBeInTheDocument();
  });

  test('Should report no hover on a touch-only device', () => {
    stubMatchMedia(true);

    render(<Harness />);

    expect(screen.getByText('no hover')).toBeInTheDocument();
  });

  test('Should follow a hybrid device that gains a hovering pointer', () => {
    const { emitChange } = stubMatchMedia(true);

    render(<Harness />);
    expect(screen.getByText('no hover')).toBeInTheDocument();

    // A tablet docked with a trackpad stops matching `hover: none`.
    emitChange(false);

    expect(screen.getByText('hover')).toBeInTheDocument();
  });

  test('Should drop the media-query listener on unmount', () => {
    const { removeEventListener, listeners } = stubMatchMedia(false);

    render(<Harness />).unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
    expect(listeners.size).toBe(0);
  });

  test('Should assume hover is available when matchMedia is unsupported', () => {
    setMatchMedia(undefined);

    render(<Harness />);

    expect(screen.getByText('hover')).toBeInTheDocument();
  });
});
