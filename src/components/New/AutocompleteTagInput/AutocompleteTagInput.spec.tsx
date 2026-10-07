import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';

import {
  AutocompleteTagInput,
  type AutocompleteTagInputProps,
  type AutocompleteTagInputSuggestion,
} from './AutocompleteTagInput';

const suggestions: AutocompleteTagInputSuggestion[] = [
  { value: 'image/gif', label: 'GIF', description: 'image/gif' },
  { value: 'image/png', label: 'PNG', description: 'image/png' },
  { value: 'image/jpeg', label: 'JPG', description: 'image/jpeg' },
  { value: 'image/tiff', label: 'TIFF', description: 'image/tiff' },
  { value: 'application/pdf', label: 'PDF', description: 'application/pdf' },
  { value: 'image/apng', label: 'APNG', description: 'image/apng' },
  { value: 'image/avif', label: 'AVIF', description: 'image/avif' },
];

type ControlledProps = Omit<AutocompleteTagInputProps, 'suggestions'> & {
  suggestions?: AutocompleteTagInputSuggestion[];
};

const ControlledAutocomplete = ({
  suggestions: items = suggestions,
  ...props
}: ControlledProps) => {
  const [tags, setTags] = useState<string[]>(props.defaultValue ?? []);

  return (
    <AutocompleteTagInput
      id="types"
      labelProps={{ label: 'Attachment types' }}
      {...props}
      suggestions={items}
      value={tags}
      onChange={(next) => {
        setTags(next);
        props.onChange?.(next);
      }}
    />
  );
};

const getInput = () =>
  screen.getByRole('combobox', { name: 'Attachment types' });
const getTags = () =>
  within(screen.getByRole('list', { name: 'Tags' }))
    .getAllByRole('listitem')
    .map((item) => item.textContent);

describe('Dial UI Kit :: AutocompleteTagInput', () => {
  test('renders a combobox named by its label, closed by default', () => {
    render(<ControlledAutocomplete />);

    const input = getInput();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute(
      'aria-controls',
      screen.getByRole('listbox', { hidden: true }).id,
    );
  });

  test('falls back to ariaLabel when there is no visible label', () => {
    render(
      <AutocompleteTagInput suggestions={suggestions} ariaLabel="MIME types" />,
    );
    expect(
      screen.getByRole('combobox', { name: 'MIME types' }),
    ).toBeInTheDocument();
  });

  test('shows matching suggestions while typing, capped and with the first highlighted', async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete />);

    await user.type(getInput(), 'image/');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('GIF');
    expect(options[0]).toHaveTextContent('image/gif');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    expect(getInput()).toHaveAttribute('aria-activedescendant', options[0].id);
  });

  test('honours maxSuggestions', async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete maxSuggestions={2} />);

    await user.type(getInput(), 'image/');

    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  test('adds the highlighted suggestion on Enter and clears the input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledAutocomplete onChange={onChange} />);

    await user.type(getInput(), 'gif{Enter}');

    expect(onChange).toHaveBeenLastCalledWith(['image/gif']);
    expect(getTags()).toEqual(['image/gif']);
    expect(getInput()).toHaveValue('');
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  test('moves the highlight with the arrow keys, wrapping at the ends', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledAutocomplete onChange={onChange} />);

    await user.type(getInput(), 'image/');
    await user.keyboard('{ArrowUp}');
    expect(screen.getAllByRole('option')[4]).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenLastCalledWith(['image/png']);
  });

  test('opens the list on ArrowDown in an empty input, but not for blank text', async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete />);

    await user.type(getInput(), '   ');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    await user.clear(getInput());
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')).toHaveLength(5);
  });

  test('adds the typed text on comma when no suggestion matches', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledAutocomplete onChange={onChange} />);

    await user.type(getInput(), ' audio/mpeg ');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    await user.keyboard(',');

    expect(onChange).toHaveBeenLastCalledWith(['audio/mpeg']);
  });

  test('adds a suggestion on click and keeps focus in the input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledAutocomplete onChange={onChange} />);

    await user.type(getInput(), 'pdf');
    await user.click(screen.getByRole('option', { name: /PDF/ }));

    expect(onChange).toHaveBeenLastCalledWith(['application/pdf']);
    expect(getInput()).toHaveFocus();
  });

  test('does not suggest values that are already tags', async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete defaultValue={['image/png']} />);

    await user.type(getInput(), 'png');

    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual([expect.stringContaining('APNG')]);
  });

  test('closes the list on Escape', async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete />);

    await user.type(getInput(), 'gif');
    await user.keyboard('{Escape}');

    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('closes the list on blur without adding the typed text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledAutocomplete onChange={onChange} />);

    await user.type(getInput(), 'gif');
    await user.tab();

    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('removes the last tag on Backspace in an empty input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledAutocomplete
        defaultValue={['application/pdf', 'image/png']}
        onChange={onChange}
      />,
    );

    await user.click(getInput());
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenLastCalledWith(['application/pdf']);
  });

  test('ignores a duplicate or blank value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledAutocomplete
        defaultValue={['audio/mpeg']}
        onChange={onChange}
      />,
    );

    await user.type(getInput(), 'audio/mpeg{Enter}');
    await user.type(getInput(), '   {Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(getTags()).toEqual(['audio/mpeg']);
  });

  test('removes a tag through its named remove button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledAutocomplete
        defaultValue={['application/pdf', 'image/png']}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Remove application/pdf' }),
    );

    expect(onChange).toHaveBeenLastCalledWith(['image/png']);
  });

  test('names the remove buttons with getRemoveTagLabel', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledAutocomplete
        defaultValue={['application/pdf']}
        getRemoveTagLabel={(tag) => `Supprimer ${tag}`}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Supprimer application/pdf' }),
    );

    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  test('works uncontrolled from defaultValue', async () => {
    const user = userEvent.setup();
    render(
      <AutocompleteTagInput
        labelProps={{ label: 'Attachment types' }}
        suggestions={suggestions}
        defaultValue={['image/png']}
      />,
    );

    await user.type(getInput(), 'gif{Enter}');

    expect(getTags()).toEqual(['image/png', 'image/gif']);
  });

  test('shows no list and no remove buttons when disabled', async () => {
    const user = userEvent.setup();
    render(
      <ControlledAutocomplete defaultValue={['application/pdf']} disabled />,
    );

    expect(getInput()).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Remove application/pdf' }),
    ).not.toBeInTheDocument();
    await user.type(getInput(), 'gif');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('accepts no new tags and removes none when read-only', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledAutocomplete
        defaultValue={['application/pdf']}
        readOnly
        onChange={onChange}
      />,
    );

    await user.type(getInput(), 'gif{Enter}{Backspace}');

    expect(onChange).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Remove application/pdf' }),
    ).not.toBeInTheDocument();
  });

  test('shows the error instead of the caption and marks the input invalid', () => {
    render(
      <ControlledAutocomplete
        caption="Pick a MIME type"
        error="Select at least one"
        invalid
      />,
    );

    expect(screen.getByText('Select at least one')).toBeInTheDocument();
    expect(screen.queryByText('Pick a MIME type')).not.toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });

  test('names the tag list with tagListLabel and shows the placeholder only without tags', () => {
    const { rerender } = render(
      <AutocompleteTagInput
        labelProps={{ label: 'Attachment types' }}
        suggestions={suggestions}
        placeholder="Enter types"
        value={[]}
      />,
    );
    expect(getInput()).toHaveAttribute('placeholder', 'Enter types');

    rerender(
      <AutocompleteTagInput
        labelProps={{ label: 'Attachment types' }}
        suggestions={suggestions}
        placeholder="Enter types"
        tagListLabel="Attachment types list"
        value={['image/png']}
      />,
    );
    expect(getInput()).not.toHaveAttribute('placeholder');
    expect(
      screen.getByRole('list', { name: 'Attachment types list' }),
    ).toBeInTheDocument();
  });
});
