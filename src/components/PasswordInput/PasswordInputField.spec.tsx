import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialPasswordInputField } from './PasswordInputField';

describe('Dial UI Kit :: DialPasswordInputField', () => {
  it('renders the field title', () => {
    render(<DialPasswordInputField fieldLabel="Password" elementId="pw" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(
      <DialPasswordInputField
        fieldLabel="Password"
        elementId="pw"
        errorText="Error!"
      />,
    );
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('renders optional label', () => {
    render(
      <DialPasswordInputField fieldLabel="Password" elementId="pw" optional />,
    );
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });

  it('toggles back to password when clicking the hide control', () => {
    render(
      <DialPasswordInputField
        elementId="pw"
        fieldLabel="Password"
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
