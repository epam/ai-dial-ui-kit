import { AlertVariant } from '@/types/alert';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export interface UseEditableItemOptions {
  value: string;
  isEditing: boolean;
  onValidate?: (value: string) => string | null;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  restoreOnCancel?: boolean;
}

interface UseEditableItemResult {
  inputRef: RefObject<HTMLInputElement | null>;
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
 * @param {(value: string) => string | null} [options.onValidate] - Optional validation function returning an error message or `null` if valid.
 * @param {(value: string) => void} [options.onSave] - Callback invoked when saving a valid value.
 * @param {() => void} [options.onCancel] - Callback invoked when canceling editing.
 * @param {boolean} [options.restoreOnCancel=true] - Whether to restore the original value on cancel.
 *
 * @returns {Object} An object containing state and handlers for editable input.
 * @returns {RefObject<HTMLInputElement>} return.inputRef - Ref to the editable input element.
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
 *   onValidate: (v) => v.trim() ? null : 'Name cannot be empty',
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
  onValidate,
  onSave,
  onCancel,
}: UseEditableItemOptions): UseEditableItemResult {
  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const resetValidationState = useCallback((state = false, error = '') => {
    setInvalid(state);
    setInvalidMessage(error);
  }, []);

  const validate = useCallback(
    (val: string): boolean => {
      if (!onValidate) {
        resetValidationState();
        return true;
      }

      const error = onValidate(val);
      if (error) {
        if (error.startsWith(`${AlertVariant.Warning}__`)) {
          resetValidationState(false, error);
          return true;
        }
        resetValidationState(true, error);
        return false;
      }

      resetValidationState();
      return true;
    },
    [onValidate, resetValidationState],
  );

  const onChange = useCallback(
    (newValue?: string) => {
      const updated = newValue ?? '';
      setValue(updated);
      validate(updated);
    },
    [validate],
  );

  const save = useCallback(() => {
    if (validate(value)) {
      onSave?.(value);
    } else {
      inputRef.current?.focus();
    }
  }, [validate, onSave, value]);

  const cancel = useCallback(() => {
    if (restoreOnCancel) {
      setValue(initialValue);
    }
    resetValidationState();
    onCancel?.();
  }, [initialValue, onCancel, restoreOnCancel, resetValidationState]);

  useEffect(() => {
    if (!isEditing) return;

    setValue(initialValue);
    resetValidationState();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isEditing, initialValue, resetValidationState]);

  useEffect(() => {
    const el = inputRef.current;
    if (!isEditing || !el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputRef.current?.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    };

    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [isEditing, save, cancel]);

  useEffect(() => {
    if (!isEditing) return;

    const el = inputRef.current;
    if (!el) return;

    const handleBlur = (e: FocusEvent) => {
      const nextTarget = e.relatedTarget as Node | null;
      const stillInside = nextTarget && el.contains(nextTarget);

      if (!stillInside) {
        if (validate(value)) {
          save();
        } else {
          el.focus();
        }
      }
    };

    el.addEventListener('blur', handleBlur);

    return () => {
      el.removeEventListener('blur', handleBlur);
    };
  }, [isEditing, value, validate, save]);

  return { inputRef, value, onChange, invalid, invalidMessage };
}
