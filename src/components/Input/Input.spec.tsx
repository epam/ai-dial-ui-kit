import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { DialInput } from './Input';

describe('Dial UI Kit :: DialInput', () => {
  test('renders with default props', () => {
    const { getByPlaceholderText } = render(
      <DialInput id="test-input" placeholder="Enter text" />,
    );
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <DialInput
        id="test-input-change"
        placeholder="Type value here"
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Type value here');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  test('is disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <DialInput id="test-input" placeholder="Disabled" disabled />,
    );
    const input = getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  test('renders input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <DialInput id="icon-input" placeholder="With icon" />,
    );
    expect(getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  test('renders iconBefore and iconAfter', () => {
    const before = <span>B</span>;
    const after = <span>A</span>;
    const { container } = render(
      <DialInput
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
      <DialInput
        id="icon-input"
        placeholder="Type here"
        onChange={handleChange}
      />,
    );
    const input = getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  test('applies invalid class when invalid prop is true', () => {
    const { getByPlaceholderText } = render(
      <DialInput id="test-input" placeholder="Invalid input" invalid />,
    );
    const input = getByPlaceholderText('Invalid input');
    const container = input.parentElement?.parentElement;
    expect(input).toHaveClass('border-0 bg-transparent');
    expect(container).toHaveClass('dial-input-error');
  });

  test('renders with min and max attributes for number input', () => {
    const { getByPlaceholderText } = render(
      <DialInput
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
      <DialInput
        id="test-input"
        placeholder="Amount"
        prefix="$"
        postfix="USD"
      />,
    );
    expect(container.textContent).toContain('$');
    expect(container.textContent).toContain('USD');
  });

  test('renders prefix input', () => {
    render(
      <DialInput
        id="test-input"
        placeholder="domain"
        prefix="https://"
        value="123"
      />,
    );
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();

    expect(screen.getByDisplayValue('https://')).toBeInTheDocument();
    expect(screen.getByDisplayValue('.com')).toBeInTheDocument();

    const httpsInput = screen.getByDisplayValue('https://');
    const comInput = screen.getByDisplayValue('.com');

    expect(httpsInput).toBeDisabled();
    expect(comInput).toBeDisabled();
  });

  test('handleKeyDown blocks non-numeric keys on number input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Controlled = () => {
      const [val, setVal] = useState('');
      return (
        <DialInput
          id="num"
          placeholder="num"
          type="number"
          value={val}
          onChange={(v) => {
            setVal(v);
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
        <DialInput
          id="plain"
          placeholder="plain"
          type="text"
          value={val}
          onChange={setVal}
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
        <DialInput
          id="num-allowed"
          placeholder="num-allowed"
          type="number"
          value={val}
          onChange={setVal}
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
        <DialInput
          id="min-guard"
          placeholder="min-guard"
          type="number"
          min={10}
          value={val}
          onChange={setVal}
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
        <DialInput
          id="max-guard"
          placeholder="max-guard"
          type="number"
          max={100}
          value={val}
          onChange={setVal}
        />
      );
    };

    render(<Controlled />);
    const input = screen.getByPlaceholderText('max-guard') as HTMLInputElement;

    await user.type(input, '1');
    expect(input.value).toBe('100');
  });

  test('uses cursor position to build newValue; blocks when inserted digit violates range', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [val, setVal] = useState('150');
      return (
        <DialInput
          id="cursor-range"
          placeholder="cursor-range"
          max={180}
          value={val}
          onChange={setVal}
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

test('shows tooltip with value on hover', async () => {
  const user = userEvent.setup();

  render(
    <DialInput
      id="test-input"
      value="Input value"
      placeholder="tooltip-test-value"
    />,
  );

  const input = screen.getByPlaceholderText(
    'tooltip-test-value',
  ) as HTMLInputElement;

  await user.hover(input);

  await waitFor(() => {
    expect(screen.getByText('Input value')).toBeInTheDocument();
  });
});

test('shows tooltip with tooltipText on hover', async () => {
  const user = userEvent.setup();

  render(
    <DialInput
      id="test-input"
      value="Input value"
      tooltipText="Tooltip text"
      placeholder="tooltip-test-value"
    />,
  );

  const input = screen.getByPlaceholderText(
    'tooltip-test-value',
  ) as HTMLInputElement;

  await user.hover(input);

  await waitFor(() => {
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });
});
