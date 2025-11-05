import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialEditableItemName } from './EditableItemName';
import { DialItemType } from '@/types/item';
import userEvent from '@testing-library/user-event';

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

    const file = screen.getByText('file.ts');
    expect(file).toBeInTheDocument();
  });

  test('renders DialFolderName when not editing and type=Folder', () => {
    render(
      <DialEditableItemName
        name="Project"
        type={DialItemType.Folder}
        elementId="id2"
        editing={false}
        loading
        shared
      />,
    );

    const folder = screen.getByText('Project');
    expect(folder).toBeInTheDocument();
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

    const input = screen.getByDisplayValue('editable');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('editable');
  });

  test('saves new name on Enter and switches back to span', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(
      <DialEditableItemName
        name="initial"
        type={DialItemType.File}
        elementId="id4"
        editing
        onSave={handleSave}
      />,
    );

    const input = screen.getByDisplayValue('initial');
    expect(input).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'updated{enter}');

    expect(handleSave).toHaveBeenCalledWith('updated');
  });
});
