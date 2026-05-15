export const getPageRange = (totalPages: number): number[] => {
  if (totalPages <= 0) return [];
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};
