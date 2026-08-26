import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { FileDropzone } from './FileDropzone';

const LABEL = 'Drag and drop it or click here to upload';

const file = (name: string, type = '') => new File(['content'], name, { type });

/** jsdom builds no DataTransfer, so a drop event carries a stand-in. */
const dropData = (files: File[]) => ({
  dataTransfer: { files, items: [], types: ['Files'] },
});

/** The label element wraps the description too, so the name is not an exact match. */
const getInput = () => screen.getByLabelText(new RegExp(LABEL));

const renderDropzone = (props: Partial<Parameters<typeof FileDropzone>[0]>) =>
  render(
    <FileDropzone
      label={LABEL}
      description="File formats .md, .zip and .skill"
      onChange={vi.fn()}
      {...props}
    />,
  );

describe('Dial UI Kit :: FileDropzone', () => {
  test('renders a file input named by its label', () => {
    renderDropzone({});
    const input = getInput();

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAccessibleName(
      `${LABEL} File formats .md, .zip and .skill`,
    );
  });

  test('prefixes the accessible name with the field label', () => {
    renderDropzone({
      labelProps: { label: 'Attachments', required: true },
    });

    // Both labels point at the input, so the field name is announced before the
    // in-area copy telling the user how to use it.
    expect(getInput()).toHaveAccessibleName(
      `Attachments (required) ${LABEL} File formats .md, .zip and .skill`,
    );
  });

  test('exposes the field label caption through its info button', () => {
    renderDropzone({
      labelProps: { label: 'Attachments', caption: 'Up to 10 MB per file' },
    });

    expect(
      screen.getByRole('button', { name: 'Up to 10 MB per file' }),
    ).toBeInTheDocument();
  });

  test('falls back to ariaLabel when the label carries no text', () => {
    render(
      <FileDropzone
        label={<span aria-hidden="true">📄</span>}
        ariaLabel="Upload a prompt"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Upload a prompt')).toHaveAttribute(
      'type',
      'file',
    );
  });

  test('passes accept and multiple through to the input', () => {
    renderDropzone({ accept: '.md,.zip', multiple: true });
    const input = getInput();

    expect(input).toHaveAttribute('accept', '.md,.zip');
    expect(input).toHaveAttribute('multiple');
  });

  test('generates a unique input id for each instance', () => {
    render(
      <>
        <FileDropzone label="First" onChange={vi.fn()} />
        <FileDropzone label="Second" onChange={vi.fn()} />
      </>,
    );

    const first = screen.getByLabelText('First');
    const second = screen.getByLabelText('Second');

    expect(first.id).not.toBe(second.id);
  });

  test('calls onChange with a file chosen in the picker', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderDropzone({ onChange });

    const notes = file('notes.md');
    await user.upload(getInput(), notes);

    expect(onChange).toHaveBeenCalledWith([notes]);
  });

  test('calls onChange with dropped files', () => {
    const onChange = vi.fn();
    renderDropzone({ onChange, multiple: true });

    const files = [file('notes.md'), file('archive.zip')];
    fireEvent.drop(screen.getByText(LABEL), dropData(files));

    expect(onChange).toHaveBeenCalledWith(files);
  });

  test('keeps only the first dropped file when multiple is false', () => {
    const onChange = vi.fn();
    renderDropzone({ onChange });

    const notes = file('notes.md');
    fireEvent.drop(
      screen.getByText(LABEL),
      dropData([notes, file('archive.zip')]),
    );

    expect(onChange).toHaveBeenCalledWith([notes]);
  });

  test('does not fire onChange for an empty drop', () => {
    const onChange = vi.fn();
    renderDropzone({ onChange });

    fireEvent.drop(screen.getByText(LABEL), dropData([]));

    expect(onChange).not.toHaveBeenCalled();
  });

  describe('accept enforcement on drop', () => {
    test('drops a file accept excludes and reports it to onReject', () => {
      const onChange = vi.fn();
      const onReject = vi.fn();
      renderDropzone({ accept: '.md', onChange, onReject });

      const photo = file('photo.png', 'image/png');
      fireEvent.drop(screen.getByText(LABEL), dropData([photo]));

      expect(onChange).not.toHaveBeenCalled();
      expect(onReject).toHaveBeenCalledWith([photo]);
    });

    test('splits a mixed drop into accepted and rejected files', () => {
      const onChange = vi.fn();
      const onReject = vi.fn();
      renderDropzone({ accept: '.md', multiple: true, onChange, onReject });

      const notes = file('notes.md');
      const photo = file('photo.png', 'image/png');
      fireEvent.drop(screen.getByText(LABEL), dropData([notes, photo]));

      expect(onChange).toHaveBeenCalledWith([notes]);
      expect(onReject).toHaveBeenCalledWith([photo]);
    });

    test('accepts every dropped file when accept is not set', () => {
      const onChange = vi.fn();
      const onReject = vi.fn();
      renderDropzone({ onChange, onReject });

      const photo = file('photo.png', 'image/png');
      fireEvent.drop(screen.getByText(LABEL), dropData([photo]));

      expect(onChange).toHaveBeenCalledWith([photo]);
      expect(onReject).not.toHaveBeenCalled();
    });
  });

  describe('drag highlight', () => {
    test('highlights the area while a drag is over it', () => {
      renderDropzone({});
      const area = screen.getByText(LABEL).closest('label')!;

      expect(area).not.toHaveClass('border-accent');

      fireEvent.dragEnter(area, dropData([file('notes.md')]));
      expect(area).toHaveClass('border-accent');

      fireEvent.dragLeave(area);
      expect(area).not.toHaveClass('border-accent');
    });

    test('keeps the highlight when the drag moves onto a child', () => {
      renderDropzone({});
      const area = screen.getByText(LABEL).closest('label')!;

      fireEvent.dragEnter(area, dropData([file('notes.md')]));
      // Entering a child fires `dragenter` on it and `dragleave` on the area.
      fireEvent.dragEnter(
        screen.getByText(LABEL),
        dropData([file('notes.md')]),
      );
      fireEvent.dragLeave(area);

      expect(area).toHaveClass('border-accent');
    });

    test('clears the highlight after a drop', () => {
      renderDropzone({});
      const area = screen.getByText(LABEL).closest('label')!;

      fireEvent.dragEnter(area, dropData([file('notes.md')]));
      fireEvent.drop(area, dropData([file('notes.md')]));

      expect(area).not.toHaveClass('border-accent');
    });

    test('does not highlight while disabled', () => {
      renderDropzone({ disabled: true });
      const area = screen.getByText(LABEL).closest('label')!;

      fireEvent.dragEnter(area, dropData([file('notes.md')]));

      expect(area).not.toHaveClass('border-accent');
    });
  });

  describe('error state', () => {
    test('renders errorText and links it to the input', () => {
      renderDropzone({ errorText: 'Unsupported file format' });
      const error = screen.getByText('Unsupported file format');
      const input = getInput();

      expect(input).toHaveAttribute('aria-describedby', error.id);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('marks the area as invalid', () => {
      renderDropzone({ errorText: 'Unsupported file format' });

      expect(screen.getByText(LABEL).closest('label')).toHaveClass(
        'border-error',
      );
    });

    test('renders no error region and no aria-invalid without errorText', () => {
      renderDropzone({});

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(getInput()).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('disabled', () => {
    test('disables the input', () => {
      renderDropzone({ disabled: true });

      expect(getInput()).toBeDisabled();
    });

    test('ignores a drop', () => {
      const onChange = vi.fn();
      const onReject = vi.fn();
      renderDropzone({ disabled: true, onChange, onReject });

      fireEvent.drop(screen.getByText(LABEL), dropData([file('notes.md')]));

      expect(onChange).not.toHaveBeenCalled();
      expect(onReject).not.toHaveBeenCalled();
    });
  });
});
