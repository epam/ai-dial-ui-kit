import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialPasswordInputField } from './PasswordInputField';

describe('Dia UI Kit :: DialPasswordInputField', () => {
  it('renders the field title', () => {
    render(<DialPasswordInputField fieldTitle="Password" elementId="pw" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders error text', () => {
    render(
      <DialPasswordInputField
        fieldTitle="Password"
        elementId="pw"
        errorText="Error!"
      />,
    );
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('renders optional label', () => {
    render(
      <DialPasswordInputField fieldTitle="Password" elementId="pw" optional />,
    );
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });
});
