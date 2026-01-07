import type { FC } from 'react';
import { DialButton } from '@/components/Button/Button';
import {
  DialNeutralButton,
  DialPrimaryButton,
} from '@/components/Button/ButtonWrappers';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { BASE_ICON_PROPS } from '@/constants/icon';
import type { DropdownItem } from '@/models/dropdown';
import { ButtonAppearance } from '@/types/button';
import { IconX, IconDotsVertical } from '@tabler/icons-react';
import { ACTIONS_GAP, CONTAINER_PADDING } from './constants';
import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';
import { useFlexibleActions } from '@/hooks/use-flexible-actions';
import { FlexibleActionsDirection } from '@/types/flexible-actions';

export interface DialActionDropdownItem extends DropdownItem {
  title: string;
}

export interface DialFileManagerBulkActionsToolbarProps {
  getSelectionLabel: (selectedCount: number) => string;
  onClearSelection: () => void;
  actions: DialActionDropdownItem[];
  selectedCount: number;
}

/**
 * A responsive toolbar component displayed when files or items are selected
 * in the file manager. It shows a label with the number or name of selected
 * items and provides contextual action buttons.
 *
 * On smaller screens or when there’s not enough horizontal space,
 * some action buttons are automatically moved into a dropdown menu.
 *
 * **Key Features:**
 * - Dynamically measures available container width to determine how many actions
 *   can fit inline.
 * - Uses a hidden measurement container to precisely calculate button widths.
 * - Automatically moves overflow actions into a "More" dropdown (`IconDotsVertical`).
 * - Responsive design with support for mobile layout via `useIsMobileScreen`.
 *
 * **Layout logic:**
 * - `measureRef`: hidden element used to measure the width of each button.
 * - `containerRef`: visible container where the toolbar is rendered.
 * - `leftSectionRef`: left section containing the "selected items" button.
 * - `visibleCount`: dynamically updated number of visible actions.
 * - Uses `ResizeObserver` + `requestAnimationFrame` to update layout on resize.
 *
 * @example
 * ```tsx
 * <DialFileManagerSelectionToolbar
 *   getSelectionLabel={(count) => `${count} files selected`}
 *   onClearSelection={() => console.log('Cleared')}
 *   actions={[
 *     { key: 'download', title: 'Download', icon: <IconDownload />, onClick: () => {} },
 *     { key: 'delete', title: 'Delete', icon: <IconTrash />, onClick: () => {} },
 *   ]}
 * />
 * ```
 *
 * @param {object} props
 * @param {() => string} props.getSelectionLabel - Function to get the label showing current selection status (e.g., "3 files selected").
 * @param {() => void} props.onClearSelection - Callback invoked when the clear selection button is clicked.
 * @param {DialActionDropdownItem[]} props.actions - List of available toolbar actions.
 *   Each action defines a title, icon, key, and optional click handler.
 * @param {number} [props.selectedCount] - Count of currently selected items.
 *
 * @returns {JSX.Element} A responsive toolbar that adjusts visible actions based on available width.
 */
export const DialFileManagerBulkActionsToolbar: FC<
  DialFileManagerBulkActionsToolbarProps
> = ({ getSelectionLabel, onClearSelection, actions, selectedCount }) => {
  const isMobile = useIsMobileScreen();

  const {
    refs: { containerRef, leftSectionRef, measureRef },
    visibleActions,
    hiddenActions,
  } = useFlexibleActions({
    actions,
    direction: FlexibleActionsDirection.Reverse,
    dependencies: [isMobile],
    actionsGap: ACTIONS_GAP,
    containerPadding: CONTAINER_PADDING,
  });

  const selectionLabel = getSelectionLabel(selectedCount);

  return (
    <>
      <div
        ref={measureRef}
        className="absolute top-0 left-0 invisible pointer-events-none overflow-hidden whitespace-nowrap flex gap-3"
      >
        {actions.map(({ key, icon, title }) => (
          <DialNeutralButton
            key={key}
            iconBefore={icon}
            label={title}
            hideTitleOnMobile
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="rounded bg-layer-0 p-2 flex justify-between items-center w-full"
        role="toolbar"
        aria-label="File bulk actions"
      >
        <div ref={leftSectionRef}>
          <DialPrimaryButton
            label={selectionLabel}
            onClick={onClearSelection}
            textClassName="text-accent-primary whitespace-nowrap"
            appearance={ButtonAppearance.Ghost}
            iconBefore={
              <IconX {...BASE_ICON_PROPS} className="text-accent-primary" />
            }
          />
        </div>

        <div className="flex flex-1 w-full gap-3 items-center justify-end">
          {hiddenActions.length > 0 && (
            <DialDropdown
              menu={{ items: hiddenActions }}
              allowedPlacements={['bottom', 'bottom-start']}
            >
              <DialButton
                className="h-[38px]"
                iconBefore={
                  <IconDotsVertical
                    {...BASE_ICON_PROPS}
                    className="text-secondary hover:text-accent-primary"
                  />
                }
              />
            </DialDropdown>
          )}

          {visibleActions.map(({ key, icon, title, onClick, disabled }) => (
            <DialNeutralButton
              className="!p-[9px]"
              key={key}
              iconBefore={icon}
              label={title}
              hideTitleOnMobile
              disabled={disabled}
              onClick={(domEvent) => onClick?.({ key, domEvent })}
            />
          ))}
        </div>
      </div>
    </>
  );
};
