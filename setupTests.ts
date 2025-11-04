import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { ChangeEvent, createElement } from 'react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

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
  Editor: vi.fn(({ value, onChange, theme }) =>
    createElement(
      'div',
      { role: 'textbox', 'aria-label': 'JSON Editor' },
      createElement('textarea', {
        value: value || '',
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange?.(e.target.value),
        'data-theme': theme,
        'aria-label': 'JSON content',
      }),
    ),
  ),
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
});
