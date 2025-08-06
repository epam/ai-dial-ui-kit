import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

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
    React.createElement(
      'div',
      { role: 'textbox', 'aria-label': 'JSON Editor' },
      React.createElement('textarea', {
        value: value || '',
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
