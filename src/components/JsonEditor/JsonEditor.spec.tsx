import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialJsonEditor, type DialJsonEditorProps } from './JsonEditor';
import { EditorThemes } from '@/types/editor';
import type { ReactElement } from 'react';
import type { Monaco } from '@monaco-editor/react';

describe('Dial UI Kit :: DialJsonEditor', () => {
  test('Should render the Monaco Editor', () => {
    const mockOnChange = vi.fn();
    render(
      <DialJsonEditor
        value=""
        currentTheme={EditorThemes.dark}
        onChange={mockOnChange}
      />,
    );

    expect(
      screen.getByRole('textbox', { name: 'JSON Editor' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('JSON content')).toBeInTheDocument();
  });

  test('Should call onChange when content changes', async () => {
    const mockOnChange = vi.fn();
    const initialValue = '{"initial": "value"}';
    const newValue = '{"updated": "value"}';

    render(
      <DialJsonEditor
        value={initialValue}
        currentTheme={EditorThemes.dark}
        onChange={mockOnChange}
      />,
    );

    const textarea = screen.getByLabelText('JSON content');
    fireEvent.change(textarea, { target: { value: newValue } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(newValue);
    });
  });

  test('defines the theme and sets JSON diagnostics in beforeMount', () => {
    const currentTheme = EditorThemes.dark;

    const onChange: NonNullable<DialJsonEditorProps['onChange']> = vi.fn();
    const onValidateJSON: NonNullable<DialJsonEditorProps['onValidateJSON']> =
      vi.fn();

    const themesConfig = {
      [currentTheme]: { base: 'vs-dark', inherit: true, rules: [], colors: {} },
    } as unknown as NonNullable<DialJsonEditorProps['themesConfig']>;

    const element = DialJsonEditor({
      value: '{}',
      onChange,
      onValidateJSON,
      currentTheme,
      themesConfig,
    } as DialJsonEditorProps) as ReactElement;

    const { beforeMount } = element.props as {
      beforeMount: (m: Monaco) => void;
    };

    const defineTheme = vi.fn();
    const setDiagnosticsOptions = vi.fn();

    const monaco = {
      editor: { defineTheme },
      languages: { json: { jsonDefaults: { setDiagnosticsOptions } } },
    } as unknown as Monaco;

    beforeMount(monaco);

    expect(defineTheme).toHaveBeenCalledWith(
      currentTheme,
      (themesConfig as Record<EditorThemes, unknown>)[currentTheme],
    );

    expect(setDiagnosticsOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        validate: true,
        enableSchemaRequest: false,
        schemas: expect.arrayContaining([
          expect.objectContaining({
            uri: 'http://custom-schema/object-required.json',
            fileMatch: ['*'],
            schema: expect.objectContaining({
              type: 'object',
              description: 'Top-level value must be an object',
              additionalProperties: true,
            }),
          }),
        ]),
      }),
    );
  });
});
