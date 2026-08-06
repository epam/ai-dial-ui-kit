import { createElement } from 'react';
import { describe, expect, test } from 'vitest';
import { resolveAccessibleName } from '../accessible-name';

describe('Dial UI Kit :: resolveAccessibleName', () => {
  test('Should return the only candidate when it is a string', () => {
    const result = resolveAccessibleName('Scroll to bottom');

    expect(result).toBe('Scroll to bottom');
  });

  test('Should return the first candidate when several are strings', () => {
    const result = resolveAccessibleName('Scroll to bottom', 'Tooltip text');

    expect(result).toBe('Scroll to bottom');
  });

  test('Should skip a leading undefined candidate', () => {
    const result = resolveAccessibleName(undefined, 'Tooltip text');

    expect(result).toBe('Tooltip text');
  });

  test('Should skip a candidate that is not a string', () => {
    const result = resolveAccessibleName(42, 'Tooltip text');

    expect(result).toBe('Tooltip text');
  });

  test('Should skip an element candidate', () => {
    const element = createElement('span', null, 'Rendered label');

    const result = resolveAccessibleName(element, 'Tooltip text');

    expect(result).toBe('Tooltip text');
  });

  test('Should skip an empty string candidate', () => {
    const result = resolveAccessibleName('', 'Tooltip text');

    expect(result).toBe('Tooltip text');
  });

  test('Should return undefined when no candidate is a non-empty string', () => {
    const result = resolveAccessibleName(undefined, '', 42);

    expect(result).toBeUndefined();
  });

  test('Should return undefined when there are no candidates', () => {
    const result = resolveAccessibleName();

    expect(result).toBeUndefined();
  });
});
