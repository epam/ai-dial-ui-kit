import type { ReactElement, ReactNode } from 'react';

import type {
  JsonSchema,
  JsonSchemaDef,
  SchemaRendererTexts,
} from '@/models/json-schema';
import type { SchemaRendererVariant } from '@/types/json-schema';

export type SchemaRenderField = (
  path: string[],
  schema: JsonSchemaDef,
  defaultElement: ReactElement,
) => ReactNode;

export interface SchemaRendererProps {
  schema: JsonSchema;
  defaultValue?: Record<string, unknown>;
  texts?: Partial<SchemaRendererTexts>;
  className?: string;
  readonly?: boolean;
  defaultExpanded?: boolean;
  /** Additional classes for the container of every text, number and select field. */
  inputClassName?: string;
  /**
   * `Sections` (default) — every top-level property is a collapsible section card.
   * `Flat` — primitive top-level properties render as labelled fields; object and
   * array properties still use collapsible sections.
   * `FlatSections` — every top-level property renders under a plain heading.
   */
  variant?: SchemaRendererVariant;
  /**
   * When `true`, required-field errors are only shown after the user has interacted
   * with a field. When `false` (default), all unfilled required fields are highlighted immediately.
   */
  skipUntouched?: boolean;
  /**
   * Live resource options for schema properties flagged with `dial:resource: true`.
   * Keyed by the resource type name referenced in a property's `acceptableResourceTypes`
   * array; each value provides the selectable entries for that resource type (a string
   * array for string-typed properties).
   */
  acceptableResourceTypes?: Record<string, unknown>;
  onChange?: (value: Record<string, unknown>) => void;
  onPropertyChange?: (path: string, value: unknown) => void;
  onDefaultValues?: (value: Record<string, unknown>) => void;
  /**
   * Override the rendered element for any field by path. The field's label and
   * error stay outside the element, so an override replaces the control only.
   * Return `defaultElement` to fall back to the built-in renderer.
   * @param path - Array of schema property keys leading to this field (e.g. ['connection', 'token'])
   * @param schema - The resolved JSON Schema definition for this field
   * @param defaultElement - The element that would be rendered without customization
   */
  renderField?: SchemaRenderField;
}

export interface SchemaFieldContentProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
  required?: boolean;
  suppressInlineError?: boolean;
  /** The id given to a primitive control, so a visible label can point at it. */
  fieldId?: string;
  /**
   * Accessible name for the control. Sections, array items and key-value rows
   * have no visible label next to their control, so this is what names it.
   */
  ariaLabel?: string;
}

export interface SchemaFieldProps extends Omit<
  SchemaFieldContentProps,
  'fieldId' | 'ariaLabel' | 'suppressInlineError'
> {
  label?: string;
}

export interface SchemaRendererContextValue {
  rootSchema: JsonSchema;
  texts: SchemaRendererTexts;
  readonly?: boolean;
  defaultExpanded?: boolean;
  inputClassName?: string;
  acceptableResourceTypes?: Record<string, unknown>;
  renderField?: SchemaRenderField;
  touchedPaths?: ReadonlySet<string>;
  markTouched?: (path: string) => void;
  skipUntouched?: boolean;
}
