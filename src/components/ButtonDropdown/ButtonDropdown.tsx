import { useMemo, useState, type FC } from 'react';

import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialButton } from '@/components/Button/Button';
import type { DropdownItem } from '@/models/dropdown';
import { ButtonVariant } from '@/types/button';
import { buttonChevronDown, buttonChevronUp } from './constants';

export interface DialButtonDropdownProps {
  items: DropdownItem[];
  variant: ButtonVariant;
  title: string;
}

/**
 * A Button dropdown component based on DialDropdown component
 *
 * @example
 * ```tsx
 * <DialButtonDropdown
 *   title="Click me"
 *   variant={ButtonVariant.Secondary}
 *   items=[{ key: 'profile', label: 'Profile' }, { key: 'logout', label: 'Logout' }]
 * />
 * ```
 *
 * @param [title] - The text content of the button
 * @param [variant] - Defines the visual style of the button
 * @param [items] - DropdownItems with actions
 */
export const DialButtonDropdown: FC<DialButtonDropdownProps> = (props) => {
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
        <DialButton {...props} iconAfter={icon} />
      </DialDropdown>
    </div>
  );
};
