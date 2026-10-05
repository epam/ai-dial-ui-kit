export enum SelectSize {
  Sm = 'sm',
  Md = 'md',
}

export enum SelectVariant {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

/**
 * What a 2.0 multi-select does when its tags outgrow the field.
 */
export enum SelectTagsOverflow {
  /** The tags wrap onto further rows and the field grows. */
  Wrap = 'wrap',
  /** The tags stay on one row; those that do not fit collapse into a `+N` counter. */
  Collapse = 'collapse',
}
