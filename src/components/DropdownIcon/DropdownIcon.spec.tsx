import { fireEvent, render, screen } from '@testing-library/react';
import { IconBrandOpenai } from '@tabler/icons-react';
import { describe, expect, test, vi } from 'vitest';

import { DialDropdownIcon } from './DropdownIcon';
import type { DropdownItem } from '@/models/dropdown';
import { ElementSize } from '@/types/size';

const items: DropdownItem[] = [
  { key: 'gpt', label: 'GPT 5.4' },
  { key: 'assistant', label: 'Assistant 10k' },
];

describe('Dial UI Kit :: DropdownIcon', () => {
  test('renders icon button trigger and opens menu', () => {
    render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
      />,
    );

    const button = screen.getByRole('button', { name: 'Select model' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-10');

    fireEvent.click(button);
    expect(screen.getByRole('menuitem', { name: 'GPT 5.4' })).toBeVisible();
    expect(
      screen.getByRole('menuitem', { name: 'Assistant 10k' }),
    ).toBeVisible();
  });

  test('uses compact sizing and can hide caret', () => {
    render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai data-testid="model-icon" />}
        items={items}
        size={ElementSize.Small}
        showCaret={false}
      />,
    );

    const button = screen.getByRole('button', { name: 'Select model' });
    expect(button).toHaveClass('h-8', 'w-8', 'px-0');
    expect(screen.getByTestId('model-icon')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByRole('menuitem', { name: 'GPT 5.4' })).toBeVisible();
  });

  test('uses large sizing with correct icon size', () => {
    const { container } = render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
        size={ElementSize.Large}
        showCaret={false}
      />,
    );

    const button = screen.getByRole('button', { name: 'Select model' });
    expect(button).toHaveClass('h-10', 'w-10', 'px-0');
    expect(container.querySelector('.size-7')).toBeInTheDocument();
  });

  test('applies square sizing on standard size without caret', () => {
    render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
        showCaret={false}
      />,
    );
    expect(screen.getByRole('button', { name: 'Select model' })).toHaveClass(
      'h-10',
      'w-10',
      'px-0',
    );
  });

  test('disabled prevents menu opening', () => {
    render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
        disabled
      />,
    );

    const button = screen.getByRole('button', { name: 'Select model' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  test('calls onOpenChange and works in controlled mode', () => {
    const onOpenChange = vi.fn();
    render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select model' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  test('fires menu click handler and forwards dropdown class names', () => {
    const onClick = vi.fn();
    const { container } = render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
        onItemClick={onClick}
        className="custom-wrapper"
        buttonClassName="custom-button"
        iconClassName="custom-icon"
      />,
    );

    expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('custom-button');
    expect(container.querySelector('.custom-icon')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Select model' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Assistant 10k' }));

    expect(onClick).toHaveBeenCalledWith({
      key: 'assistant',
      domEvent: expect.any(Object),
    });
  });
});
