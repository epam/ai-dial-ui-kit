import { describe, it, expect } from 'vitest';
import { formatAllowedFileTypesForTooltip } from './utils';

describe('Dial UI Kit :: formatAllowedFileTypesForTooltip', () => {
  it('returns empty string for undefined', () => {
    expect(formatAllowedFileTypesForTooltip(undefined)).toBe('');
  });

  it('returns empty string for empty array', () => {
    expect(formatAllowedFileTypesForTooltip([])).toBe('');
  });

  it('converts application/ MIME types to dot-extension', () => {
    expect(formatAllowedFileTypesForTooltip(['application/pdf'])).toBe('.pdf');
    expect(formatAllowedFileTypesForTooltip(['application/json'])).toBe(
      '.json, .map',
    );
    expect(formatAllowedFileTypesForTooltip(['application/*'])).toBe(
      'applications',
    );
  });

  it('keeps text/ MIME types as-is', () => {
    expect(formatAllowedFileTypesForTooltip(['text/plain'])).toBe(
      '.txt, .text, .conf, .def, .list, .log, .in, .ini',
    );
    expect(formatAllowedFileTypesForTooltip(['text/csv'])).toBe('.csv');
    expect(formatAllowedFileTypesForTooltip(['text/*'])).toBe('texts');
  });

  it('converts other MIME types to dot-extension', () => {
    expect(formatAllowedFileTypesForTooltip(['image/png'])).toBe('.png');
    expect(formatAllowedFileTypesForTooltip(['image/*'])).toBe('images');
    expect(formatAllowedFileTypesForTooltip(['audio/mpeg'])).toBe(
      '.mpga, .mp2, .mp2a, .mp3, .m2a, .m3a',
    );
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
    ).toBe('.pdf, .txt, .text, .conf, .def, .list, .log, .in, .ini, .png');
  });
});
