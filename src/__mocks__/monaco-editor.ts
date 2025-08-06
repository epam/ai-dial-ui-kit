// Mock for monaco-editor to resolve import issues in tests
export const editor = {
  IStandaloneThemeData: {} as Record<string, unknown>,
  IMarker: {} as Record<string, unknown>,
  IStandaloneEditorConstructionOptions: {} as Record<string, unknown>,
};

export default {
  editor,
};
