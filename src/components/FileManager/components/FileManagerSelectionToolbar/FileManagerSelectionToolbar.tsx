import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import { DialButton } from '@/components/Button/Button';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { BASE_ICON_PROPS } from '@/constants/icon';
import type { DropdownItem } from '@/models/dropdown';
import { ButtonVariant } from '@/types/button';
import { IconX, IconDotsVertical } from '@tabler/icons-react';
import { ACTIONS_GAP, CONTAINER_PADDING, MORE_BUTTON_WIDTH } from './constants';
import { useIsMobileScreen } from '@/hooks/use-is-tablet-screen';

export interface DialActionDropdownItem extends DropdownItem {
  title: string;
}

export interface DialFileManagerSelectionToolbarProps {
  selectionLabel: string;
  onClearSelection: () => void;
  actions: DialActionDropdownItem[];
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
 *   selectionLabel="3 files selected"
 *   onClearSelection={() => console.log('Cleared')}
 *   actions={[
 *     { key: 'download', title: 'Download', icon: <IconDownload />, onClick: () => {} },
 *     { key: 'delete', title: 'Delete', icon: <IconTrash />, onClick: () => {} },
 *   ]}
 * />
 * ```
 *
 * @param {object} props
 * @param {string} props.selectionLabel - Label showing current selection status (e.g., "3 files selected").
 * @param {() => void} props.onClearSelection - Callback invoked when the clear selection button is clicked.
 * @param {DialActionDropdownItem[]} props.actions - List of available toolbar actions.
 *   Each action defines a title, icon, key, and optional click handler.
 *
 * @returns {JSX.Element} A responsive toolbar that adjusts visible actions based on available width.
 */
export const DialFileManagerSelectionToolbar: FC<
  DialFileManagerSelectionToolbarProps
> = ({ selectionLabel, onClearSelection, actions }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const leftSectionRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(actions.length);
  const isMobile = useIsMobileScreen();

  const hiddenActions = actions.slice(0, actions.length - visibleCount);
  const visibleActions = actions.slice(actions.length - visibleCount);

  const actionWidthsRef = useRef<number[]>([]);

  useLayoutEffect(() => {
    if (!measureRef.current) return;

    const children = Array.from(measureRef.current.children) as HTMLElement[];
    actionWidthsRef.current = children.map((child) =>
      Math.ceil(child.getBoundingClientRect().width),
    );
  }, [actions, isMobile]);

  useEffect(() => {
    if (!containerRef.current) return;

    let frameId: number | null = null;

    const measureVisible = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const container = containerRef.current!;
        const leftWidth = leftSectionRef.current?.offsetWidth ?? 0;

        const containerWidth = container.getBoundingClientRect().width;
        const availableWidth =
          containerWidth -
          leftWidth -
          MORE_BUTTON_WIDTH -
          ACTIONS_GAP * 2 -
          CONTAINER_PADDING * 2;

        const widths = actionWidthsRef.current;
        let total = 0;
        let count = 0;

        for (let i = widths.length - 1; i >= 0; i--) {
          total += widths[i] + ACTIONS_GAP;
          if (total > availableWidth) break;
          count++;
        }

        setVisibleCount(count);
      });
    };

    const resizeObserver = new ResizeObserver(measureVisible);
    resizeObserver.observe(containerRef.current);
    measureVisible();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [actions.length, isMobile]);

  return (
    <>
      <div
        ref={measureRef}
        className="absolute top-0 left-0 invisible pointer-events-none overflow-hidden whitespace-nowrap flex gap-3"
      >
        {actions.map(({ key, icon, title }) => (
          <DialButton
            key={key}
            iconBefore={icon}
            title={title}
            variant={ButtonVariant.Secondary}
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
          <DialButton
            title={selectionLabel}
            onClick={onClearSelection}
            textCssClass="text-accent-primary whitespace-nowrap"
            variant={ButtonVariant.Tertiary}
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
                cssClass="h-[38px]"
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
            <DialButton
              key={key}
              iconBefore={icon}
              title={title}
              variant={ButtonVariant.Secondary}
              hideTitleOnMobile
              disable={disabled}
              onClick={(domEvent) => onClick?.({ key, domEvent })}
            />
          ))}
        </div>
      </div>
    </>
  );
};
