import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialPasswordInput } from './PasswordInput';

describe('Dial UI Kit :: DialPasswordInput', () => {
  it('renders the field title', () => {
    render(<DialPasswordInput labelProps={{ label: 'Password' }} id="pw" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(
      <DialPasswordInput
        labelProps={{ label: 'Password' }}
        id="pw"
        required
        error="Error!"
      />,
    );
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
