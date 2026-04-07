import { describe, it, expect } from 'vitest';
import { formatAllowedFileTypesForTooltip } from './utils';

describe('Dial UI Kit :: formatAllowedFileTypesForTooltip', () => {
  it('returns empty string for undefined', () => {
    expect(formatAllowedFileTypesForTooltip(undefined)).toBe('');
  });

  it('returns empty string for empty array', () => {
    expect(formatAllowedFileTypesForTooltip([])).toBe('');
  });

  it('keeps dot-prefixed extensions as-is', () => {
    expect(formatAllowedFileTypesForTooltip(['.svg'])).toBe('.svg');
    expect(formatAllowedFileTypesForTooltip(['.png', '.jpg'])).toBe(
      '.png, .jpg',
    );
  });

  it('keeps bare extensions (no dot, no slash) as-is', () => {
    expect(formatAllowedFileTypesForTooltip(['svg'])).toBe('svg');
    expect(formatAllowedFileTypesForTooltip(['png', 'jpg'])).toBe('png, jpg');
  });

  it('converts application/ MIME types to dot-extension', () => {
    expect(formatAllowedFileTypesForTooltip(['application/pdf'])).toBe('.pdf');
    expect(formatAllowedFileTypesForTooltip(['application/json'])).toBe(
      '.json',
    );
    expect(formatAllowedFileTypesForTooltip(['application/*'])).toBe('.*');
  });

  it('keeps text/ MIME types as-is', () => {
    expect(formatAllowedFileTypesForTooltip(['text/plain'])).toBe('text/plain');
    expect(formatAllowedFileTypesForTooltip(['text/csv'])).toBe('text/csv');
    expect(formatAllowedFileTypesForTooltip(['text/*'])).toBe('text/*');
  });

  it('keeps image/ and other MIME types as-is', () => {
    expect(formatAllowedFileTypesForTooltip(['image/png'])).toBe('image/png');
    expect(formatAllowedFileTypesForTooltip(['image/*'])).toBe('image/*');
  });

  it('handles mixed types correctly', () => {
    expect(
      formatAllowedFileTypesForTooltip([
        '.svg',
        'svg',
        'application/pdf',
        'text/plain',
        'image/png',
      ]),
    ).toBe('.svg, svg, .pdf, text/plain, image/png');
  });
});
