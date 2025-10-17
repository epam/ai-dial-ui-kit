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
