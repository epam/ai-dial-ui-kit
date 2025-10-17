import { type FC, type MouseEvent } from 'react';
import { DialButton } from '@epam/ai-dial-ui-kit';
import { IconTrashX } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';

interface DialRemoveButtonProps {
  iconClass?: string;
  cssClass?: string;
  ariaLabel?: string;
  onClick: (e: MouseEvent) => void;
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
 *   iconClass="text-error"
 * />
 * @component
 * @param {DialRemoveButtonProps} props - The properties for the remove button component.
 * @param {string} [props.iconClass] - Optional CSS class applied to the trash icon for styling or sizing.
 * @returns {JSX.Element} The rendered remove button component.
 */
export const DialRemoveButton: FC<DialRemoveButtonProps> = ({
  iconClass,
  ...props
}) => {
  return (
    <DialButton
      iconBefore={
        <IconTrashX {...BASE_ICON_PROPS} className={iconClass || ''} />
      }
      {...props}
    />
  );
};
