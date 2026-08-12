import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { ElementSize } from '@/types/size';
import { TagInput, type TagInputProps } from './TagInput';

const ControlledTagInput = (props: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(props.defaultValue ?? []);

  return (
    <TagInput
      {...props}
      value={tags}
      onChange={(next) => {
        setTags(next);
        props.onChange?.(next);
      }}
    />
  );
};

describe('Dial UI Kit :: TagInput', () => {
  test('renders a text input named by its label', () => {
    render(<TagInput id="skills" labelProps={{ label: 'Skills' }} />);
    expect(screen.getByRole('textbox', { name: 'Skills' })).toBeInTheDocument();
  });

  test('falls back to ariaLabel when there is no visible label', () => {
    render(<TagInput id="skills" ariaLabel="Skills" />);
    expect(screen.getByRole('textbox', { name: 'Skills' })).toBeInTheDocument();
  });

  test('renders the uncontrolled defaultValue tags', () => {
    render(<TagInput id="skills" defaultValue={['React', 'TypeScript']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('exposes the tags as a named list', () => {
    render(<TagInput id="skills" defaultValue={['React', 'TypeScript']} />);

    const list = screen.getByRole('list', { name: 'Tags' });

    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['React', 'TypeScript']);
  });

  test('renders no list when there are no tags', () => {
    render(<TagInput id="skills" />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('adds a tag on Enter, appending it and clearing the input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput id="skills" defaultValue={['React']} onChange={onChange} />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'TypeScript{Enter}');

    expect(onChange).toHaveBeenCalledWith(['React', 'TypeScript']);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('adds a tag on comma without keeping the comma', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput id="skills" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'React,');

    expect(onChange).toHaveBeenCalledWith(['React']);
  });

  test('trims the value before adding it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput id="skills" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), '  React  {Enter}');

    expect(onChange).toHaveBeenCalledWith(['React']);
  });

  test('ignores an empty value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput id="skills" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), '   {Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  test('ignores a duplicate tag', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput id="skills" defaultValue={['React']} onChange={onChange} />,
    );

    await user.type(screen.getByRole('textbox'), 'React{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByText('React')).toHaveLength(1);
  });

  test('commits a pending value on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput id="skills" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'React');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(['React']);
  });

  test('removes a tag through its remove button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledTagInput
        id="skills"
        defaultValue={['React', 'TypeScript']}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove React' }));

    expect(onChange).toHaveBeenCalledWith(['TypeScript']);
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  test('removes the last tag on Backspace in an empty input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput
        id="skills"
        defaultValue={['React', 'TypeScript']}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('textbox'));
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith(['React']);
  });

  test('keeps the tags when Backspace is pressed with a pending value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput id="skills" defaultValue={['React']} onChange={onChange} />,
    );

    await user.type(screen.getByRole('textbox'), 'Ty{Backspace}');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('follows the controlled value instead of its own state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput
        id="skills"
        value={['React']}
        onChange={onChange}
        labelProps={{ label: 'Skills' }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'TypeScript{Enter}');

    expect(onChange).toHaveBeenCalledWith(['React', 'TypeScript']);
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  test('renders no remove buttons when readOnly', () => {
    render(
      <TagInput id="skills" defaultValue={['React']} readOnly />,
    );
    expect(
      screen.queryByRole('button', { name: 'Remove React' }),
    ).not.toBeInTheDocument();
  });

  test('does not add tags when readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput id="skills" readOnly onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'React{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  test('disables the field and hides tag removal when disabled', () => {
    render(<TagInput id="skills" defaultValue={['React']} disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Remove React' }),
    ).not.toBeInTheDocument();
  });

  test('renders the error text', () => {
    render(<TagInput id="skills" error="Add at least one skill" invalid />);
    expect(screen.getByText('Add at least one skill')).toBeInTheDocument();
  });

  test('renders the caption when there is no error', () => {
    render(<TagInput id="skills" caption="Press Enter to add" />);
    expect(screen.getByText('Press Enter to add')).toBeInTheDocument();
  });

  test('hides the placeholder once a tag is present', () => {
    render(
      <TagInput
        id="skills"
        placeholder="Add a skill"
        defaultValue={['React']}
      />,
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute('placeholder');
  });

  test('shows every tag when the field cannot be measured', () => {
    // jsdom reports a zero-width field, so the collapsed row has nothing to
    // calculate a `+N` cut-off from and must fall back to showing everything.
    render(
      <TagInput
        id="skills"
        collapseTagOverflow
        defaultValue={['React', 'TypeScript', 'Storybook']}
      />,
    );

    const list = screen.getByRole('list', { name: 'Tags' });

    // The hidden measurement copies carry no role, so only the rendered row is
    // counted here — a `+N` chip would show up as an extra listitem.
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['React', 'TypeScript', 'Storybook']);
  });

  test('sizes its tags to match a small field', () => {
    render(
      <TagInput
        id="skills"
        size={ElementSize.Small}
        defaultValue={['React']}
      />,
    );
    expect(screen.getByText('React').parentElement).toHaveClass('h-[20px]');
  });
});
