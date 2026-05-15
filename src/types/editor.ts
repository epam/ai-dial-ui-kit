import type { editor } from 'monaco-editor';

export type JSONEditorError = editor.IMarker;
export type JSONEditorThemeConfig = editor.IStandaloneThemeData;

export interface JSONEditorErrorNotification extends JSONEditorError {
  id: string;
}

export enum EditorThemes {
  dark = 'dark',
  light = 'light',
}
