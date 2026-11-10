export enum ButtonVariant {
  // 2.0 variants
  Primary = 'primary',
  Neutral = 'neutral',
  Danger = 'danger',
  Static = 'static',
  Starter = 'starter',
  /** A link button on an inverted surface; pair it with `ButtonAppearance.Link`. */
  Inverted = 'inverted',

  // icon button specific
  Success = 'success',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum ButtonAppearance {
  Solid = 'solid',
  Outlined = 'outlined',
  Ghost = 'ghost',
  Link = 'link', // button specific
}
