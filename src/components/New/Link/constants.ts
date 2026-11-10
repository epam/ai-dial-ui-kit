import { LinkVariant } from '@/types/link';
import { ElementSize } from '@/types/size';

/** The colour and state rules of each variant, in `link.scss`. */
export const linkVariantClassMap: Record<LinkVariant, string> = {
  [LinkVariant.Primary]: 'dial-kit-link-primary',
  [LinkVariant.Neutral]: 'dial-kit-link-neutral',
  [LinkVariant.Inverted]: 'dial-kit-link-inverted',
};

/** The sizes a link is designed in. */
export type LinkSize = ElementSize.Standard | ElementSize.Small;

/**
 * Size and weight. Primary and Inverted are semibold, Neutral is regular; both
 * keep the paragraph leading (24px / 16px) of the design.
 */
export const linkTypographyClassMap: Record<
  LinkVariant,
  Record<LinkSize, string>
> = {
  [LinkVariant.Primary]: {
    [ElementSize.Standard]: 'dial-small-paragraph-semi-text',
    [ElementSize.Small]: 'dial-tiny-semi-text',
  },
  [LinkVariant.Neutral]: {
    [ElementSize.Standard]: 'dial-small-paragraph-text',
    [ElementSize.Small]: 'dial-tiny-text',
  },
  [LinkVariant.Inverted]: {
    [ElementSize.Standard]: 'dial-small-paragraph-semi-text',
    [ElementSize.Small]: 'dial-tiny-semi-text',
  },
};
