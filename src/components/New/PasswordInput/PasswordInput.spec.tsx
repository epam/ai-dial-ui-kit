import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { ElementSize } from '@/types/size';
import { PasswordInput } from './PasswordInput';

const getField = () => screen.getByLabelText('Password');

describe('Dial UI Kit :: PasswordInput', () => {
  test('renders the label, caption and error of the underlying Input', () => {
    const { rerender } = render(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        caption="At least 12 characters"
      />,
    );

    expect(getField()).toBeInTheDocument();
    expect(screen.getByText('At least 12 characters')).toBeInTheDocument();

    rerender(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        caption="At least 12 characters"
        error="Password is required"
      />,
    );

    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(
      screen.queryByText('At least 12 characters'),
    ).not.toBeInTheDocument();
  });

  test('masks the value until the toggle is pressed', async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        value="secret"
      />,
    );

    expect(getField()).toHaveAttribute('type', 'password');

    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(getField()).toHaveAttribute('type', 'text');
    const pressedToggle = screen.getByRole('button', {
      name: 'Hide password',
    });
    expect(pressedToggle).toHaveAttribute('aria-pressed', 'true');

    await user.click(pressedToggle);
    expect(getField()).toHaveAttribute('type', 'password');
  });

  test('the toggle is reachable and operable by keyboard', async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        value="secret"
      />,
    );

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(getField()).toHaveAttribute('type', 'text');
  });

  test('accepts custom toggle labels', async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        showPasswordLabel="Passwort anzeigen"
        hidePasswordLabel="Passwort verbergen"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Passwort anzeigen' }));
    expect(
      screen.getByRole('button', { name: 'Passwort verbergen' }),
    ).toBeInTheDocument();
  });

  test('a disabled field stays masked and its toggle is disabled', async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        value="secret"
        disabled
      />,
    );

    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toBeDisabled();

    await user.click(toggle);
    expect(getField()).toHaveAttribute('type', 'password');
    // The value must not leak through the tooltip `Input` adds to disabled fields.
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  test('reports changes through the Input onChange signature', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    const Controlled = () => {
      const [value, setValue] = useState('');
      return (
        <PasswordInput
          id="pw"
          labelProps={{ label: 'Password' }}
          value={value}
          onChange={(next) => {
            setValue(next ?? '');
            onChange(next);
          }}
        />
      );
    };

    render(<Controlled />);
    await user.type(getField(), 'ab');

    expect(onChange).toHaveBeenLastCalledWith('ab');
    expect(getField()).toHaveValue('ab');
  });

  test('passes the size down to the field', () => {
    render(
      <PasswordInput
        id="pw"
        labelProps={{ label: 'Password' }}
        size={ElementSize.Small}
      />,
    );

    expect(screen.getByLabelText('input-container')).toHaveClass(
      'dial-kit-input-small',
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveClass(
      'size-[24px]',
    );
  });
});
