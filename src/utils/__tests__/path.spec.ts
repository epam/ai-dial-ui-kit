import { describe, expect, test } from 'vitest';
import { getSegments } from '@/utils/path';

describe('getSegments utility', () => {
  test('splits a simple path into segments', () => {
    expect(getSegments('Org/Design/Assets')).toEqual([
      'Org',
      'Design',
      'Assets',
    ]);
  });

  test('trims whitespace around segments', () => {
    expect(getSegments(' Org / Design / Assets ')).toEqual([
      'Org',
      'Design',
      'Assets',
    ]);
  });

  test('removes empty segments caused by leading and trailing slashes', () => {
    expect(getSegments('/Org/Design/Assets/')).toEqual([
      'Org',
      'Design',
      'Assets',
    ]);
  });

  test('removes empty segments caused by repeated slashes', () => {
    expect(getSegments('Org//Design///Assets')).toEqual([
      'Org',
      'Design',
      'Assets',
    ]);
  });

  test('returns an empty array for an empty string', () => {
    expect(getSegments('')).toEqual([]);
  });

  test('returns an empty array for a path with only slashes', () => {
    expect(getSegments('///')).toEqual([]);
  });

  test('handles mixed slashes and whitespace correctly', () => {
    expect(getSegments(' / Org //  Design /  / Assets / ')).toEqual([
      'Org',
      'Design',
      'Assets',
    ]);
  });

  test('does not alter valid segment content', () => {
    expect(getSegments('shared-mindmap/v1.0/_internal')).toEqual([
      'shared-mindmap',
      'v1.0',
      '_internal',
    ]);
  });
});
