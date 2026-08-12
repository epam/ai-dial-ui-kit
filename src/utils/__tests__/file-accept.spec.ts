import { describe, expect, test } from 'vitest';
import { matchesAccept } from '../file-accept';

const file = (name: string, type = '') => new File(['content'], name, { type });

describe('Dial UI Kit :: matchesAccept', () => {
  test('accepts anything when accept is missing or empty', () => {
    expect(matchesAccept(file('notes.md'))).toBe(true);
    expect(matchesAccept(file('notes.md'), '')).toBe(true);
    expect(matchesAccept(file('notes.md'), '  ,  ')).toBe(true);
  });

  test('matches an extension token', () => {
    expect(matchesAccept(file('notes.md'), '.md,.zip')).toBe(true);
    expect(matchesAccept(file('archive.zip'), '.md,.zip')).toBe(true);
    expect(matchesAccept(file('photo.png'), '.md,.zip')).toBe(false);
  });

  test('matches an extension regardless of case', () => {
    expect(matchesAccept(file('NOTES.MD'), '.md')).toBe(true);
    expect(matchesAccept(file('notes.md'), '.MD')).toBe(true);
  });

  test('matches a full MIME type', () => {
    expect(
      matchesAccept(file('notes.md', 'text/markdown'), 'text/markdown'),
    ).toBe(true);
    expect(matchesAccept(file('photo.png', 'image/png'), 'text/markdown')).toBe(
      false,
    );
  });

  test('matches a MIME wildcard against its group', () => {
    expect(matchesAccept(file('photo.png', 'image/png'), 'image/*')).toBe(true);
    expect(matchesAccept(file('notes.md', 'text/markdown'), 'image/*')).toBe(
      false,
    );
  });

  test('does not let an unknown MIME type match a wildcard', () => {
    expect(matchesAccept(file('data.skill'), 'image/*')).toBe(false);
  });

  test('ignores whitespace between tokens', () => {
    expect(matchesAccept(file('archive.zip'), '.md, .zip , .skill')).toBe(true);
  });

  test('needs only one token to match', () => {
    expect(matchesAccept(file('data.skill'), 'image/*,.skill')).toBe(true);
  });

  test('rejects an extension that only appears mid-name', () => {
    expect(matchesAccept(file('md.png'), '.md')).toBe(false);
  });
});
