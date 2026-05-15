export const getPageRange = (
  page: number,
  totalPages: number,
  siblingCount: number,
): number[] => {
  if (totalPages <= 0) return [];

  // If total pages fit without ellipsis: siblings*2 + first + last + current + 2 potential ellipses
  const threshold = siblingCount * 2 + 5;
  if (totalPages < threshold) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const count = 3 + 2 * siblingCount;
    return [...Array.from({ length: count }, (_, i) => i + 1), totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const count = 3 + 2 * siblingCount;
    return [
      1,
      ...Array.from({ length: count }, (_, i) => totalPages - count + i + 1),
    ];
  }

  return [
    1,
    ...Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i,
    ),
    totalPages,
  ];
};
