import { describe, it, expect } from 'vitest';
import type { DialFileAcceptType } from '@/models/file-manager';
import {
  formatAllowedFileTypesForTooltip,
  isFileSelectable,
  splitPathAndName,
} from './utils';

describe('Dial UI Kit :: splitPathAndName', () => {
  it('splits a nested path into parent and name', () => {
    expect(splitPathAndName('All files/Design/Icons')).toEqual({
      parent: 'All files/Design',
      name: 'Icons',
    });
  });

  it('handles a top-level path with no slash', () => {
    expect(splitPathAndName('All files')).toEqual({
      parent: '',
      name: 'All files',
    });
  });

  it('handles a single-level folder directly under root slash', () => {
    expect(splitPathAndName('root/child')).toEqual({
      parent: 'root',
      name: 'child',
    });
  });
});

describe('Dial UI Kit :: isFileSelectable', () => {
  const baseFile = {
    name: 'photo.png',
    contentType: 'image/png',
    contentLength: 512,
  };

  it('returns true when no constraints are set', () => {
    expect(isFileSelectable(baseFile)).toBe(true);
  });

  it('returns true when file size is within the limit', () => {
    expect(isFileSelectable(baseFile, undefined, 1024)).toBe(true);
  });

  it('returns false when file size exceeds the limit', () => {
    expect(isFileSelectable(baseFile, undefined, 256)).toBe(false);
  });

  it('returns true when size equals the limit exactly', () => {
    expect(isFileSelectable(baseFile, undefined, 512)).toBe(true);
  });

  it('returns true when content type matches allowedFileTypes', () => {
    expect(isFileSelectable(baseFile, ['image/*'])).toBe(true);
  });

  it('returns false when content type does not match allowedFileTypes', () => {
    expect(isFileSelectable(baseFile, ['application/pdf'])).toBe(false);
  });

  it('returns false when both size and type fail', () => {
    expect(isFileSelectable(baseFile, ['application/pdf'], 256)).toBe(false);
  });

  it('returns true when contentLength is absent (no size to check)', () => {
    expect(
      isFileSelectable(
        { name: 'file.png', contentType: 'image/png' },
        undefined,
        1,
      ),
    ).toBe(true);
  });

  it('returns true when contentType is absent (no type to check)', () => {
    expect(
      isFileSelectable({ name: 'file', contentLength: 100 }, ['image/*']),
    ).toBe(true);
  });
});

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
        'svg' as DialFileAcceptType,
        'application/pdf',
        'text/plain',
        'image/png',
      ]),
    ).toBe('.pdf, .txt, .text, .conf, .def, .list, .log, .in, .ini, .png');
  });
});
