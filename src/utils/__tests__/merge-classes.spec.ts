import { describe, expect, test } from 'vitest';
import { mergeClasses } from '@/utils/merge-classes';

describe('mergeClasses utility', () => {
  test('resolves Tailwind width conflicts (last one wins)', () => {
    expect(mergeClasses('w-48', 'w-96')).toBe('w-96');
    expect(mergeClasses('w-96', 'w-48')).toBe('w-48');
  });

  test('resolves Tailwind spacing conflicts', () => {
    expect(mergeClasses('px-2', 'px-4')).toBe('px-4');
    expect(mergeClasses('py-1', 'py-3', 'py-2')).toBe('py-2');
  });

  test('deduplicates identical classes', () => {
    expect(mergeClasses('text-center', 'text-center')).toBe('text-center');
  });

  test('handles arrays, objects, and falsy values like classnames', () => {
    const result = mergeClasses(
      'a',
      ['b', null, undefined],
      { c: true, d: false },
      '',
      0,
      false,
      'e',
    );
    // Order is preserved, falsy skipped, object truthy keys included.
    expect(result).toBe('a b c e');
  });

  test.each(['z-popup', 'z-floating', 'z-interactive-tooltip', 'z-tooltip'])(
    'lets a caller z-index replace the overlay step %s',
    (step) => {
      expect(mergeClasses(step, 'z-[9999]')).toBe('z-[9999]');
      expect(mergeClasses('z-[9999]', step)).toBe(step);
    },
  );

  test('preserves non-conflicting utilities', () => {
    expect(mergeClasses('truncate', 'min-w-0', 'max-w-full')).toBe(
      'truncate min-w-0 max-w-full',
    );
  });
});
