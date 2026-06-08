import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { FC } from 'react';
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
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
      />
      <span data-testid="message">{invalidMessage}</span>
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

  it('reverts to the default folder name and creates it on blur when invalid (creation)', () => {
    const onCreateFolderSave = vi.fn();
    render(
      <Harness
        value="New folder"
        isEditing={false}
        isCreating
        onCreateFolderSave={onCreateFolderSave}
        // names containing % are invalid here, the default "New folder" is valid
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

    expect(onCreateFolderSave).toHaveBeenCalledWith('New folder');
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
