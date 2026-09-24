import { type FC, useId } from 'react';

interface FolderGlyphProps {
  size: number;
}

/**
 * The 2.0 folder glyph: a blue back tab over a grey-to-blue gradient body.
 * Design system 2.0
 *
 * Inlined rather than imported as an SVG asset for two reasons: the gradient
 * `id` comes from `useId`, so a list of folders does not repeat one document-
 * wide id (a hidden first copy would otherwise blank every other gradient);
 * and the colours resolve from theme tokens instead of fixed hex values.
 *
 * @param size - Width and height in px
 */
export const FolderGlyph: FC<FolderGlyphProps> = ({ size }) => {
  // `useId` output contains `:` or `«»`, which are unsafe inside `url(#…)`.
  const gradientId = `dial-kit-folder-gradient-${useId().replace(/[^\w-]/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.38992 3.75H4.66663C3.00977 3.75 1.66663 5.09315 1.66663 6.75V7.91667H7.16339L10.8333 5.79247L7.85075 4.1297C7.40412 3.8807 6.90127 3.75 6.38992 3.75Z"
        fill="var(--stroke-gradient-1, #5976E9)"
      />
      <path
        d="M14.3333 5.41669C16.5424 5.41669 18.3333 7.20755 18.3333 9.41669V12.25C18.3333 14.4592 16.5424 16.25 14.3333 16.25H5.66663C3.45749 16.25 1.66663 14.4592 1.66663 12.25V7.6708C1.66663 7.11851 2.11434 6.6708 2.66663 6.6708H6.89447C7.43998 6.6708 7.97973 6.55922 8.48053 6.34291L9.86582 5.74458C10.3666 5.52827 10.9064 5.41669 11.4519 5.41669H14.3333Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="17.0833"
          y1="5.83335"
          x2="9.38489"
          y2="19.6653"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--stroke-secondary, #D1DBEA)" />
          <stop offset="0.91" stopColor="var(--stroke-gradient-1, #5976E9)" />
        </linearGradient>
      </defs>
    </svg>
  );
};
