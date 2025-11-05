import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialEditableItemName } from './EditableItemName';
import { DialItemType } from '@/types/item';
import type { DialFileNameProps } from '@/components/FileName/FileName';
import type { DialFolderNameProps } from '@/components/FolderName/FolderName';
import type { DialItemNameInputProps } from '@/components/ItemNameInput/ItemNameInput';

vi.mock('@/components/FileName/FileName', () => ({
  DialFileName: ({ name, shared }: DialFileNameProps) => (
    <div data-testid="file-name">
      File: {name} {shared && '(shared)'}
    </div>
  ),
}));

vi.mock('@/components/FolderName/FolderName', () => ({
  DialFolderName: ({ name, loading, shared }: DialFolderNameProps) => (
    <div data-testid="folder-name">
      Folder: {name} {loading && '(loading)'} {shared && '(shared)'}
    </div>
  ),
}));

vi.mock('@/components/ItemNameInput/ItemNameInput', () => ({
  DialItemNameInput: (props: DialItemNameInputProps) => (
    <input
      data-testid="item-name-input"
      value={props.name}
      aria-label="Editable item input"
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  ),
}));

describe('Dial UI Kit :: DialEditableItemName', () => {
  test('renders DialFileName when not editing and type=File', () => {
    render(
      <DialEditableItemName
        name="file.ts"
        type={DialItemType.File}
        elementId="id1"
        editing={false}
      />,
    );

    const file = screen.getByTestId('file-name');
    expect(file).toHaveTextContent('File: file.ts');
  });

  test('renders DialFolderName when not editing and type=Folder', () => {
    render(
      <DialEditableItemName
        name="src"
        type={DialItemType.Folder}
        elementId="id2"
        editing={false}
        loading
        shared
      />,
    );

    const folder = screen.getByTestId('folder-name');
    expect(folder).toHaveTextContent('Folder: src');
    expect(folder).toHaveTextContent('(loading)');
    expect(folder).toHaveTextContent('(shared)');
  });

  test('renders DialItemNameInput when editing', () => {
    render(
      <DialEditableItemName
        name="editable"
        type={DialItemType.File}
        elementId="id3"
        editing
      />,
    );

    const input = screen.getByTestId('item-name-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('editable');
  });

  test('passes correct props to DialItemNameInput', () => {
    const validate = vi.fn();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <DialEditableItemName
        name="test"
        type={DialItemType.Folder}
        elementId="el-1"
        editing
        validate={validate}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    const input = screen.getByLabelText('Editable item input');
    expect(input).toHaveValue('test');
  });

  test('renders shared flag for file when not editing', () => {
    render(
      <DialEditableItemName
        name="index.ts"
        type={DialItemType.File}
        elementId="id4"
        shared
      />,
    );

    const file = screen.getByTestId('file-name');
    expect(file).toHaveTextContent('(shared)');
  });
});
