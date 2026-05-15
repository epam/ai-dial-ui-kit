export const MANY_PAGES_THRESHOLD = 7;
export const ADJACENT_WINDOW = 2;

export const getPageRange = (totalPages: number): number[] => {
  if (totalPages <= 0) return [];
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

export type PageDisplayType = 'active' | 'adjacent' | 'far';

export const getPageDisplayType = (
  p: number,
  currentPage: number,
  totalPages: number,
): PageDisplayType => {
  if (p === currentPage) return 'active';
  if (totalPages < MANY_PAGES_THRESHOLD) return 'adjacent';
  if (Math.abs(p - currentPage) <= ADJACENT_WINDOW) return 'adjacent';
  return 'far';
};
