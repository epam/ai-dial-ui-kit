import { DialButton } from '@/components/Button/Button';
import { mergeClasses } from '@/utils/merge-classes';
import { IconCopyMinus } from '@tabler/icons-react';
import { useMemo, type ReactNode } from 'react';

interface useTreeAdditionalButtonsOptions {
  additionalButtons?: ReactNode;
  expandedPathsLength: number;
  collapseAll: () => void;
}

export const useTreeAdditionalButtons = ({
  additionalButtons,
  expandedPathsLength,
  collapseAll,
}: useTreeAdditionalButtonsOptions) => {
  const isCollapseAllDisabled = expandedPathsLength === 0;

  const buttons = useMemo(() => {
    const buttonClass = mergeClasses([
      'hover:text-accent-primary p-1',
      isCollapseAllDisabled &&
        'text-controls-disable hover:text-controls-disable disabled:hover:cursor-default',
    ]);

    return (
      <>
        {additionalButtons}
        <DialButton
          disabled={isCollapseAllDisabled}
          className={buttonClass}
          onClick={collapseAll}
          iconBefore={<IconCopyMinus size={24} stroke={1.5} />}
        />
      </>
    );
  }, [additionalButtons, isCollapseAllDisabled, collapseAll]);

  return {
    additionalButtons: buttons,
  };
};
