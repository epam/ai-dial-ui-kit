import { useMemo, useState, type FC } from 'react';

import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialButton, type DialButtonProps } from '@/components/Button/Button';
import type { DropdownItem } from '@/models/dropdown';
import { buttonChevronDown, buttonChevronUp } from './constants';
import { ButtonAppearance, ButtonVariant } from '@/types/button';

export interface DialButtonDropdownProps
  extends Omit<DialButtonProps, 'iconAfter'> {
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
 * Inherits all props from DialButton.
 * @param [items] - DropdownItems with actions
 */
export const DialButtonDropdown: FC<DialButtonDropdownProps> = ({
  variant,
  appearance,
  items,
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
          items,
        }}
        onOpenChange={(open) => setIsDropdownOpen(open)}
      >
        <DialButton
          {...props}
          iconAfter={icon}
          variant={variant || ButtonVariant.Primary}
          appearance={appearance || ButtonAppearance.Solid}
        />
      </DialDropdown>
    </div>
  );
};
