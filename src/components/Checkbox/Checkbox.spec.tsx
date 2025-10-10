import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialCheckbox } from './Checkbox';
import { describe, expect, test } from 'vitest';

describe('Dial UI Kit :: DialCheckbox', () => {
  test('renders checked checkbox', () => {
    render(<DialCheckbox checked={true} id="checkbox" />);

    const input = screen.getByRole('checkbox');

    expect(input).toBeInTheDocument();
    expect(input).toBeChecked();
  });

  test('renders unchecked checkbox and no svg icon', () => {
    render(<DialCheckbox checked={false} id="checkbox" />);

    const input = screen.getByRole('checkbox');

    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
    expect(document.querySelectorAll('svg').length).toBe(0);
  });

  test('calls onChange when clicked', async () => {
    let value = false;
    const onChange = (v?: boolean) => {
      value = !!v;
    };

    render(<DialCheckbox id="testInput" checked={value} onChange={onChange} />);

    const input = screen.getByRole('checkbox');

    expect(input).not.toBeChecked();
    await userEvent.click(input);
    expect(value).toBeTruthy();
  });

  test('returns checked checkbox id on change', async () => {
    let checkboxId: string | undefined = undefined;
    const onChange = (_v?: boolean, id?: string) => {
      checkboxId = id;
    };
    render(
      <DialCheckbox
        id="testInput"
        checked={true}
        onChange={onChange}
        label="text"
      />,
    );
    const input = screen.getByRole('checkbox');
    await userEvent.click(input);
    expect(checkboxId).toEqual('testInput');
  });

  test('applies disabled classes on wrapper (label) when disabled', () => {
    render(
      <DialCheckbox
        id="disabled-1"
        label="Disabled checkbox"
        checked={false}
        disabled={true}
      />,
    );

    const input = screen.getByRole('checkbox');
    const labelEl = input.closest('label') as HTMLLabelElement;

    expect(labelEl).toBeInTheDocument();
    expect(labelEl).toHaveClass(
      'pointer-events-none',
      'text-secondary',
      'before:border-icon-secondary',
      'before:bg-layer-4',
    );

    expect(input).toHaveAttribute('aria-disabled', 'true');
  });

  test('applies disabled classes on icon when disabled and checked', () => {
    const { rerender } = render(
      <DialCheckbox
        id="disabled-2"
        label="Disabled checked"
        checked={true}
        disabled={true}
      />,
    );

    let icon = document.querySelector('svg') as SVGElement;
    expect(icon).toBeInTheDocument();

    expect(icon).toHaveClass('mr-2', 'border', 'rounded');
    expect(icon).toHaveClass('bg-layer-4', 'border-icon-secondary');

    rerender(
      <DialCheckbox
        id="disabled-3"
        label="Disabled indeterminate"
        checked={false}
        indeterminate={true}
        disabled={true}
      />,
    );
    icon = document.querySelector('svg') as SVGElement;
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass(
      'mr-2',
      'border',
      'rounded',
      'bg-layer-4',
      'border-icon-secondary',
    );
  });

  test('sets aria-checked="mixed" when indeterminate', () => {
    render(
      <DialCheckbox
        id="indeterminate-1"
        label="Indeterminate"
        checked={false}
        indeterminate={true}
      />,
    );

    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('aria-checked', 'mixed');

    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBe(1);
  });
});
