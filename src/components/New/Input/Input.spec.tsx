import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { ElementSize } from '@/types/size';
import { Input } from './Input';

describe('Dial UI Kit :: DialInput', () => {
  test('renders with default props', () => {
    const { getByPlaceholderText } = render(
      <Input id="test-input" placeholder="Enter text" />,
    );
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <Input
        id="test-input-change"
        placeholder="Type value here"
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Type value here');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  test('renders input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input id="icon-input" placeholder="With icon" />,
    );
    expect(getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  test('renders iconBefore and iconAfter', () => {
    const before = <span>B</span>;
    const after = <span>A</span>;
    const { container } = render(
      <Input
        id="icon-input"
        placeholder="With icon"
        iconBefore={before}
        iconAfter={after}
      />,
    );
    // Check for the text content of the icons
    expect(container.textContent).toContain('B');
    expect(container.textContent).toContain('A');
  });

  test('calls onChange when input changes', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <Input id="icon-input" placeholder="Type here" onChange={handleChange} />,
    );
    const input = getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  test('renders with min and max attributes for number input', () => {
    const { getByPlaceholderText } = render(
      <Input
        id="test-number"
        type="number"
        placeholder="Enter number"
        min={0}
        max={100}
      />,
    );
    const input = getByPlaceholderText('Enter number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  test('renders prefix and suffix text', () => {
    const { container } = render(
      <Input id="test-input" placeholder="Amount" prefix="$" postfix="USD" />,
    );
    expect(container.textContent).toContain('USD');
  });

  test('renders prefix input', () => {
    render(
      <Input
        id="test-input"
        placeholder="domain"
        prefix="https://"
        value="123"
      />,
    );
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();

    expect(screen.getByDisplayValue('https://')).toBeInTheDocument();
  });

  test('handleKeyDown blocks non-numeric keys on number input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Controlled = () => {
      const [val, setVal] = useState('');
      return (
        <Input
          id="num"
          placeholder="num"
          type="number"
          value={val}
          onChange={(v) => {
            setVal(v ?? '');
            onChange(v);
          }}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText('num');

    await user.type(input, 'a');
    expect(onChange).not.toHaveBeenCalled();

    await user.type(input, '5');
    expect(onChange).toHaveBeenLastCalledWith('5');
    expect((input as HTMLInputElement).value).toBe('5');
  });

  test('handleKeyDown returns early for non-numeric inputs (type="text")', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [val, setVal] = useState('');
      return (
        <Input
          id="plain"
          placeholder="plain"
          type="text"
          value={val}
          onChange={(v) => setVal(v ?? '')}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText('plain') as HTMLInputElement;

    await user.type(input, 'a1');
    expect(input.value).toBe('a1');
  });
  test('allowed navigation keys are not blocked on number input', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [val, setVal] = useState('12');
      return (
        <Input
          id="num-allowed"
          placeholder="num-allowed"
          type="number"
          value={val}
          onChange={(v) => setVal(v ?? '')}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText(
      'num-allowed',
    ) as HTMLInputElement;

    await user.type(input, '{ArrowLeft}');
    expect(input.value).toBe('12');

    await user.type(input, '7');
    expect(input.value).toBe('127');
  });

  test('prevents typing when result would be below min (range check on keyDown)', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [val, setVal] = useState('');
      return (
        <Input
          id="min-guard"
          placeholder="min-guard"
          type="number"
          min={10}
          value={val}
          onChange={(v) => setVal(v ?? '')}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText('min-guard') as HTMLInputElement;

    await user.type(input, '5');
    expect(input.value).toBe('');
  });

  test('prevents typing when result would be above max (range check on keyDown)', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [val, setVal] = useState('100');
      return (
        <Input
          id="max-guard"
          placeholder="max-guard"
          type="number"
          max={100}
          value={val}
          onChange={(v) => setVal(v ?? '')}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText('max-guard') as HTMLInputElement;

    await user.type(input, '1');
    expect(input.value).toBe('100');
  });

  describe('size', () => {
    // jsdom does no layout, so the height itself is not observable here — the
    // variant classes are. `npm run build:css` compiles them to 40px/24px.
    const getField = () => screen.getByLabelText('input-container');

    test('renders the standard height by default', () => {
      render(<Input id="default-size" placeholder="Placeholder" />);

      // The 40px height comes from `.dial-kit-input` itself
      expect(getField()).toHaveClass('dial-kit-input', 'gap-x-2', 'pl-3');
      expect(getField()).not.toHaveClass('dial-kit-input-small');
    });

    test('renders the small variant when size is small', () => {
      render(
        <Input
          id="small-size"
          placeholder="Placeholder"
          size={ElementSize.Small}
        />,
      );

      expect(getField()).toHaveClass('dial-kit-input-small', 'gap-x-1', 'pl-2');
      expect(getField()).not.toHaveClass('py-2');
    });

    test('passes the size down to the prefix field', () => {
      render(
        <Input
          id="small-prefix"
          placeholder="domain"
          prefix="https://"
          size={ElementSize.Small}
        />,
      );

      const fields = screen.getAllByLabelText('input-container');
      expect(fields).toHaveLength(2);
      fields.forEach((field) =>
        expect(field).toHaveClass('dial-kit-input-small'),
      );
    });

    test('passes the size down to the input button, and lets it opt out', () => {
      const { rerender } = render(
        <Input
          id="small-button"
          placeholder="Placeholder"
          size={ElementSize.Small}
          inputButtonProps={{ icon: <span>i</span> }}
        />,
      );
      expect(screen.getByRole('button')).toHaveClass('size-[24px]');

      rerender(
        <Input
          id="small-button"
          placeholder="Placeholder"
          size={ElementSize.Small}
          inputButtonProps={{
            icon: <span>i</span>,
            size: ElementSize.Standard,
          }}
        />,
      );
      expect(screen.getByRole('button')).toHaveClass('size-[40px]');
    });

    test('does not forward size to the native input as an attribute', () => {
      render(
        <Input
          id="no-native-size"
          placeholder="Placeholder"
          size={ElementSize.Small}
        />,
      );

      expect(screen.getByPlaceholderText('Placeholder')).not.toHaveAttribute(
        'size',
      );
    });
  });

  test('uses cursor position to build newValue; blocks when inserted digit violates range', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [val, setVal] = useState('150');
      return (
        <Input
          id="cursor-range"
          placeholder="cursor-range"
          max={180}
          value={val}
          onChange={(v) => setVal(v ?? '')}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText(
      'cursor-range',
    ) as HTMLInputElement;

    input.focus();
    input.setSelectionRange(1, 1);
    await user.type(input, '9');

    expect(input.value).toBe('150');
  });
});
