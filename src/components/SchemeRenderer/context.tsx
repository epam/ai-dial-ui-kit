import { createContext, useContext } from 'react';
import type {
  JsonSchema,
  SchemaRendererTexts,
} from '@/components/SchemeRenderer/types';

interface SchemaRendererContextValue {
  rootSchema: JsonSchema;
  texts: SchemaRendererTexts;
}

export const SchemaRendererContext =
  createContext<SchemaRendererContextValue | null>(null);

export function useSchemaContext(): SchemaRendererContextValue {
  const ctx = useContext(SchemaRendererContext);
  if (!ctx)
    throw new Error('useSchemaContext must be used inside DialSchemeRenderer');
  return ctx;
}
