export interface PropEntry {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface LazyComponentEntry {
  loaderExportName: string;
  packageImport: string;
  ssr: false;
  nextDynamicExample: string;
}

/**
 * Component generation. `2.0` components live under `src/components/New/` and
 * are exported without the `Dial` prefix; everything else is `1.0`.
 */
export type ComponentGeneration = '1.0' | '2.0';

export interface ComponentEntry {
  name: string;
  category: string;
  /** `2.0` components are the current design system and should be preferred. */
  generation: ComponentGeneration;
  /**
   * Present on `1.0` components that have a `2.0` replacement — the name of
   * that replacement (e.g. `DialButton` → `Button`).
   */
  supersededBy?: string;
  description: string;
  props: PropEntry[];
  examples: string[];
  sourceFile: string;
  lazy?: LazyComponentEntry;
}

export interface TypeMember {
  name: string;
  value: string;
  comment?: string;
}

export interface TypeEntry {
  name: string;
  kind: 'enum' | 'interface' | 'type';
  description?: string;
  members?: TypeMember[];
  typeBody?: string; // RHS text for type aliases, e.g. "'sm' | 'md' | 'lg'"
  sourceFile: string;
}

export interface ExportEntry {
  name: string;
  description?: string;
  signature?: string;
  sourceFile: string;
}

export interface KitInfo {
  name: string;
  description: string;
  installation: string;
  cssImport: string;
  peerDependencies: Record<string, string>;
  setupNotes: string;
}

export interface Manifest {
  version: string;
  generatedAt: string;
  kit: KitInfo;
  styles: string;
  theming: string;
  components: ComponentEntry[];
  types: TypeEntry[];
  hooks: ExportEntry[];
  utils: ExportEntry[];
  constants: ExportEntry[];
}
