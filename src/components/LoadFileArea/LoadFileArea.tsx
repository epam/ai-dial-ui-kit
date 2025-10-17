import type { FC, MouseEvent, ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  DialEmptyFileArea,
  type DialEmptyFileAreaProps,
} from './EmptyFileArea';
import { DialFilledInput } from './FilledInput';
import { DialRemoveButton } from '@/components/RemoveButton/RemoveButton';

export interface DialLoadFileAreaProps extends DialEmptyFileAreaProps {
  files?: File[];
  dynamicIcon?: (name: string) => ReactNode;
  iconBeforeInput?: ReactNode;
  isInvalid?: (file: File) => boolean;
  errorText?: string;
  removeButtonAriaLabel?: string;
}

export const DialLoadFileArea: FC<DialLoadFileAreaProps> = (props) => {
  const {
    files,
    iconBeforeInput,
    dynamicIcon,
    onChange: onChangeFile,
    isInvalid,
    errorText,
    removeButtonAriaLabel,
  } = props;

  const removeClick = (e: MouseEvent, fileUrl: string) => {
    e.stopPropagation();
    onChangeFile(files?.filter((f) => f.name !== fileUrl) || []);
  };

  const removeFile = (fileUrl: string) => (
    <DialRemoveButton
      ariaLabel={removeButtonAriaLabel}
      onClick={(e) => removeClick(e, fileUrl)}
    />
  );

  const onChange = (files: File[]) => {
    onChangeFile(files);
  };

  return !files || files.length === 0 ? (
    <DndProvider backend={HTML5Backend}>
      <DialEmptyFileArea {...props} onChange={onChange} />
    </DndProvider>
  ) : (
    <div className="flex-1 min-h-0 border border-solid border-primary rounded">
      {files && files.length > 0 && (
        <div className="max-h-full overflow-y-auto">
          {files.map((file, index) => (
            <DialFilledInput
              key={file.name + index}
              elementId={file.name}
              value={file.name}
              iconAfter={removeFile(file.name)}
              iconBefore={iconBeforeInput || dynamicIcon?.(file.name)}
              invalid={isInvalid?.(file)}
              errorText={errorText}
            />
          ))}
        </div>
      )}
    </div>
  );
};
