import { type FC, type HTMLAttributes } from 'react';

import { mergeClasses } from '@/utils/merge-classes';

export type CardShellProps = HTMLAttributes<HTMLElement>;

/**
 * A shared elevated card shell used as the base wrapper for browse-grid cards.
 *
 * Renders an `<article>` with rounded corners, padding, a resting shadow, and
 * a hover lift with a stronger shadow. Respects `prefers-reduced-motion` by
 * disabling the transform/shadow transition and hover lift.
 *
 * @param [className] - Additional CSS classes applied to the card container
 * @param [children] - Content rendered inside the card
 */
export const CardShell: FC<CardShellProps> = ({
  className,
  children,
  ...props
}) => (
  <article
    {...props}
    className={mergeClasses(
      'relative flex flex-col gap-[14px] rounded-[20px] border-2 border-transparent p-[22px]',
      'bg-layer-0 shadow-md transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      className,
    )}
  >
    {children}
  </article>
);
