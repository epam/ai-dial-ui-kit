import { type JSONEditorThemeConfig, EditorThemes } from '@/types/editor';

export const EDITOR_THEMES_CONFIG: Record<EditorThemes, JSONEditorThemeConfig> =
  {
    [EditorThemes.dark]: {
      base: 'vs-dark',
      inherit: false,
      rules: [
        { token: 'string.key.json', foreground: '#37BABC' },
        { token: 'string.value.json', foreground: '#5C8DEA' },
        { token: 'number', foreground: '#D97C27' },
        { token: 'keyword.json', foreground: '#F4CE46' },
        { token: 'delimiter', foreground: '#EEF1F7' },
        { token: 'delimiter.bracket.json', foreground: '#A972FF' },
        { token: 'delimiter.parenthesis', foreground: '#A972FF' },
      ],
      colors: {
        'editor.foreground': '#F76464',
        'editor.background': '#161B2D',
        'editorCursor.foreground': '#EEF1F7',
        'editor.selectionBackground': '#5C8DEA2B',
        'editorLineNumber.foreground': '#242C42',
        'scrollbarSlider.background': '#242C42',
        'scrollbarSlider.hoverBackground': '#242C42',
        'scrollbarSlider.activeBackground': '#242C42',
      },
    },
    [EditorThemes.light]: {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'string.key.json', foreground: '#009D9F' },
        { token: 'string.value.json', foreground: '#2764D9' },
        { token: 'number', foreground: '#B25500' },
        { token: 'keyword.json', foreground: '#3F3D25' },
        { token: 'delimiter', foreground: '#161B2D' },
        { token: 'delimiter.bracket.json', foreground: '#7E39EC' },
        { token: 'delimiter.parenthesis', foreground: '#7E39EC' },
      ],
      colors: {
        'editor.foreground': '#AE2F2F',
        'editor.background': '#EEF1F7',
        'editorCursor.foreground': '#161B2D',
        'editor.selectionBackground': '#5C8DEA2B',
        'editorLineNumber.foreground': '#242C42',
        'scrollbarSlider.background': '#242C42',
        'scrollbarSlider.hoverBackground': '#242C42',
        'scrollbarSlider.activeBackground': '#242C42',
      },
    },
  };
