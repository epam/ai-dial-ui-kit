import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import type { FC } from 'react';
import { NotificationVariant } from '@/types/notification';
import { FolderCreation as folderCreationStory } from '@/components/New/Grid/Grid.stories';
import {
  useEditableItem,
  type UseEditableItemOptions,
} from '../use-editable-item';

const Harness: FC<UseEditableItemOptions> = (options) => {
  const { inputRef, value, onChange, invalid, invalidMessage } =
    useEditableItem(options);

  return (
    <div>
      <input
        data-testid="input"
        aria-label="Item name"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
      />
      <span data-testid="message" role="status">
        {invalidMessage}
      </span>
      <button data-testid="outside">outside</button>
    </div>
  );
};

describe('Dial UI Kit :: useEditableItem :: outside click (blur)', () => {
  it('saves the typed value on blur when valid (rename)', () => {
    const onSave = vi.fn();
    render(
      <Harness
        value="folder"
        isEditing
        onSave={onSave}
        onValidate={(v) => (v.trim() ? null : 'required')}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'renamed' } });
    });
    act(() => {
      fireEvent.blur(input);
    });

    expect(onSave).toHaveBeenCalledWith('renamed');
  });

  it('reverts to the default name and saves it on blur when invalid (rename)', () => {
    const onSave = vi.fn();
    render(
      <Harness
        value="original"
        isEditing
        onSave={onSave}
        // empty name is invalid, original name is valid
        onValidate={(v) => (v.trim() ? null : 'required')}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: '   ' } });
    });
    act(() => {
      fireEvent.blur(input);
    });

    // exits edit mode by committing the default (original) name, not trapping focus
    expect(onSave).toHaveBeenCalledWith('original');
  });

  it('cancels the creation on blur when invalid, instead of committing the default placeholder name', () => {
    const onCreateFolderSave = vi.fn();
    const onCreateFolderCancel = vi.fn();
    render(
      <Harness
        value="New folder"
        isEditing={false}
        isCreating
        onCreateFolderSave={onCreateFolderSave}
        onCreateFolderCancel={onCreateFolderCancel}
        // names containing % are invalid here; the placeholder "New folder"
        // would itself be valid, but creation must not silently substitute
        // it for what the user actually typed.
        onValidate={(v) => (/%/.test(v) ? 'forbidden symbol' : null)}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: '%%%' } });
    });
    act(() => {
      fireEvent.blur(input);
    });

    expect(onCreateFolderSave).not.toHaveBeenCalled();
    expect(onCreateFolderCancel).toHaveBeenCalledTimes(1);
  });

  it('cancels on blur when both the value and the default are invalid', () => {
    const onCreateFolderSave = vi.fn();
    const onCreateFolderCancel = vi.fn();
    render(
      <Harness
        value=""
        isEditing={false}
        isCreating
        onCreateFolderSave={onCreateFolderSave}
        onCreateFolderCancel={onCreateFolderCancel}
        onValidate={(v) => (v.trim() ? null : 'required')}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;

    act(() => {
      fireEvent.blur(input);
    });

    expect(onCreateFolderSave).not.toHaveBeenCalled();
    expect(onCreateFolderCancel).toHaveBeenCalledTimes(1);
  });

  it('does not commit when focus stays inside the input container', () => {
    const onSave = vi.fn();
    const { container } = render(
      <Harness
        value="folder"
        isEditing
        onSave={onSave}
        onValidate={() => null}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;
    // simulate focus moving to a node still inside the input element
    act(() => {
      fireEvent.blur(input, { relatedTarget: input });
    });

    expect(onSave).not.toHaveBeenCalled();
    void container;
  });

  it('saves on a pointer press outside the field', () => {
    const onSave = vi.fn();
    render(
      <Harness
        value="folder"
        isEditing
        onSave={onSave}
        onValidate={(v) => (v.trim() ? null : 'required')}
      />,
    );

    act(() => {
      fireEvent.pointerDown(document.body);
    });

    expect(onSave).toHaveBeenCalledWith('folder');
  });

  it('reverts to the default name on a pointer press outside when invalid', () => {
    const onSave = vi.fn();
    render(
      <Harness
        value="original"
        isEditing
        onSave={onSave}
        onValidate={(v) => (v.trim() ? null : 'required')}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: '   ' } });
    });
    act(() => {
      fireEvent.pointerDown(document.body);
    });

    expect(onSave).toHaveBeenCalledWith('original');
  });

  it('does not commit on a pointer press inside the field container', () => {
    const onSave = vi.fn();
    const { container } = render(
      <div data-editable-container>
        <Harness
          value="folder"
          isEditing
          onSave={onSave}
          onValidate={() => null}
        />
      </div>,
    );

    const adornment = document.createElement('button');
    container
      .querySelector('[data-editable-container]')!
      .appendChild(adornment);

    act(() => {
      fireEvent.pointerDown(adornment);
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it('does not double-save when both the pointer press and blur fire', () => {
    const onSave = vi.fn();
    render(
      <Harness
        value="folder"
        isEditing
        onSave={onSave}
        onValidate={(v) => (v.trim() ? null : 'required')}
      />,
    );

    const input = screen.getByTestId('input') as HTMLInputElement;
    act(() => {
      fireEvent.pointerDown(document.body);
      fireEvent.blur(input);
    });

    expect(onSave).toHaveBeenCalledTimes(1);
  });
});

describe('Dial UI Kit :: useEditableItem :: Enter key', () => {
  const validateName = (value: string) => {
    if (!value.trim()) return 'Enter a folder name';
    if (value === 'assets') return 'An item with this name already exists here';
    if (['/', '\\', '.', '..'].includes(value)) return 'Invalid folder name';
    return null;
  };

  it.each(['', '   ', '/', '\\', '.', '..', 'assets'])(
    'preserves focus, value and error after repeated Enter with invalid folder name %j',
    (name) => {
      const onCreateFolderSave = vi.fn();
      const onCreateFolderCancel = vi.fn();
      render(
        <Harness
          value="New folder"
          isEditing
          isCreating
          onValidate={validateName}
          onCreateFolderSave={onCreateFolderSave}
          onCreateFolderCancel={onCreateFolderCancel}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Item name' });
      act(() => input.focus());
      fireEvent.change(input, { target: { value: name } });
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveFocus();
      expect(input).toHaveValue(name);
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('status')).toHaveTextContent(validateName(name)!);
      expect(onCreateFolderSave).not.toHaveBeenCalled();
      expect(onCreateFolderCancel).not.toHaveBeenCalled();
    },
  );

  it('saves a corrected folder name exactly once after invalid Enter', () => {
    const onCreateFolderSave = vi.fn();
    const onCreateFolderCancel = vi.fn();
    render(
      <Harness
        value="New folder"
        isEditing={false}
        isCreating
        onValidate={validateName}
        onCreateFolderSave={onCreateFolderSave}
        onCreateFolderCancel={onCreateFolderCancel}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Item name' });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: '/' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'docs' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.blur(input);

    expect(onCreateFolderSave).toHaveBeenCalledExactlyOnceWith('docs');
    expect(onCreateFolderCancel).not.toHaveBeenCalled();
    expect(input).not.toHaveFocus();
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it.each(['Escape', 'outside press'])(
    'still cancels an invalid creation on %s after invalid Enter',
    (action) => {
      const onCreateFolderSave = vi.fn();
      const onCreateFolderCancel = vi.fn();
      render(
        <Harness
          value="New folder"
          isEditing={false}
          isCreating
          onValidate={validateName}
          onCreateFolderSave={onCreateFolderSave}
          onCreateFolderCancel={onCreateFolderCancel}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Item name' });
      act(() => input.focus());
      fireEvent.change(input, { target: { value: '/' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onCreateFolderCancel).not.toHaveBeenCalled();

      if (action === 'Escape') {
        fireEvent.keyDown(input, { key: 'Escape' });
      } else {
        fireEvent.pointerDown(screen.getByRole('button', { name: 'outside' }));
        fireEvent.blur(input);
      }

      expect(onCreateFolderCancel).toHaveBeenCalledTimes(1);
      expect(onCreateFolderSave).not.toHaveBeenCalled();
    },
  );

  it('keeps the existing rename fallback on invalid Enter', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <Harness
        value="original"
        isEditing
        onValidate={validateName}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Item name' });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSave).toHaveBeenCalledExactlyOnceWith('original');
    expect(onCancel).not.toHaveBeenCalled();
    expect(input).not.toHaveFocus();
  });

  it('allows Enter to create a folder with a non-blocking warning', () => {
    const onCreateFolderSave = vi.fn();
    render(
      <Harness
        value="New folder"
        isEditing={false}
        isCreating
        onValidate={() => `${NotificationVariant.Warning}__Hidden folder`}
        onCreateFolderSave={onCreateFolderSave}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Item name' });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: '.docs' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onCreateFolderSave).toHaveBeenCalledExactlyOnceWith('.docs');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('allows Enter to create a folder without a validator', () => {
    const onCreateFolderSave = vi.fn();
    render(
      <Harness
        value="New folder"
        isEditing={false}
        isCreating
        onCreateFolderSave={onCreateFolderSave}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Item name' });
    act(() => input.focus());
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onCreateFolderSave).toHaveBeenCalledExactlyOnceWith('New folder');
  });
});

describe('Dial UI Kit :: useEditableItem :: Storybook example', () => {
  it('keeps the grid row editable on invalid Enter and creates after correction', async () => {
    const FolderCreationExample = folderCreationStory.render;
    render(<FolderCreationExample {...folderCreationStory.args} />);

    const input = await screen.findByRole('textbox', { name: 'Folder name' });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: '/' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toHaveFocus();
    expect(input).toHaveValue('/');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText("Folder name can't contain / or \\, or be . or .."),
    ).toBeVisible();

    fireEvent.change(input, { target: { value: 'docs' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(await screen.findByText('docs')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Created folder: docs',
    );
    expect(screen.getByRole('button', { name: 'Create folder' })).toBeEnabled();
  });

  it.each(['Escape', 'outside press'])(
    'removes the temporary row on %s and lets the user start another creation',
    async (action) => {
      const FolderCreationExample = folderCreationStory.render;
      render(<FolderCreationExample {...folderCreationStory.args} />);
      const input = await screen.findByRole('textbox', { name: 'Folder name' });
      act(() => input.focus());
      fireEvent.change(input, { target: { value: '/' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      if (action === 'Escape') {
        fireEvent.keyDown(input, { key: 'Escape' });
      } else {
        fireEvent.pointerDown(screen.getByText('assets'));
      }

      expect(
        await screen.findByText('Folder creation cancelled'),
      ).toBeVisible();
      await waitFor(() =>
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument(),
      );
      expect(screen.getByText('assets')).toBeVisible();
      expect(screen.getByText('documents')).toBeVisible();
      fireEvent.click(screen.getByRole('button', { name: 'Create folder' }));
      expect(
        await screen.findByRole('textbox', { name: 'Folder name' }),
      ).toHaveValue('New folder');
    },
  );
});
