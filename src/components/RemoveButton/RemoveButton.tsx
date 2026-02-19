import { IconTrashX } from '@tabler/icons-react';
import { type FC } from 'react';

import { type DialButtonProps } from '@/components/Button/Button';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { ButtonAppearance } from '@/types/button';
import { DialErrorIconButton } from '@/components/IconButton/IconButtonWrappers';
import { DialErrorButton } from '../Button/ButtonWrappers';

export interface DialRemoveButtonProps
  extends Omit<DialButtonProps, 'iconBefore' | 'iconAfter'> {
  iconClassName?: string;
}

/**
 * A specialized button component for removal or delete actions.
 *
 * Renders a `DialErrorButton` with a predefined trash icon (`IconTrashX`) as the leading icon.
 * Additional props are passed directly to the underlying `DialErrorButton`.
 * @example
 * <DialRemoveButton
 *   label="Delete item"
 *   onClick={handleDelete}
 *   iconClassName="text-error"
 * />
 * @params Component properties extending:
 * - {@link DialButtonProps} - Standard button properties (onClick, disabled, etc.) excluding `iconBefore` and `iconAfter` *
 * @param [iconClassName] - Optional CSS class applied to the trash icon for additional styling
 */
export const DialRemoveButton: FC<DialRemoveButtonProps> = ({
  iconClassName,
  label,
  ...props
}) => {
  return label ? (
    <DialErrorButton
      {...props}
      label={label}
      appearance={ButtonAppearance.Ghost}
      iconBefore={
        <IconTrashX {...BASE_ICON_PROPS} className={iconClassName || ''} />
      }
    />
  ) : (
    <DialErrorIconButton
      {...props}
      appearance={ButtonAppearance.Ghost}
      icon={<IconTrashX {...BASE_ICON_PROPS} className={iconClassName || ''} />}
    />
  );
};
