import { describe, expect, test } from 'vitest';

import { AVATAR_PALETTE, extractInitials, pickAvatarColor } from '../avatar';

describe('extractInitials', () => {
  test('returns two uppercase initials for a multi-word name', () => {
    expect(extractInitials('My Application')).toBe('MA');
  });

  test('returns the first two letters of a single-word name', () => {
    expect(extractInitials('Summarizer')).toBe('SU');
  });

  test('returns "?" for an empty string', () => {
    expect(extractInitials('')).toBe('?');
  });

  test('ignores extra whitespace', () => {
    expect(extractInitials('  Hello   World  ')).toBe('HW');
  });

  test('returns one letter for a one-letter name', () => {
    expect(extractInitials('X')).toBe('X');
  });

  test('uses only the first two words of a longer name', () => {
    expect(extractInitials('One Two Three')).toBe('OT');
  });

  test('skips leading punctuation in each word', () => {
    expect(extractInitials('[StatGPT] Global Trusted')).toBe('SG');
  });

  test('strips punctuation from a single-word name', () => {
    expect(extractInitials('[App]')).toBe('AP');
  });

  test('handles letters outside the Latin alphabet', () => {
    expect(extractInitials('Олена Коваль')).toBe('ОК');
  });
});

describe('pickAvatarColor', () => {
  test('always returns the same pair for the same name', () => {
    expect(pickAvatarColor('Ada Lovelace')).toBe(
      pickAvatarColor('Ada Lovelace'),
    );
  });

  test('returns an entry of the palette', () => {
    expect(AVATAR_PALETTE).toContain(pickAvatarColor('Summarizer'));
  });

  test('returns the first entry for an empty name', () => {
    expect(pickAvatarColor('')).toBe(AVATAR_PALETTE[0]);
  });
});
