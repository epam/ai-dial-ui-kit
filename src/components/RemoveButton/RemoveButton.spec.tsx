import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialRemoveButton } from './RemoveButton';
import { BASE_ICON_PROPS } from '@/constants/icon';

describe('Dial UI Kit :: DialRemoveButton', () => {
  it('renders a button element', () => {
    const { getByRole } = render(<DialRemoveButton onClick={vi.fn()} />);
    const button = getByRole('button');

    expect(button).toBeInTheDocument();
  });

  it('applies aria-label if provided', () => {
    const { getByLabelText } = render(
      <DialRemoveButton aria-label="Delete item" onClick={vi.fn()} />,
    );

    expect(getByLabelText('Delete item')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { getByRole } = render(<DialRemoveButton onClick={onClick} />);

    fireEvent.click(getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom cssClass when provided', () => {
    const { getByRole } = render(
      <DialRemoveButton className="custom-remove" onClick={vi.fn()} />,
    );

    expect(getByRole('button').className).toMatch(/custom-remove/);
  });

  it('renders IconTrashX as the leading icon', () => {
    const { container } = render(<DialRemoveButton onClick={vi.fn()} />);
    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
    expect(icon?.getAttribute('width')).toBe(String(BASE_ICON_PROPS.size));
    expect(icon?.getAttribute('height')).toBe(String(BASE_ICON_PROPS.size));
  });

  it('applies custom iconClass to the IconTrashX element', () => {
    const { container } = render(
      <DialRemoveButton iconClass="text-error" onClick={vi.fn()} />,
    );

    const icon = container.querySelector('svg');

    expect(icon?.classList.contains('text-error')).toBe(true);
  });
});
