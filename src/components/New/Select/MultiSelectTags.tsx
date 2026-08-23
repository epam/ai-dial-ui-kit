import type { FC, MouseEvent } from 'react';

import { Tag } from '@/components/New/Tag/Tag';
import type { SelectOption } from '@/models/select';

export interface MultiSelectTagsProps {
  options: SelectOption[];
  selectedValues: string[];
  handleRemoveTag?: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    val: string,
  ) => void;
}

/**
 * The selected values of a multi-select, rendered as removable tags inside the
 * Design system 2.0
 * field.
 *
 * @param options - All available options, used to resolve labels and icons
 * @param selectedValues - Values currently selected
 * @param [handleRemoveTag] - Called with the value whose tag was removed; when omitted the tags are not removable
 */
export const MultiSelectTags: FC<MultiSelectTagsProps> = ({
  options,
  selectedValues,
  handleRemoveTag,
}) => {
  return (
    <>
      {selectedValues.map((v) => {
        const option = options.find((o) => o.value === v);
        return (
          <Tag
            key={v}
            label={option?.label ?? v}
            closable={!!handleRemoveTag}
            onRemove={(e) => handleRemoveTag?.(e, v)}
            // `Tag` wraps the icon in its own `aria-hidden` box, so it needs no
            // wrapper of its own here.
            icon={option?.icon}
            className="max-w-full"
          />
        );
      })}
    </>
  );
};
