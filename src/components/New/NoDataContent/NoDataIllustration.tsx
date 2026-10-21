import type { FC } from 'react';

/** Rows of the placeholder list, by the top of each row's avatar. */
const ROW_OFFSETS = [12, 40, 68];

/**
 * The empty-state illustration: a card holding three placeholder list rows.
 * Every colour comes from a layer or stroke token, so it follows the theme
 * instead of staying a light card on a dark surface.
 */
export const NoDataIllustration: FC = () => (
  <svg
    width={121}
    height={97}
    viewBox="0 0 121 97"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x={0.5}
      y={0.5}
      width={120}
      height={96}
      rx={16}
      className="fill-layer-0 stroke-tertiary"
    />
    {ROW_OFFSETS.map((top) => (
      <g key={top}>
        <circle cx={20.5} cy={top + 8.5} r={8} className="fill-layer-1" />
        <rect
          x={36.5}
          y={top + 1}
          width={56}
          height={6}
          rx={3}
          className="fill-layer-1"
        />
        <rect
          x={36.5}
          y={top + 11}
          width={34}
          height={5}
          rx={2.5}
          className="fill-layer-2"
        />
      </g>
    ))}
  </svg>
);
