export const MANY_PAGES_THRESHOLD = 7;
export const ADJACENT_WINDOW = 2;

export const getPageRange = (totalPages: number): number[] => {
  if (totalPages <= 0) return [];
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

export enum PageDisplayType {
  Active = 'active',
  Adjacent = 'adjacent',
  Far = 'far',
}

export const getPageDisplayType = (
  p: number,
  currentPage: number,
  totalPages: number,
): PageDisplayType => {
  if (p === currentPage) return PageDisplayType.Active;
  if (totalPages < MANY_PAGES_THRESHOLD) return PageDisplayType.Adjacent;
  if (Math.abs(p - currentPage) <= ADJACENT_WINDOW)
    return PageDisplayType.Adjacent;
  return PageDisplayType.Far;
};
