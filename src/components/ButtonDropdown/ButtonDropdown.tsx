import { useMemo, useState, type FC } from 'react';

import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialButton, type DialButtonProps } from '@/components/Button/Button';
import type { DropdownItem } from '@/models/dropdown';
import { buttonChevronDown, buttonChevronUp } from './constants';
import { ButtonVariant } from '@/types/button';

export interface DialButtonDropdownProps extends DialButtonProps {
  items: DropdownItem[];
}

/**
 * A Button dropdown component based on DialDropdown component
 *
 * @example
 * ```tsx
 * <DialButtonDropdown
 *   title="Click me"
 *   variant={ButtonVariant.Neutral}
 *   items={[{ key: 'profile', label: 'Profile' }, { key: 'logout', label: 'Logout' }]}
 * />
 * ```
 *
 * @param [title] - The text content of the button
 * @param [variant] - Defines the visual style of the button
 * @param [items] - DropdownItems with actions
 */
export const DialButtonDropdown: FC<DialButtonDropdownProps> = ({
  variant,
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const icon = useMemo(() => {
    return isDropdownOpen ? buttonChevronUp : buttonChevronDown;
  }, [isDropdownOpen]);

  return (
    <div>
      <DialDropdown
        menu={{
          items: props.items,
        }}
        onOpenChange={(open) => setIsDropdownOpen(open)}
      >
        <DialButton
          {...props}
          iconAfter={icon}
          variant={variant || ButtonVariant.Primary}
        />
      </DialDropdown>
    </div>
  );
};
