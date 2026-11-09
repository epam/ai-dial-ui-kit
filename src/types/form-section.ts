/** How a `FormSection` sets its heading, description and content. */
export enum FormSectionVariant {
  /** A field of a form: small semibold heading, small description, an 8px header gap. */
  Row = 'row',
  /** A titled group of a builder column: caption-lead heading, tiny description. */
  Caption = 'caption',
  /** One setting inside a group: tiny semibold heading, tiny description. */
  Setting = 'setting',
}
