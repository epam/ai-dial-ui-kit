import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SKELETON_DELAY_MS,
  SKELETON_MIN_DURATION_MS,
  useSkeletonTiming,
} from '../use-skeleton-timing';

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe('Dial UI Kit :: useSkeletonTiming', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows nothing during the delay', () => {
    const { result } = renderHook(() => useSkeletonTiming(true));
    advance(SKELETON_DELAY_MS - 1);
    expect(result.current.showSkeleton).toBe(false);
    expect(result.current.showContent).toBe(false);
  });

  it('shows the skeleton once loading outlasts the delay', () => {
    const { result } = renderHook(() => useSkeletonTiming(true));
    advance(SKELETON_DELAY_MS);
    expect(result.current.showSkeleton).toBe(true);
    expect(result.current.showContent).toBe(false);
  });

  it('never shows a skeleton when loading ends within the delay', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS - 100);
    rerender({ loading: false });
    advance(SKELETON_DELAY_MS * 2);
    expect(result.current.showSkeleton).toBe(false);
    expect(result.current.showContent).toBe(true);
    expect(result.current.contentClassName).toBe('');
  });

  it('keeps a shown skeleton for the minimum duration', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS);
    advance(100);
    rerender({ loading: false });
    advance(SKELETON_MIN_DURATION_MS - 100 - 1);
    expect(result.current.showSkeleton).toBe(true);
    expect(result.current.showContent).toBe(false);
    advance(1);
    expect(result.current.showSkeleton).toBe(false);
    expect(result.current.showContent).toBe(true);
  });

  it('hides the skeleton at once when the minimum duration already passed', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS);
    advance(SKELETON_MIN_DURATION_MS + 50);
    rerender({ loading: false });
    advance(0);
    expect(result.current.showSkeleton).toBe(false);
    expect(result.current.showContent).toBe(true);
  });

  it('fades the content in after a skeleton was shown', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS);
    rerender({ loading: false });
    advance(SKELETON_MIN_DURATION_MS);
    expect(result.current.contentClassName).toBe(
      'motion-safe:animate-skeleton-reveal',
    );
  });

  it('keeps the skeleton when loading restarts while it is shown', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS);
    rerender({ loading: false });
    advance(100);
    rerender({ loading: true });
    advance(SKELETON_MIN_DURATION_MS * 2);
    expect(result.current.showSkeleton).toBe(true);
  });

  it('honours custom delay and minimum duration', () => {
    const { result, rerender } = renderHook(
      ({ loading }) =>
        useSkeletonTiming(loading, { delay: 50, minDuration: 0 }),
      { initialProps: { loading: true } },
    );
    advance(50);
    expect(result.current.showSkeleton).toBe(true);
    rerender({ loading: false });
    advance(0);
    expect(result.current.showContent).toBe(true);
  });

  it('mounts the placeholder invisibly during the delay so the space is held', () => {
    const { result } = renderHook(() => useSkeletonTiming(true));
    expect(result.current.showPlaceholder).toBe(true);
    expect(result.current.placeholderClassName).toBe('invisible');
    advance(SKELETON_DELAY_MS - 1);
    expect(result.current.showPlaceholder).toBe(true);
    expect(result.current.placeholderClassName).toBe('invisible');
  });

  it('makes the placeholder visible once the skeleton is shown', () => {
    const { result } = renderHook(() => useSkeletonTiming(true));
    advance(SKELETON_DELAY_MS);
    expect(result.current.showPlaceholder).toBe(true);
    expect(result.current.placeholderClassName).toBe('');
  });

  it('keeps the placeholder mounted until the minimum duration ends, then drops it', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS);
    rerender({ loading: false });
    expect(result.current.showPlaceholder).toBe(true);
    advance(SKELETON_MIN_DURATION_MS);
    expect(result.current.showPlaceholder).toBe(false);
  });

  it('never mounts the placeholder when not loading', () => {
    const { result } = renderHook(() => useSkeletonTiming(false));
    expect(result.current.showPlaceholder).toBe(false);
  });

  it('drops the invisible placeholder when loading ends within the delay', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS - 100);
    rerender({ loading: false });
    expect(result.current.showPlaceholder).toBe(false);
    expect(result.current.showContent).toBe(true);
  });

  it('starts a fresh delay and drops the reveal when loading restarts after the skeleton is gone', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useSkeletonTiming(loading),
      { initialProps: { loading: true } },
    );
    advance(SKELETON_DELAY_MS);
    rerender({ loading: false });
    advance(SKELETON_MIN_DURATION_MS);
    expect(result.current.showContent).toBe(true);
    expect(result.current.contentClassName).toBe(
      'motion-safe:animate-skeleton-reveal',
    );

    rerender({ loading: true });
    expect(result.current.showContent).toBe(false);
    expect(result.current.showSkeleton).toBe(false);
    expect(result.current.showPlaceholder).toBe(true);
    expect(result.current.placeholderClassName).toBe('invisible');

    advance(SKELETON_DELAY_MS - 1);
    expect(result.current.showSkeleton).toBe(false);
    advance(1);
    expect(result.current.showSkeleton).toBe(true);
    expect(result.current.placeholderClassName).toBe('');
  });

  it('shows content straight away when not loading', () => {
    const { result } = renderHook(() => useSkeletonTiming(false));
    expect(result.current.showContent).toBe(true);
    expect(result.current.showSkeleton).toBe(false);
  });
});
