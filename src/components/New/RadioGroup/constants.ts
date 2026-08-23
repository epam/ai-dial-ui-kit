import { RadioGroupOrientation } from '@/types/radio-group';

/** Label, options and caption/error stack, matching the 2.0 field rhythm. */
export const groupBaseClassName = 'flex flex-col gap-2';

export const optionsWrapperBaseClassName = 'flex';

/**
 * Content revealed under the selected option. The inline offset is the one
 * `Radio` gives its own caption, so the content lines up with the option's
 * label text rather than with its circle.
 */
export const selectedContentClassName = 'mt-2 ml-[26px]';

export const orientationClassMap: Record<RadioGroupOrientation, string> = {
  [RadioGroupOrientation.Column]: 'flex-col gap-y-3',
  [RadioGroupOrientation.Row]: 'flex-row flex-wrap gap-x-4 gap-y-3',
};
