import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { RadioGroupOrientation } from '@/types/radio-group';
import { RadioGroup } from './RadioGroup';

const items = [
  { value: 'pickup', label: 'Pickup' },
  { value: 'courier', label: 'Courier' },
  { value: 'post', label: 'Post' },
];

describe('Dial UI Kit :: RadioGroup', () => {
  test('renders a radiogroup named by its label', () => {
    render(
      <RadioGroup
        items={items}
        labelProps={{ label: 'Delivery' }}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('radiogroup', { name: 'Delivery' }),
    ).toBeInTheDocument();
  });

  test('names the group with ariaLabel when the label is a node', () => {
    render(
      <RadioGroup
        items={items}
        labelProps={{ label: <strong>Delivery</strong> }}
        ariaLabel="Delivery"
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('radiogroup', { name: 'Delivery' }),
    ).toBeInTheDocument();
  });

  test('keeps the label caption out of the group name', () => {
    render(
      <RadioGroup
        items={items}
        labelProps={{ label: 'Delivery', caption: 'This order only' }}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('radiogroup', { name: 'Delivery' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'This order only' }),
    ).toBeInTheDocument();
  });

  test('renders one radio per item, each named by its label', () => {
    render(
      <RadioGroup items={items} onChange={vi.fn()} ariaLabel="Delivery" />,
    );

    expect(screen.getAllByRole('radio')).toHaveLength(3);
    items.forEach((item) => {
      expect(
        screen.getByRole('radio', { name: item.label }),
      ).toBeInTheDocument();
    });
  });

  test('names an option with its aria-label when its label is a node', () => {
    render(
      <RadioGroup
        ariaLabel="Delivery"
        items={[
          { value: 'pickup', label: <strong>Pickup</strong> },
          { value: 'courier', label: 'Courier' },
        ]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Pickup' })).toBeInTheDocument();
  });

  test('checks the option matching value and no other', () => {
    render(
      <RadioGroup
        items={items}
        value="courier"
        ariaLabel="Delivery"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Courier' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pickup' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Post' })).not.toBeChecked();
  });

  test('calls onChange with the clicked option value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup
        items={items}
        value="pickup"
        ariaLabel="Delivery"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Post' }));

    expect(onChange).toHaveBeenCalledWith('post');
  });

  test('options are mutually exclusive', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState('pickup');

      return (
        <RadioGroup
          items={items}
          value={value}
          ariaLabel="Delivery"
          onChange={setValue}
        />
      );
    };
    render(<Controlled />);

    await user.click(screen.getByRole('radio', { name: 'Courier' }));

    expect(screen.getByRole('radio', { name: 'Courier' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pickup' })).not.toBeChecked();
  });

  test('gives every option the same input name so the browser groups them', () => {
    render(
      <RadioGroup
        id="delivery"
        items={items}
        ariaLabel="Delivery"
        onChange={vi.fn()}
      />,
    );

    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'delivery');
    });
  });

  test('mounts an option content only while that option is selected', () => {
    const { rerender } = render(
      <RadioGroup
        ariaLabel="Delivery"
        value="pickup"
        onChange={vi.fn()}
        items={[
          { value: 'pickup', label: 'Pickup' },
          { value: 'courier', label: 'Courier', content: <span>Address</span> },
        ]}
      />,
    );

    expect(screen.queryByText('Address')).not.toBeInTheDocument();

    rerender(
      <RadioGroup
        ariaLabel="Delivery"
        value="courier"
        onChange={vi.fn()}
        items={[
          { value: 'pickup', label: 'Pickup' },
          { value: 'courier', label: 'Courier', content: <span>Address</span> },
        ]}
      />,
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  test('renders an item caption and links it to that option', () => {
    render(
      <RadioGroup
        ariaLabel="Delivery"
        onChange={vi.fn()}
        items={[{ value: 'pickup', label: 'Pickup', caption: 'Ready today' }]}
      />,
    );

    const caption = screen.getByText('Ready today');

    expect(screen.getByRole('radio', { name: 'Pickup' })).toHaveAttribute(
      'aria-describedby',
      caption.id,
    );
  });

  test('disables every option when the group is disabled', () => {
    render(
      <RadioGroup
        items={items}
        ariaLabel="Delivery"
        disabled
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  test('disables only the option marked disabled', () => {
    render(
      <RadioGroup
        ariaLabel="Delivery"
        onChange={vi.fn()}
        items={[
          { value: 'pickup', label: 'Pickup' },
          { value: 'post', label: 'Post', disabled: true },
        ]}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Pickup' })).toBeEnabled();
    expect(screen.getByRole('radio', { name: 'Post' })).toBeDisabled();
  });

  test('describes the group by its error', () => {
    render(
      <RadioGroup
        items={items}
        ariaLabel="Delivery"
        error="Choose an option"
        onChange={vi.fn()}
      />,
    );

    const error = screen.getByText('Choose an option');

    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-describedby',
      error.id,
    );
  });

  test('describes the group by its caption', () => {
    render(
      <RadioGroup
        items={items}
        ariaLabel="Delivery"
        caption="Weekends excluded"
        onChange={vi.fn()}
      />,
    );

    const caption = screen.getByText('Weekends excluded');

    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-describedby',
      caption.id,
    );
  });

  test('hides the caption while an error is shown', () => {
    render(
      <RadioGroup
        items={items}
        ariaLabel="Delivery"
        caption="Weekends excluded"
        error="Choose an option"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
    expect(screen.queryByText('Weekends excluded')).not.toBeInTheDocument();
  });

  test('lays the options out in a row when asked', () => {
    render(
      <RadioGroup
        items={items}
        ariaLabel="Delivery"
        orientation={RadioGroupOrientation.Row}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('radiogroup')).toHaveClass('flex-row');
  });
});
