import { createContext, useContext } from 'react';
import type React from 'react';
import type {
  JsonSchema,
  JsonSchemaDef,
  SchemaRendererTexts,
} from '@/components/SchemaRenderer/types';

interface SchemaRendererContextValue {
  rootSchema: JsonSchema;
  texts: SchemaRendererTexts;
  readonly?: boolean;
  defaultExpanded?: boolean;
  inputClassName?: string;
  renderField?: (
    path: string[],
    schema: JsonSchemaDef,
    defaultElement: React.ReactElement,
  ) => React.ReactNode;
  touchedPaths?: ReadonlySet<string>;
  markTouched?: (path: string) => void;
  skipUntouched?: boolean;
}

export const SchemaRendererContext =
  createContext<SchemaRendererContextValue | null>(null);

export function useSchemaContext(): SchemaRendererContextValue {
  const ctx = useContext(SchemaRendererContext);
  if (!ctx)
    throw new Error('useSchemaContext must be used inside DialSchemaRenderer');
  return ctx;
}
