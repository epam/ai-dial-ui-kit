import { NotificationVariant } from '@/types/notification';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export const EDITABLE_CONTAINER_ATTRIBUTE = 'data-editable-container';
export const editableContainerProps = {
  [EDITABLE_CONTAINER_ATTRIBUTE]: '',
} as const;

export interface UseEditableItemOptions {
  value: string;
  isEditing: boolean;
  isCreating?: boolean;
  isLoading?: boolean;
  onValidate?: (value: string) => string | null;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  restoreOnCancel?: boolean;
  onCreateFolderSave?: (value: string) => void;
  onCreateFolderCancel?: () => void;
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
  isCreating,
  isLoading = false,
  restoreOnCancel = true,
  onValidate,
  onSave,
  onCancel,
  onCreateFolderSave,
  onCreateFolderCancel,
}: UseEditableItemOptions): UseEditableItemResult {
  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelSavingRef = useRef<boolean>(false);
  const committedRef = useRef<boolean>(false);

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
        if (error.startsWith(`${NotificationVariant.Warning}__`)) {
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

  const commit = useCallback(
    (valueToCommit: string) => {
      if (isCreating && !cancelSavingRef.current && !isLoading) {
        onCreateFolderSave?.(valueToCommit);
      } else if (!isCreating && isEditing) {
        onSave?.(valueToCommit);
      }
      cancelSavingRef.current = false;
    },
    [onSave, onCreateFolderSave, isCreating, isEditing, isLoading],
  );

  const save = useCallback(() => {
    if (validate(value)) {
      commit(value);
    } else {
      inputRef.current?.focus();
    }
    cancelSavingRef.current = false;
  }, [validate, value, commit]);

  const cancel = useCallback(() => {
    if (restoreOnCancel) {
      setValue(initialValue);
    }

    if (isCreating) {
      onCreateFolderCancel?.();
    } else {
      onCancel?.();
    }

    cancelSavingRef.current = true;
    resetValidationState();
  }, [
    initialValue,
    onCancel,
    restoreOnCancel,
    resetValidationState,
    onCreateFolderCancel,
    isCreating,
  ]);

  /**
   * Commits the edit when focus leaves the input (outside click / blur).
   * Always exits edit mode: a valid value is saved as-is, while an invalid
   * value falls back to the default name (`initialValue`) and is committed,
   * instead of trapping the user inside the field.
   */
  const saveOnBlur = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;

    if (validate(value)) {
      commit(value);
      return;
    }

    if (validate(initialValue)) {
      setValue(initialValue);
      resetValidationState();
      commit(initialValue);
    } else {
      cancel();
    }
  }, [validate, value, initialValue, commit, cancel, resetValidationState]);

  useEffect(() => {
    if (!isEditing && !isCreating) return;

    cancelSavingRef.current = false;
    committedRef.current = false;
    setValue(initialValue);
    resetValidationState();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isEditing, isCreating, initialValue, resetValidationState]);

  useEffect(() => {
    const el = inputRef.current;
    if ((!isEditing && !isCreating) || !el) return;

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
  }, [isEditing, isCreating, save, cancel]);

  useEffect(() => {
    if ((!isEditing && !isCreating) || isLoading) return;

    const el = inputRef.current;
    if (!el) return;

    const isInsideField = (node: Node | null): boolean => {
      if (!node) return false;
      const container = el.closest(`[${EDITABLE_CONTAINER_ATTRIBUTE}]`) ?? el;
      return container.contains(node);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!isInsideField(e.target as Node | null)) {
        saveOnBlur();
      }
    };

    const handleBlur = (e: FocusEvent) => {
      if (!isInsideField(e.relatedTarget as Node | null)) {
        saveOnBlur();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    el.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      el.removeEventListener('blur', handleBlur);
    };
  }, [isEditing, isCreating, isLoading, saveOnBlur]);

  return { inputRef, value, onChange, invalid, invalidMessage };
}
