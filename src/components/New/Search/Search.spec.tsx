import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { ElementSize } from '@/types/size';
import { Search } from './Search';

/** Mirrors how a consumer wires the controlled field. */
const ControlledSearch = ({ initial = '' }: { initial?: string }) => {
  const [value, setValue] = useState<string | undefined>(initial);

  return (
    <Search
      id="search"
      placeholder="Search"
      value={value}
      onChange={setValue}
    />
  );
};

describe('Dial UI Kit :: Search', () => {
  test('renders a text box with the default placeholder', () => {
    render(<Search id="search" />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  /**
   * Tabler defaults to a 2px stroke, which is heavier than the 1.5px the 2.0
   * scale reserves for icons — the weight only lands if the component passes
   * `DIAL_KIT_ICON_STROKE`, so the attribute is what proves it did.
   */
  test('draws the magnifier at the icon stroke', () => {
    const { container } = render(<Search id="search" />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'stroke-width',
      String(DIAL_KIT_ICON_STROKE),
    );
  });

  test('reports every edit through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Search id="search" placeholder="Search" onChange={onChange} />);

    await user.type(screen.getByPlaceholderText('Search'), 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });

  test('reports an emptied field as undefined', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Search id="search" placeholder="Search" value="a" onChange={onChange} />,
    );

    await user.clear(screen.getByPlaceholderText('Search'));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  test('calls onBlur when the field loses focus', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Search id="search" placeholder="Search" onBlur={onBlur} />);

    await user.click(screen.getByPlaceholderText('Search'));
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('disables the field', () => {
    render(<Search id="search" placeholder="Search" disabled />);

    expect(screen.getByPlaceholderText('Search')).toBeDisabled();
  });

  describe('clear button', () => {
    test('is absent while the field is empty', () => {
      render(<Search id="search" placeholder="Search" />);

      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument();
    });

    test('is absent on a disabled field that holds a value', () => {
      render(<Search id="search" placeholder="Search" value="a" disabled />);

      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
      ).not.toBeInTheDocument();
    });

    test('empties the field when pressed', async () => {
      const user = userEvent.setup();
      render(<ControlledSearch initial="hello" />);

      await user.click(screen.getByRole('button', { name: 'Clear search' }));

      expect(screen.getByPlaceholderText('Search')).toHaveValue('');
    });

    test('returns focus to the input so it is not lost with the button', async () => {
      const user = userEvent.setup();
      render(<ControlledSearch initial="hello" />);

      await user.click(screen.getByRole('button', { name: 'Clear search' }));

      expect(screen.getByPlaceholderText('Search')).toHaveFocus();
    });

    test('takes its accessible name from clearLabel', () => {
      render(
        <Search
          id="search"
          placeholder="Search"
          value="a"
          clearLabel="Reset filter"
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Reset filter' }),
      ).toBeInTheDocument();
    });
  });

  describe('size', () => {
    // jsdom does no layout, so only the variant class is observable here.
    test.each([
      [ElementSize.Small, 'dial-kit-input-small'],
      [ElementSize.Large, 'dial-kit-input'],
    ])('passes %s down to the field', (size, expected) => {
      render(<Search id="search" placeholder="Search" size={size} />);

      expect(screen.getByLabelText('input-container')).toHaveClass(expected);
    });

    test('scales the magnifier with the field', () => {
      const { rerender } = render(
        <Search id="search" placeholder="Search" size={ElementSize.Small} />,
      );
      const magnifier = () =>
        screen.getByLabelText('input-container').querySelector('svg');

      expect(magnifier()).toHaveAttribute('width', '16');

      rerender(
        <Search id="search" placeholder="Search" size={ElementSize.Large} />,
      );

      expect(magnifier()).toHaveAttribute('width', '20');
    });
  });

  describe('withoutBorder', () => {
    test('adds the borderless modifier to the field wrapper', () => {
      render(<Search id="search" placeholder="Search" withoutBorder />);

      expect(screen.getByLabelText('input-container')).toHaveClass(
        'dial-kit-input-borderless',
      );
    });

    test('is off by default', () => {
      render(<Search id="search" placeholder="Search" />);

      expect(screen.getByLabelText('input-container')).not.toHaveClass(
        'dial-kit-input-borderless',
      );
    });
  });

  test('keeps a consumer inputRef working alongside the internal one', async () => {
    const user = userEvent.setup();
    let node: HTMLInputElement | null = null;
    render(
      <Search
        id="search"
        placeholder="Search"
        size={ElementSize.Small}
        inputRef={(element) => {
          node = element;
        }}
      />,
    );

    await user.click(screen.getByPlaceholderText('Search'));

    expect(node).toBe(screen.getByPlaceholderText('Search'));
  });
});
