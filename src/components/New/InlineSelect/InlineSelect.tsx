import { IconChevronDown } from '@tabler/icons-react';
import type { Placement } from '@floating-ui/react';
import {
  useCallback,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type FC,
} from 'react';
import { DialDropdown } from '../../Dropdown/Dropdown';
import type { DropdownItem } from '../../../models/dropdown';
import { DIAL_ICON_SIZE } from '../../../constants/icon';
import { mergeClasses } from '../../../utils/merge-classes';
import { ElementSize } from '../../../types/size';

export interface InlineSelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Currently selected option's label, shown before the chevron. */
  label: string;
  /** Size of the trigger button. */
  size?: ElementSize;
  /** Whether the inline select is open or not. */
  isOpen?: boolean;
}

export const InlineSelectTrigger: FC<InlineSelectTriggerProps> = ({
  label,
  size,
  isOpen,
  ...rest
}) => {
  const className =
    size === ElementSize.Small ? 'h-[24px] px-2' : 'h-[40px] px-3';

  return (
    <button
      type="button"
      aria-haspopup="menu"
      className={mergeClasses(
        'dial-small-paragraph-text focus-visible:outline-focus focus-visible:outline- focus-visible:outline-1',
        'flex items-center gap-1 rounded-full text-primary disabled:text-controls-disable',
        'hover:bg-control-accent-alpha-hover focus-visible:outline-offset-2 active:bg-control-accent-alpha-active',
        className,
        rest.className,
      )}
      {...rest}
    >
      {label}
      <IconChevronDown
        size={DIAL_ICON_SIZE.MD}
        aria-hidden
        className={mergeClasses('transition-transform', isOpen && 'rotate-180')}
      />
    </button>
  );
};

export interface InlineSelectProps {
  /** Options rendered in the dropdown; each item's `label` is shown on the trigger when selected. */
  items: DropdownItem[];
  /** Controlled key of the selected item. */
  selectedKey?: string;
  /** Initial selected key in uncontrolled mode. Defaults to the first item's key. */
  defaultSelectedKey?: string;
  /** Fired when an item is selected. */
  onSelect?: (item: DropdownItem) => void;
  /** Size of the trigger button. */
  size?: ElementSize;
  /** Disables the trigger and prevents opening the dropdown. */
  disabled?: boolean;
  /** Floating UI placement for the dropdown overlay. */
  placement?: Placement;
  /** Whether the dropdown overlay should match the trigger's width. */
  matchReferenceWidth?: boolean;
  /** Additional CSS classes applied to the dropdown overlay. */
  listClassName?: string;
}

/**
 * An inline select control combining `InlineSelectTrigger` with `DialDropdown`.
 *
 * @example
 * ```tsx
 * <InlineSelect
 *   items={[{ key: 'a', label: 'Option A' }, { key: 'b', label: 'Option B' }]}
 *   onSelect={(item) => console.log(item.key)}
 * />
 * ```
 */
export const InlineSelect: FC<InlineSelectProps> = ({
  items,
  selectedKey,
  defaultSelectedKey,
  onSelect,
  size,
  disabled,
  placement = 'bottom-end',
  matchReferenceWidth = false,
  listClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledSelectedKey, setUncontrolledSelectedKey] = useState(
    defaultSelectedKey ?? items[0]?.key,
  );
  const isControlled = selectedKey !== undefined;
  const activeKey = isControlled ? selectedKey : uncontrolledSelectedKey;

  const activeLabel = useMemo(() => {
    const activeItem = items.find((item) => item.key === activeKey);
    return activeItem?.label ? String(activeItem.label) : '';
  }, [items, activeKey]);

  const handleItemClick = useCallback(
    ({ key }: { key: string }) => {
      const item = items.find((it) => it.key === key);
      if (!item) return;
      if (!isControlled) setUncontrolledSelectedKey(key);
      onSelect?.(item);
    },
    [items, isControlled, onSelect],
  );

  return (
    <DialDropdown
      items={items}
      placement={placement}
      matchReferenceWidth={matchReferenceWidth}
      listClassName={listClassName}
      disabled={disabled}
      onOpenChange={setIsOpen}
      onItemClick={handleItemClick}
    >
      <InlineSelectTrigger
        label={activeLabel}
        size={size}
        isOpen={isOpen}
        disabled={disabled}
      />
    </DialDropdown>
  );
};
