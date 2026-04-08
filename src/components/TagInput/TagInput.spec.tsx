import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialTagInput } from './TagInput';

describe('Dial UI Kit :: DialTagInput', () => {
  test('Should render correctly', () => {
    render(<DialTagInput elementId="test-tag" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should render initial tags', () => {
    render(<DialTagInput elementId="test-tag" initialTags={['one', 'two']} />);
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
  });

  test('Adds new tag on Enter, clears input and calls onChange with new tag first', () => {
    const onChange = vi.fn();
    render(
      <DialTagInput
        elementId="test-tag"
        initialTags={['a']}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onChange).toHaveBeenCalledWith(['b', 'a']);
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  test('Adds new tag on comma (",")', () => {
    const onChange = vi.fn();
    render(<DialTagInput elementId="test-tag" onChange={onChange} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'commaTag' } });
    fireEvent.keyDown(input, { key: ',', code: 'Comma', charCode: 44 });

    expect(onChange).toHaveBeenCalledWith(['commaTag']);
    expect(screen.getByText('commaTag')).toBeInTheDocument();
  });

  test('Prevents duplicate tags', () => {
    const onChange = vi.fn();
    render(
      <DialTagInput
        elementId="test-tag"
        initialTags={['dup']}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'dup' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByText('dup').length).toBe(1);
  });

  test('Input is disabled when disabled prop is true', () => {
    render(<DialTagInput elementId="test-tag" disabled />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('Applies error class when invalid prop is true', () => {
    const { container } = render(<DialTagInput elementId="test-tag" invalid />);
    const outer = container.querySelector('.dial-input');
    expect(outer).toBeTruthy();
    expect(outer?.classList.contains('dial-input-error')).toBe(true);
  });

  test('Trims trailing comma from tag (e.g. "tag,")', () => {
    const onChange = vi.fn();
    render(<DialTagInput elementId="test-tag" onChange={onChange} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '  spacedTag,  ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onChange).toHaveBeenCalledWith(['spacedTag']);
    expect(screen.getByText('spacedTag')).toBeInTheDocument();
  });

  test('Removes tag when remove button is clicked and calls onChange', () => {
    const onChange = vi.fn();
    render(
      <DialTagInput
        elementId="test-tag"
        initialTags={['first', 'second']}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();

    const tag = screen.getByText('first').closest('div');
    const removeButton = tag?.querySelector('button') as HTMLButtonElement;
    expect(removeButton).toBeTruthy();

    if (removeButton) {
      fireEvent.click(removeButton);
    }

    expect(screen.queryByText('first')).not.toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(['second']);
  });

  test('uses single-line flex row classes', () => {
    const { container } = render(
      <DialTagInput elementId="collapse-layout" collapseTagOverflow />,
    );

    const row = container.querySelector('.flex-nowrap.overflow-hidden');
    expect(row).toBeTruthy();
  });

  test('shows placeholder while disabled without focus', () => {
    render(
      <DialTagInput
        elementId="collapse-dis"
        collapseTagOverflow
        disabled
        placeholder="Hint"
      />,
    );

    expect((screen.getByRole('textbox') as HTMLInputElement).placeholder).toBe(
      'Hint',
    );
  });

  describe('readOnly', () => {
    test('does not render a textbox', () => {
      render(<DialTagInput readOnly initialTags={['React', 'TypeScript']} />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('renders all initial tags', () => {
      render(<DialTagInput readOnly initialTags={['React', 'TypeScript']} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    test('does not render remove buttons on tags', () => {
      render(<DialTagInput readOnly initialTags={['React', 'TypeScript']} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('does not render the outer dial-input wrapper', () => {
      const { container } = render(
        <DialTagInput readOnly initialTags={['React']} />,
      );
      expect(container.querySelector('.dial-input')).not.toBeInTheDocument();
    });

    test('with collapseTagOverflow, renders single-line flex row', () => {
      const { container } = render(
        <DialTagInput
          readOnly
          collapseTagOverflow
          initialTags={['React', 'TypeScript']}
        />,
      );
      const row = container.querySelector('.flex-nowrap.overflow-hidden');
      expect(row).toBeTruthy();
    });
  });
});
