export interface PropEntry {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface ComponentEntry {
  name: string;
  category: string;
  description: string;
  props: PropEntry[];
  examples: string[];
  sourceFile: string;
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
