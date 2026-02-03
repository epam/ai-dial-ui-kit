import { IconTrashX } from '@tabler/icons-react';
import { type FC } from 'react';

import { type DialButtonProps } from '@/components/Button/Button';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { ButtonAppearance } from '@/types/button';
import { DialErrorIconButton } from '@/components/IconButton/IconButtonWrappers';

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
 * @component
 * @param {DialRemoveButtonProps} props - The properties for the remove button component.
 * @param {string} [props.iconClassName] - Optional CSS class applied to the trash icon for styling or sizing.
 * @returns {JSX.Element} The rendered remove button component.
 */
export const DialRemoveButton: FC<DialRemoveButtonProps> = ({
  iconClassName,
  ...props
}) => {
  return (
    <DialErrorIconButton
      {...props}
      appearance={ButtonAppearance.Ghost}
      icon={<IconTrashX {...BASE_ICON_PROPS} className={iconClassName || ''} />}
    />
  );
};
