import { useCallback, useEffect, useRef, useState } from 'react';

interface UseEditableItemOptions {
  value: string;
  isEditing: boolean;
  validate?: (value: string) => string | null;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  restoreOnCancel?: boolean;
}

export function useEditableItem({
  value: initialValue,
  isEditing,
  restoreOnCancel = true,
  validate,
  onSave,
  onCancel,
}: UseEditableItemOptions) {
  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setValue(initialValue);
      setInvalid(false);
      setInvalidMessage('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isEditing, initialValue]);

  const onChange = (newValue?: string) => {
    const updated = newValue ?? '';
    setValue(updated);

    if (validate) {
      const err = validate(updated);
      if (err) {
        setInvalid(true);
        setInvalidMessage(err);
      } else {
        setInvalid(false);
        setInvalidMessage('');
      }
    } else if (invalid) {
      setInvalid(false);
      setInvalidMessage('');
    }
  };

  const trySave = useCallback(() => {
    const err = validate?.(value);
    if (err) {
      setInvalid(true);
      setInvalidMessage(err);
      inputRef.current?.focus();
      return;
    }
    onSave?.(value);
  }, [onSave, validate, value]);

  const tryCancel = useCallback(() => {
    if (restoreOnCancel) {
      setValue(initialValue);
    }

    setInvalid(false);
    setInvalidMessage('');
    onCancel?.();
  }, [initialValue, onCancel, restoreOnCancel]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      el.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const el = inputRef.current;
    if (!isEditing || !el) return;

    const handleBlur = (e: FocusEvent) => {
      const err = validate?.(value);
      if (err) {
        setInvalid(true);
        setInvalidMessage(err);
        e.preventDefault();
        el.focus();
        return;
      }

      if (value !== initialValue) {
        e.preventDefault();
        el.focus();
      }
    };

    el.addEventListener('blur', handleBlur, true);
    return () => el.removeEventListener('blur', handleBlur, true);
  }, [isEditing, validate, value, initialValue, trySave]);

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

  useEffect(() => {
    if (!isEditing) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const el = inputRef.current;
      if (el && !el.contains(e.target as Node)) {
        const err = validate?.(value);
        if (err) {
          setInvalid(true);
          setInvalidMessage(err);
          el.focus();
        } else {
          trySave();
        }
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isEditing, value, trySave, validate]);

  return {
    inputRef,
    value,
    onChange,
    invalid,
    invalidMessage,
  };
}
