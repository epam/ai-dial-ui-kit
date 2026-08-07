import { useMemo, useState, type FC } from 'react';

import { type DialButtonProps } from '@/components/Button/Button';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import type { DropdownItem } from '@/models/dropdown';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button } from '../Button/Button';
import { getButtonChevron } from './constants';

export interface ButtonDropdownProps extends Omit<
  DialButtonProps,
  'iconAfter'
> {
  items: DropdownItem[];
}

/**
 * A Button dropdown component based on DialDropdown component
 * aliases: SplitButton|MenuButton
 *
 * @example
 * ```tsx
 * <ButtonDropdown
 *   title="Click me"
 *   variant={ButtonVariant.Neutral}
 *   items={[{ key: 'profile', label: 'Profile' }, { key: 'logout', label: 'Logout' }]}
 * />
 * ```
 *
 * Inherits all props from DialButton.
 * @param [items] - DropdownItems with actions
 */
export const ButtonDropdown: FC<ButtonDropdownProps> = ({
  variant,
  appearance,
  items,
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const icon = useMemo(() => {
    return getButtonChevron(isDropdownOpen);
  }, [isDropdownOpen]);

  return (
    <div>
      <DialDropdown
        items={items}
        onOpenChange={(open) => setIsDropdownOpen(open)}
      >
        <Button
          {...props}
          iconAfter={icon}
          variant={variant || ButtonVariant.Primary}
          appearance={appearance || ButtonAppearance.Solid}
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
        />
      </DialDropdown>
    </div>
  );
};
