import {
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from 'react';

import classNames from 'classnames';
import { DialFieldLabel } from '@/components/Field/Field';
import { DialTag } from './Tag';
import { DialErrorText } from '@/components/ErrorText/ErrorText';

export interface DialTagInputProps {
  elementId: string;
  fieldTitle?: string;
  initialTags?: string[];
  placeholder?: string;
  errorText?: string;
  optional?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: (tags: string[]) => void;
}

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
  const inputRef = useRef<HTMLInputElement>(null);

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
            'flex flex-wrap items-start gap-2',
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
            ref={inputRef}
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
