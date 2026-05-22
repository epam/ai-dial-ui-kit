import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { FileManagerGridRow } from './FileManagerContext';
import type { DialFileAcceptType } from '@/models/file-manager';
import { DialTooltipContainer } from '../Tooltip/TooltipContainer';
import { DialTooltipTrigger } from '../Tooltip/TooltipTrigger';
import classNames from 'classnames';
import { DialTooltipContent } from '../Tooltip/TooltipContent';

interface FileManagerTooltipProps {
  disabledGridRowIds: Set<string>;
  gridRows: FileManagerGridRow[];
  getDisabledTooltip?: (row: FileManagerGridRow) => string | undefined;
  getRowDisabledTooltip: (
    row: FileManagerGridRow,
    allowedFileTypes?: DialFileAcceptType[],
    maxSelectableFileSize?: number,
  ) => string | undefined;
  allowedFileTypes?: DialFileAcceptType[];
  maxSelectableFileSize?: number;
}

export const FileManagerTooltip = ({
  disabledGridRowIds,
  gridRows,
  getDisabledTooltip,
  getRowDisabledTooltip,
  allowedFileTypes,
  maxSelectableFileSize,
}: FileManagerTooltipProps) => {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredRowRect, setHoveredRowRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHoveredRowId(null);
      setHoveredRowRect(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as globalThis.MouseEvent;
      const rowTarget = (mouseEvent.target as HTMLElement).closest(
        '.ag-row',
      ) as HTMLElement | null;
      if (!rowTarget) {
        setHoveredRowId((prev) => (prev ? null : prev));
        return;
      }
      const rowId = new DOMParser().parseFromString(
        rowTarget.getAttribute('row-id') || '',
        'text/html',
      ).documentElement.textContent;
      if (rowId && disabledGridRowIds.has(rowId)) {
        setHoveredRowId((prev) => {
          if (prev !== rowId) {
            setHoveredRowRect(rowTarget.getBoundingClientRect());
            return rowId;
          }
          return prev;
        });
      } else {
        setHoveredRowId((prev) => (prev ? null : prev));
      }
    };

    const handleMouseLeave = () => {
      setHoveredRowId(null);
      setHoveredRowRect(null);
    };

    const gridSection = document.querySelector(
      '[aria-label="File Manager Grid View"]',
    );
    if (gridSection) {
      gridSection.addEventListener('mousemove', handleMouseMove);
      gridSection.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        gridSection.removeEventListener('mousemove', handleMouseMove);
        gridSection.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [disabledGridRowIds]);

  const hoveredRowFile = useMemo(() => {
    if (!hoveredRowId) return undefined;
    return gridRows.find((r) => r.path === hoveredRowId);
  }, [hoveredRowId, gridRows]);

  const hoveredRowTooltipContent = useMemo(() => {
    if (!hoveredRowFile) return undefined;

    if (getDisabledTooltip) {
      const tooltip = getDisabledTooltip(hoveredRowFile);
      if (tooltip) return tooltip;
    }

    return getRowDisabledTooltip(
      hoveredRowFile,
      allowedFileTypes,
      maxSelectableFileSize,
    );
  }, [
    hoveredRowFile,
    getDisabledTooltip,
    getRowDisabledTooltip,
    allowedFileTypes,
    maxSelectableFileSize,
  ]);

  return (
    <>
      {hoveredRowTooltipContent &&
        hoveredRowRect &&
        createPortal(
          <DialTooltipContainer open={true} placement="top">
            <DialTooltipTrigger asChild>
              <div
                className={classNames(
                  'fixed z-[-1]',
                  hoveredRowTooltipContent && 'pointer-events-none',
                )}
                style={{
                  top: hoveredRowRect.top,
                  left: hoveredRowRect.left,
                  width: hoveredRowRect.width,
                  height: hoveredRowRect.height,
                }}
              />
            </DialTooltipTrigger>
            <DialTooltipContent className="max-w-[300px] rounded border border-ui-outline-primary bg-ui-popover px-3 py-1.5 text-center text-primary shadow-md fill-ui-popover">
              {hoveredRowTooltipContent}
            </DialTooltipContent>
          </DialTooltipContainer>,
          document.body,
        )}
    </>
  );
};
