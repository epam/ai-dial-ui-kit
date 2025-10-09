import {
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from 'react';

import classNames from 'classnames';
import { DialFieldLabel } from '@/components/Field/Field';
import { DialTag } from '@/components/Tag/Tag';
import { DialErrorText } from '@/components/ErrorText/ErrorText';
import type { FieldControlProps } from '@/models/field-control-props';

export interface DialTagInputProps extends FieldControlProps {
  elementId: string;
  initialTags?: string[];
  placeholder?: string;
  errorText?: string;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: (tags: string[]) => void;
}

/**
 * A tag input field that allows users to add multiple tags using the Enter or comma key.
 * Supports removing tags, displaying field labels, optional indicators, validation states,
 * and dynamic layout adjustment when tags wrap to multiple lines.
 *
 * @example
 * ```tsx
 * <DialTagInput
 *   elementId="skills"
 *   fieldTitle="Skills"
 *   placeholder="Add a skill"
 *   initialTags={['React', 'TypeScript']}
 *   optional
 *   onChange={(tags) => console.log('Updated tags:', tags)}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element.
 * @param [fieldTitle] - Optional label displayed above the input field.
 * @param [initialTags=[]] - Array of tags to be displayed initially.
 * @param [placeholder] - Placeholder text shown when the input is empty.
 * @param [errorText] - Error message displayed below the field when validation fails.
 * @param [optional=false] - Whether the field is optional (renders an “optional” indicator).
 * @param [invalid=false] - Whether the field should be styled as invalid.
 * @param [disabled=false] - Whether the input and remove buttons are disabled.
 * @param [onChange] - Callback fired whenever the tag list changes (tag added or removed).
 */
export const DialTagInput: FC<DialTagInputProps> = ({
  initialTags = [],
  fieldTitle,
  optional,
  elementId,
  placeholder,
  errorText,
  invalid,
  disabled,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [wraps, setWraps] = useState(false);

  const addTag = (value: string) => {
    const trimmed = value.trim().replace(/,$/, '');
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [trimmed, ...tags];
      setTags(newTags);
      onChange?.(newTags);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const hasWrapped =
          containerRef.current.scrollHeight >
          containerRef.current.clientHeight + 10;
        setWraps(hasWrapped);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [tags]);

  return (
    <div className={classNames('flex flex-col w-full')}>
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
      />
      <div
        className={classNames(
          'dial-input min-h-[38px] p-[6px]',
          invalid && 'dial-input-error',
          disabled && 'dial-input-disable',
        )}
      >
        <div
          ref={containerRef}
          className={classNames(
            'flex flex-wrap gap-2 items-center',
            wraps ? 'flex-col-reverse' : 'flex-row',
          )}
        >
          {tags.map((tag, index) => (
            <DialTag
              key={tag + index}
              tag={tag}
              remove={!disabled ? () => handleRemove(index) : undefined}
            />
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={classNames(
              'dial-input-no-border outline-none border-none w-full min-w-[100px] flex-1 p-1',
            )}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      </div>
      <DialErrorText errorText={errorText} />
    </div>
  );
};
