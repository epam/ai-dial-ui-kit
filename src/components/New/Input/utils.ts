import type { KeyboardEvent } from 'react';

const ALLOWED_INPUT_KEYS = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Backspace',
  'Delete',
  'Tab',
  'Enter',
  'Escape',
  'Home',
  'End',
  'Insert',
];

export const handleKeyDown = (
  e: KeyboardEvent<HTMLInputElement>,
  type?: string,
  min?: number | string,
  max?: number | string,
) => {
  const isNumericInput =
    type === 'number' || min !== undefined || max !== undefined;

  if (!isNumericInput) return;

  if (ALLOWED_INPUT_KEYS.includes(e.key)) {
    return;
  }

  // Allow common keyboard shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
  if (e.ctrlKey || e.metaKey) {
    return;
  }

  // Allow minus sign only at the beginning and if not already present
  if (
    e.key === '-' &&
    (e.currentTarget.selectionStart ?? 0) === 0 &&
    !e.currentTarget.value.includes('-')
  ) {
    return;
  }

  // Allow decimal point for number inputs (but not if it already exists)
  if (
    e.key === '.' &&
    type === 'number' &&
    !e.currentTarget.value.includes('.')
  ) {
    return;
  }

  // Only allow numeric characters
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    return;
  }

  // Check if the resulting value would be within range
  if (min !== undefined || max !== undefined) {
    const currentValue = e.currentTarget.value;
    const cursorPosition = e.currentTarget.selectionStart || 0;
    const newValue =
      currentValue.slice(0, cursorPosition) +
      e.key +
      currentValue.slice(cursorPosition);
    const numericValue = parseFloat(newValue);

    if (!isNaN(numericValue)) {
      if (min !== undefined && numericValue < +min) {
        e.preventDefault();
        return;
      }
      if (max !== undefined && numericValue > +max) {
        e.preventDefault();
        return;
      }
    }
  }
};
