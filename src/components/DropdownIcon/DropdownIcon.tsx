import { IconChevronDown } from '@tabler/icons-react';
import { type FC, type ReactNode, useState } from 'react';

import {
  DialDropdown,
  type DialDropdownProps,
} from '@/components/Dropdown/Dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialDropdownIconProps extends Omit<
  DialDropdownProps,
  'children' | 'className'
> {
  icon: ReactNode;
  ariaLabel: string;
  size?: ElementSize;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  caretIcon?: ReactNode;
  showCaret?: boolean;
}

/**
 * A compact icon trigger with a dropdown menu.
 * aliases: ModelPicker|IconMenu|AvatarDropdown
 * Design system 1.0
 *
 * @example
 * ```tsx
 * <DialDropdownIcon
 *   ariaLabel="Select model"
 *   icon={<IconBrandOpenai size={18} />}
 *   items={items}
 * />
 * ```
 *
 * @param items - Menu items to display.
 * @param icon - Primary trigger icon.
 * @param ariaLabel - Accessible name for the trigger button.
 * @param [size=ElementSize.Standard] - Trigger size.
 * @param [className] - Additional CSS classes applied to the dropdown wrapper.
 * @param [buttonClassName] - Additional CSS classes applied to the trigger button.
 * @param [iconClassName] - Additional CSS classes applied to the primary icon wrapper.
 * @param [caretIcon] - Custom caret icon.
 * @param [showCaret=true] - Whether to render the caret.
 */
export const DialDropdownIcon: FC<DialDropdownIconProps> = ({
  icon,
  ariaLabel,
  size = ElementSize.Standard,
  disabled = false,
  className,
  buttonClassName,
  iconClassName,
  caretIcon = <IconChevronDown size={DIAL_ICON_SIZE.SM} />,
  showCaret = true,
  placement = 'bottom-start',
  matchReferenceWidth = false,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  ...dropdownProps
}) => {
  const isSmall = size === ElementSize.Small;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const squareSizeClass = isSmall ? 'w-8 px-0' : 'w-10 px-0';
  const iconSizeClass = {
    [ElementSize.Small]: 'size-5',
    [ElementSize.Standard]: 'size-6',
    [ElementSize.Large]: 'size-7',
  };

  const handleOpenChange = (value: boolean) => {
    setUncontrolledOpen(value);
    onOpenChange?.(value);
  };

  return (
    <DialDropdown
      {...dropdownProps}
      disabled={disabled}
      placement={placement}
      matchReferenceWidth={matchReferenceWidth}
      className={className}
      open={isOpen}
      onOpenChange={handleOpenChange}
      defaultOpen={defaultOpen}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        className={mergeClasses(
          'group flex items-center justify-center rounded border border-transparent bg-layer-4 text-primary',
          'enabled:hover:bg-accent-primary-alpha enabled:active:bg-controls-accent-primary-alpha-active',
          'focus-visible:border-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:text-controls-secondary-disable disabled:opacity-75',
          isSmall ? 'h-8 px-2' : 'h-10 px-2',
          !showCaret ? squareSizeClass : undefined,
          buttonClassName,
        )}
      >
        <DialIcon
          icon={icon}
          className={mergeClasses(
            'flex items-center justify-center text-inherit',
            iconSizeClass[size],
            showCaret && '-mr-2',
            iconClassName,
          )}
        />
        {showCaret && (
          <div className="relative z-10 inline-grid size-5 shrink-0 place-items-center">
            <div className="absolute inset-0 rounded-full bg-layer-2" />
            <DialIcon
              icon={caretIcon}
              className={mergeClasses(
                'relative flex items-center justify-center text-secondary transition-transform group-hover:text-primary group-disabled:text-controls-secondary-disable',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        )}
      </button>
    </DialDropdown>
  );
};
