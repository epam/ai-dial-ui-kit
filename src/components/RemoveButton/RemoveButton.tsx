import { type FC } from 'react';
import { IconTrashX } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialButton, type DialButtonProps } from '@/components/Button/Button';

export interface DialRemoveButtonProps
  extends Omit<DialButtonProps, 'iconBefore' | 'iconAfter'> {
  iconClassName?: string;
}

/**
 * A specialized button component for removal or delete actions.
 *
 * Renders a `DialButton` with a predefined trash icon (`IconTrashX`) as the leading icon.
 * Additional props are passed directly to the underlying `DialButton`.
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
    <DialButton
      {...props}
      iconBefore={
        <IconTrashX {...BASE_ICON_PROPS} className={iconClassName || ''} />
      }
    />
  );
};
