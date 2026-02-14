import { DialIconButton } from '@/components/IconButton/IconButton';
import { mergeClasses } from '@/utils/merge-classes';
import { IconCopyMinus } from '@tabler/icons-react';
import { useMemo, type ReactNode } from 'react';
import { ButtonSize } from '@/types/button';

interface useTreeAdditionalButtonsOptions {
  additionalButtons?: ReactNode;
  expandedPathsLength: number;
  collapseAll: () => void;
}

/**
 * Provides additional action buttons for the tree component, including a
 * built-in "Collapse All" button. The hook memoizes the returned JSX to avoid
 * unnecessary re-renders and applies disabled state automatically based on
 * the number of expanded paths.
 *
 * @param {ReactNode} [additionalButtons] - Optional custom buttons rendered before the Collapse All button.
 * @param {number} expandedPathsLength - Number of currently expanded paths in the tree.
 * @param {() => void} collapseAll - Callback fired when the Collapse All button is clicked.
 *
 * @returns {{ additionalButtons: ReactNode }} - The rendered buttons fragment.
 */
export const useTreeAdditionalButtons = ({
  additionalButtons,
  expandedPathsLength,
  collapseAll,
}: useTreeAdditionalButtonsOptions) => {
  const isCollapseAllDisabled = expandedPathsLength === 0;

  const buttons = useMemo(() => {
    const buttonClass = mergeClasses([
      'hover:text-accent-primary',
      isCollapseAllDisabled &&
        'text-controls-disable hover:text-controls-disable disabled:hover:cursor-default',
    ]);

    return (
      <>
        {additionalButtons}
        <DialIconButton
          disabled={isCollapseAllDisabled}
          className={buttonClass}
          size={ButtonSize.Small}
          onClick={collapseAll}
          icon={<IconCopyMinus size={24} stroke={1.5} />}
          aria-label="collapse-all"
        />
      </>
    );
  }, [additionalButtons, isCollapseAllDisabled, collapseAll]);

  return {
    additionalButtons: buttons,
  };
};
