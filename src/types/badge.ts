/** How a `Badge` is drawn. */
export enum BadgeVariant {
  /** A neutral label with a border on the sunken layer, for topics and plain categories. */
  Outlined = 'outlined',
  /** A pill filled with one of the visual colours, for a label that is told apart by colour. */
  Filled = 'filled',
}

/** The visual colour of a `BadgeVariant.Filled` badge. */
export enum BadgeColor {
  Blue = 'blue',
  Green = 'green',
  Violet = 'violet',
  Indigo = 'indigo',
  Brown = 'brown',
  Red = 'red',
}
