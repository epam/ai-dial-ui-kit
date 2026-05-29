import { DialTag } from '@/components/Tag/Tag';
import { DialIcon } from '@/components/Icon/Icon';
import type { SelectOption } from '@/models/select';
import type { FC, MouseEvent } from 'react';

export interface DialMultiSelectTagsProps {
  options: SelectOption[];
  selectedValues: string[];
  handleRemoveTag?: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    val: string,
  ) => void;
}

export const DialMultiSelectTags: FC<DialMultiSelectTagsProps> = ({
  options,
  selectedValues,
  handleRemoveTag,
}) => {
  return (
    <div className="flex flex-wrap w-full items-center gap-1">
      {selectedValues.map((v) => {
        const label = options.find((o) => o.value === v)?.label ?? v;
        const icon = options.find((o) => o.value === v)?.icon;
        return (
          <DialTag
            key={v}
            label={label}
            onRemove={(e) => handleRemoveTag?.(e, v)}
            icon={icon ? <DialIcon icon={icon} /> : null}
            className="max-w-full"
          />
        );
      })}
    </div>
  );
};
