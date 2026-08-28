import { IconUpload } from '@tabler/icons-react';
import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FC,
  type ReactNode,
} from 'react';

import { ErrorText } from '@/components/New/CaptionText/CaptionText';
import { Label, type LabelProps } from '@/components/New/Label/Label';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { matchesAccept } from '@/utils/file-accept';
import { mergeClasses } from '@/utils/merge-classes';

export interface FileDropzoneProps {
  /**
   * Props of the {@link Label} rendered above the area — the name of the field
   * this dropzone fills, e.g. `{ label: 'Attachments', required: true }`. The
   * copy inside the area is `label`, which says how to use the control rather
   * than what it is for.
   */
  labelProps?: LabelProps;
  /** Primary line of copy, e.g. `'Drag and drop it or click here to upload'`. */
  label: ReactNode;
  /** Secondary line of copy, e.g. `'File formats .md, .zip and .skill'`. */
  description?: ReactNode;
  /** Fired with the accepted files when files are picked or dropped. */
  onChange: (files: File[]) => void;
  /**
   * Fired with files that a drop offered but `accept` excluded. The file picker
   * filters by `accept` itself, so this only ever comes from a drop.
   */
  onReject?: (files: File[]) => void;
  /** Comma-separated `accept` tokens, e.g. `'.md,.zip,.skill'` or `'image/*'`. */
  accept?: string;
  /** Whether more than one file can be selected at a time. */
  multiple?: boolean;
  /** Disables picking and dropping. */
  disabled?: boolean;
  /** Error message rendered below the area, which also turns its border red. */
  errorText?: string;
  /** Icon rendered above the copy. Defaults to an upload arrow. */
  icon?: ReactNode;
  /** `id` of the underlying file input. Generated when omitted. */
  id?: string;
  /**
   * Accessible name for the control. Only needed when `label` is a node that
   * carries no text of its own — a string label already names the input.
   */
  ariaLabel?: string;
  /** Additional CSS classes for the drop area. */
  className?: string;
}

/**
 * A dashed drop area that takes files by drag-and-drop or through the file picker.
 * aliases: LoadFileArea|FileUpload|DragDropUpload|UploadArea
 * Design system 2.0
 *
 * The area is a label over a visually hidden file input, so the picker opens on
 * click and the control stays operable by keyboard and announced as a file input
 * without any extra wiring. The border highlights while a drag hovers it.
 *
 * `accept` is enforced on drops as well as in the picker — the browser only
 * filters the latter — so `onChange` never receives a file the caller excluded.
 * Rejected files go to `onReject`; all copy stays with the caller, which keeps
 * validation messages in the consumer's own wording and language.
 *
 * @example
 * ```tsx
 * <FileDropzone
 *   label="Drag and drop it or click here to upload"
 *   description="File formats .md, .zip and .skill"
 *   accept=".md,.zip,.skill"
 *   onChange={(files) => upload(files)}
 *   onReject={() => setError('Unsupported file format')}
 * />
 * ```
 *
 * @param [labelProps] - Props of the {@link Label} naming the field, rendered above the area.
 * @param label - Primary line of copy.
 * @param [description] - Secondary line of copy.
 * @param onChange - Fired with the accepted files.
 * @param [onReject] - Fired with dropped files that `accept` excluded.
 * @param [accept] - Comma-separated `accept` tokens.
 * @param [multiple=false] - Whether more than one file can be selected.
 * @param [disabled=false] - Disables picking and dropping.
 * @param [errorText] - Error message rendered below the area.
 * @param [icon] - Icon rendered above the copy.
 * @param [id] - `id` of the underlying file input.
 * @param [ariaLabel] - Accessible name; needed when `label` carries no text.
 * @param [className] - Additional CSS classes for the drop area.
 */
export const FileDropzone: FC<FileDropzoneProps> = ({
  labelProps,
  label,
  description,
  onChange,
  onReject,
  accept,
  multiple = false,
  disabled = false,
  errorText,
  icon,
  id,
  ariaLabel,
  className,
}) => {
  const generatedId = useId();
  const inputId = id ?? `file-dropzone-${generatedId}`;
  const errorId = errorText ? `${inputId}-error` : undefined;

  const [isDragActive, setIsDragActive] = useState(false);
  // Dragging over a child fires `dragleave` on the area it just left, so the
  // highlight has to count enter/leave pairs rather than trust a single leave.
  const dragDepth = useRef(0);

  const submitFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      const selected = multiple ? files : files.slice(0, 1);
      const accepted = selected.filter((file) => matchesAccept(file, accept));
      const rejected = selected.filter((file) => !matchesAccept(file, accept));

      if (rejected.length > 0) onReject?.(rejected);
      if (accepted.length > 0) onChange(accepted);
    },
    [accept, multiple, onChange, onReject],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      submitFiles(Array.from(event.target.files ?? []));
      // Picking the same file twice is a real case (the user fixed it on disk in
      // between); without this the second pick fires no `change` event.
      event.target.value = '';
    },
    [submitFiles],
  );

  const endDrag = useCallback(() => {
    dragDepth.current = 0;
    setIsDragActive(false);
  }, []);

  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      event.preventDefault();
      dragDepth.current += 1;
      setIsDragActive(true);
    },
    [disabled],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      // Without this the browser treats the area as a non-target and opens the
      // dragged file in the tab instead of dropping it here.
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    if (disabled) return;
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) endDrag();
  }, [disabled, endDrag]);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      if (disabled) return;
      endDrag();
      submitFiles(Array.from(event.dataTransfer?.files ?? []));
    },
    [disabled, endDrag, submitFiles],
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Both labels point at the input, so its accessible name reads as the
          field name followed by the in-area copy. */}
      {labelProps && <Label {...labelProps} htmlFor={inputId} />}
      {/* Kept a sibling of the label rather than a child: `peer-*` variants only
          reach following siblings, and the focus ring belongs on the area. */}
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        aria-label={resolveAccessibleName(
          typeof label !== 'string' ? ariaLabel : undefined,
        )}
        aria-describedby={errorId}
        aria-invalid={errorText ? true : undefined}
        className="peer sr-only"
      />
      <label
        htmlFor={inputId}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={mergeClasses(
          'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center',
          'transition-colors motion-reduce:transition-none',
          'peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
          disabled
            ? 'cursor-not-allowed border-secondary bg-layer-sunken'
            : 'cursor-pointer bg-layer-base',
          !disabled && isDragActive && 'border-accent bg-control-accent-alpha',
          !disabled && !isDragActive && 'border-secondary hover:border-accent',
          errorText && !isDragActive && 'border-error hover:border-error',
          className,
        )}
      >
        {icon ?? (
          <IconUpload
            size={DIAL_ICON_SIZE.LG}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
            className={
              disabled ? 'text-control-disable-primary' : 'text-secondary'
            }
          />
        )}
        <span className="flex flex-col gap-1">
          <span
            className={mergeClasses(
              'dial-small-text',
              disabled ? 'text-control-disable-primary' : 'text-primary',
            )}
          >
            {label}
          </span>
          {description && (
            <span
              className={mergeClasses(
                'dial-tiny-text',
                disabled ? 'text-control-disable-primary' : 'text-secondary',
              )}
            >
              {description}
            </span>
          )}
        </span>
      </label>
      <ErrorText id={errorId} text={errorText} />
    </div>
  );
};
