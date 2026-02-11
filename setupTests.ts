import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { ChangeEvent, createElement } from 'react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

const originalDOMMatrix = globalThis.DOMMatrix;

if (!globalThis.DOMMatrix) {
  class DOMMatrixMock {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;

    multiplySelf() {
      return this;
    }

    translateSelf() {
      return this;
    }

    scaleSelf() {
      return this;
    }

    rotateSelf() {
      return this;
    }
  }

  globalThis.DOMMatrix = DOMMatrixMock as unknown as typeof DOMMatrix;
}

// Mock Monaco Editor
vi.mock('monaco-editor', () => ({
  editor: {
    IStandaloneThemeData: {},
    IMarker: {},
    IStandaloneEditorConstructionOptions: {},
  },
}));

// Mock Monaco Editor React
vi.mock('@monaco-editor/react', () => ({
  Editor: vi.fn(({ value, onChange, theme, onValidate }) => {
    // Simulate Monaco Editor validation behavior by calling onValidate after mount
    if (onValidate) {
      // Use queueMicrotask to ensure validation happens after render
      queueMicrotask(() => {
        // Call onValidate with empty markers array (valid JSON) or with errors if invalid
        try {
          if (value) {
            JSON.parse(value);
            onValidate([]); // Valid JSON - no markers
          } else {
            onValidate([]); // Empty value - no markers
          }
        } catch {
          // Invalid JSON - return error markers
          onValidate([
            {
              severity: 8, // Error severity
              message: 'Invalid JSON',
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 1,
            },
          ]);
        }
      });
    }

    return createElement(
      'div',
      { role: 'textbox', 'aria-label': 'JSON Editor' },
      createElement('textarea', {
        value: value || '',
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange?.(e.target.value),
        'data-theme': theme,
        'aria-label': 'JSON content',
      }),
    );
  }),
}));

afterEach(() => {
  cleanup();
});

let originalIntersectionObserver: typeof IntersectionObserver;
let originalResizeObserver: typeof ResizeObserver;

beforeAll(() => {
  if (!document.elementFromPoint) {
    document.elementFromPoint = vi.fn(() => document.createElement('div'));
  }

  originalIntersectionObserver = globalThis.IntersectionObserver;
  originalResizeObserver = globalThis.ResizeObserver;

  class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: number[] = [];
    callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn();
  }

  class ResizeObserverMock implements ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  globalThis.IntersectionObserver =
    IntersectionObserverMock as unknown as typeof IntersectionObserver;

  globalThis.ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterAll(() => {
  vi.restoreAllMocks();
  globalThis.IntersectionObserver = originalIntersectionObserver;
  globalThis.ResizeObserver = originalResizeObserver;
  globalThis.DOMMatrix = originalDOMMatrix as typeof DOMMatrix;
});
