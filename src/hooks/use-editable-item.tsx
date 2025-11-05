import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseEditableItemOptions {
  value: string;
  isEditing: boolean;
  validate?: (value: string) => string | null;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  restoreOnCancel?: boolean;
}

interface UseEditableItemResult {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (newValue?: string) => void;
  invalid: boolean;
  invalidMessage: string;
}

/**
 * A React hook that manages the behavior of an inline-editable text input.
 * It provides validation handling, cancel/restore logic, auto-focus behavior,
 * keyboard shortcuts, and outside-click detection.
 *
 * @param {Object} options - Hook configuration options.
 * @param {string} options.value - Initial value for the editable input.
 * @param {boolean} options.isEditing - Whether the item is currently in edit mode.
 * @param {(value: string) => string | null} [options.validate] - Optional validation function returning an error message or `null` if valid.
 * @param {(value: string) => void} [options.onSave] - Callback invoked when saving a valid value.
 * @param {() => void} [options.onCancel] - Callback invoked when canceling editing.
 * @param {boolean} [options.restoreOnCancel=true] - Whether to restore the original value on cancel.
 *
 * @returns {Object} An object containing state and handlers for editable input.
 * @returns {React.RefObject<HTMLInputElement>} return.inputRef - Ref to the editable input element.
 * @returns {string} return.value - Current input value.
 * @returns {(newValue?: string) => void} return.onChange - Change handler for the input value.
 * @returns {boolean} return.invalid - Whether the current value is invalid.
 * @returns {string} return.invalidMessage - Validation error message, if any.
 *
 * @example
 * ```tsx
 * const {
 *   inputRef,
 *   value,
 *   onChange,
 *   invalid,
 *   invalidMessage
 * } = useEditableItem({
 *   value: 'example.txt',
 *   isEditing,
 *   validate: (v) => v.trim() ? null : 'Name cannot be empty',
 *   onSave: (v) => console.log('Saved', v),
 *   onCancel: () => console.log('Canceled'),
 * });
 *
 * return (
 *   <input
 *     ref={inputRef}
 *     value={value}
 *     onChange={(e) => onChange(e.target.value)}
 *     aria-invalid={invalid}
 *   />
 *   {invalid && <span>{invalidMessage}</span>}
 * );
 * ```
 */
export function useEditableItem({
  value: initialValue,
  isEditing,
  restoreOnCancel = true,
  validate,
  onSave,
  onCancel,
}: UseEditableItemOptions): UseEditableItemResult {
  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /** Validate and update invalid state */
  const runValidation = useCallback(
    (val: string): boolean => {
      if (!validate) {
        setInvalid(false);
        setInvalidMessage('');
        return true;
      }

      const error = validate(val);
      if (error) {
        setInvalid(true);
        setInvalidMessage(error);
        return false;
      }

      setInvalid(false);
      setInvalidMessage('');
      return true;
    },
    [validate],
  );

  /** Handle value change */
  const onChange = useCallback(
    (newValue?: string) => {
      const updated = newValue ?? '';
      setValue(updated);
      runValidation(updated);
    },
    [runValidation],
  );

  /** Attempt to save current value if valid */
  const trySave = useCallback(() => {
    if (runValidation(value)) {
      onSave?.(value);
    } else {
      inputRef.current?.focus();
    }
  }, [runValidation, onSave, value]);

  /** Cancel editing, optionally restoring the original value */
  const tryCancel = useCallback(() => {
    if (restoreOnCancel) {
      setValue(initialValue);
    }
    setInvalid(false);
    setInvalidMessage('');
    onCancel?.();
  }, [initialValue, onCancel, restoreOnCancel]);

  /** Reset and focus input when entering edit mode */
  useEffect(() => {
    if (!isEditing) return;
    setValue(initialValue);
    setInvalid(false);
    setInvalidMessage('');
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isEditing, initialValue]);

  /** Save or cancel via keyboard */
  useEffect(() => {
    const el = inputRef.current;
    if (!isEditing || !el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        trySave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        tryCancel();
      }
    };

    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [isEditing, trySave, tryCancel]);

  /** Save when clicking outside, or re-focus if invalid */
  useEffect(() => {
    if (!isEditing) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const el = inputRef.current;
      if (!el || el.contains(e.target as Node)) return;

      if (runValidation(value)) {
        trySave();
      } else {
        el.focus();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isEditing, value, runValidation, trySave]);

  return { inputRef, value, onChange, invalid, invalidMessage };
}
