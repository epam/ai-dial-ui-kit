import { describe, expect, test } from 'vitest';

import {
  type AutocompleteTagInputSuggestion,
  filterAutocompleteSuggestions,
} from './utils';

const suggestions: AutocompleteTagInputSuggestion[] = [
  { value: 'image/gif', label: 'GIF', description: 'image/gif' },
  { value: 'image/png', label: 'PNG', description: 'image/png' },
  { value: 'image/jpeg', label: 'JPG', description: 'image/jpeg' },
  { value: 'application/pdf', label: 'PDF' },
  { value: 'image/apng', label: 'APNG', description: 'Animated PNG' },
];

const labels = (query: string, tags: string[] = [], limit = 5) =>
  filterAutocompleteSuggestions(suggestions, query, tags, limit).map(
    (suggestion) => suggestion.label,
  );

describe('Dial UI Kit :: AutocompleteTagInput utils', () => {
  test('matches the label case-insensitively', () => {
    expect(labels('gIf')).toEqual(['GIF']);
  });

  test('matches the value, keeping the given order', () => {
    expect(labels('image/')).toEqual(['GIF', 'PNG', 'JPG', 'APNG']);
  });

  test('matches the description', () => {
    expect(labels('animated')).toEqual(['APNG']);
  });

  test('ignores surrounding whitespace in the query', () => {
    expect(labels('  pdf ')).toEqual(['PDF']);
  });

  test('leaves out suggestions that are already tags', () => {
    expect(labels('png', ['image/png'])).toEqual(['APNG']);
  });

  test('returns every suggestion up to the limit for an empty query', () => {
    expect(labels('', [], 2)).toEqual(['GIF', 'PNG']);
  });

  test('returns nothing for a non-positive limit', () => {
    expect(labels('', [], 0)).toEqual([]);
    expect(labels('', [], -1)).toEqual([]);
  });

  test('returns nothing when no suggestion matches', () => {
    expect(labels('audio/')).toEqual([]);
  });
});
