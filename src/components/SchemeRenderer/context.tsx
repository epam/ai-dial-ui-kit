import { createContext, useContext } from 'react';
import type { JsonSchema } from '@/components/SchemeRenderer/types';

interface SchemaRendererContextValue {
  rootSchema: JsonSchema;
}

export const SchemaRendererContext =
  createContext<SchemaRendererContextValue | null>(null);

export function useSchemaContext(): SchemaRendererContextValue {
  const ctx = useContext(SchemaRendererContext);
  if (!ctx)
    throw new Error('useSchemaContext must be used inside DialSchemeRenderer');
  return ctx;
}
