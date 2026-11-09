/**
 * Type scale per state, as the selectable `Tag` draws it: the regular label
 * steps up to semibold once the chip is on.
 */
export const toggleChipLabelClassNames: Record<'default' | 'selected', string> =
  {
    default: 'dial-tiny-text',
    selected: 'dial-tiny-semi-text',
  };

/**
 * Colours of a disabled chip. The `Tag` design defines no disabled state, so
 * these follow the kit's other 2.0 controls — the disabled text colour, and on
 * a chip that is on, the disabled fill `SegmentedControl` gives its selected
 * segment — keeping the on/off state visible while the chip cannot respond.
 */
export const toggleChipDisabledClassNames: Record<
  'default' | 'selected',
  string
> = {
  default: 'cursor-not-allowed text-control-disable-primary',
  selected:
    'cursor-not-allowed bg-control-disable-primary text-control-disable-primary',
};
