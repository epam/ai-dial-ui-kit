import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialPasswordInput } from './PasswordInput';

describe('Dial UI Kit :: DialPasswordInput', () => {
  it('renders the field title', () => {
    render(
      <DialPasswordInput labelProps={{ fieldLabel: 'Password' }} id="pw" />,
    );
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(
      <DialPasswordInput
        labelProps={{ fieldLabel: 'Password' }}
        id="pw"
        required
        errorText="Error!"
      />,
    );
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('toggles back to password when clicking the hide control', () => {
    render(
      <DialPasswordInput
        id="pw"
        labelProps={{ fieldLabel: 'Password' }}
        value=""
        onChange={() => null}
      />,
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    const showBtn = screen.queryByRole('button', { name: /show/i });
    if (showBtn) fireEvent.click(showBtn);
    expect(input.type).toBe('text');

    const hideBtn = screen.queryByRole('button', { name: /hide/i });
    if (hideBtn) fireEvent.click(hideBtn);
    expect(input.type).toBe('password');
  });
});
