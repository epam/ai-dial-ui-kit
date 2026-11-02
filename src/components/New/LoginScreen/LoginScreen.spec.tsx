import { createRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { LoginScreen } from './LoginScreen';

const providers = [
  {
    id: 'keycloak',
    label: 'Keycloak',
    href: '/login/keycloak',
    iconSrc: '/keycloak.svg',
  },
  { id: 'azure', label: 'Azure', href: '/login/azure' },
];

describe('Dial UI Kit :: LoginScreen', () => {
  test('renders the title as the h1 and names the region after it', () => {
    render(<LoginScreen title="Welcome to DIAL" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Welcome to DIAL' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Welcome to DIAL' }),
    ).toBeInTheDocument();
  });

  test('renders one named link per provider inside a named list', () => {
    render(
      <LoginScreen
        title="Welcome"
        description="Sign in with:"
        providersLabel="Sign-in options"
        providers={providers}
      />,
    );

    const list = screen.getByRole('list', { name: 'Sign-in options' });
    expect(
      within(list).getByRole('link', { name: 'Keycloak' }),
    ).toHaveAttribute('href', '/login/keycloak');
    expect(within(list).getByRole('link', { name: 'Azure' })).toHaveAttribute(
      'href',
      '/login/azure',
    );
    expect(screen.getByText('Sign in with:')).toBeInTheDocument();
  });

  test('omits the prompt and the list without providers', () => {
    render(
      <LoginScreen
        title="Welcome"
        description="Sign in with:"
        providersLabel="Sign-in options"
      />,
    );

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign in with:')).not.toBeInTheDocument();
  });

  test('keeps a provider logo decorative and drops it when it fails to load', () => {
    render(<LoginScreen title="Welcome" providers={providers} />);
    const link = screen.getByRole('link', { name: 'Keycloak' });
    const logo = link.querySelector('img');

    expect(logo).toHaveAttribute('alt', '');
    expect(logo).toHaveAttribute('aria-hidden', 'true');

    fireEvent.error(logo as HTMLImageElement);

    expect(link.querySelector('img')).toBeNull();
    expect(screen.getByRole('link', { name: 'Keycloak' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Azure' }).querySelector('img'),
    ).toBeNull();
  });

  test('drops a product mark that fails to load', () => {
    const { container } = render(
      <LoginScreen title="Welcome" logoSrc="/favicon.svg" />,
    );
    const logo = container.querySelector('img');

    expect(logo).toHaveAttribute('aria-hidden', 'true');
    fireEvent.error(logo as HTMLImageElement);

    expect(container.querySelector('img')).toBeNull();
  });

  test('renders state content and exposes a focusable title', () => {
    const titleRef = createRef<HTMLHeadingElement>();
    render(
      <LoginScreen title="Welcome" titleRef={titleRef}>
        <p role="alert">Sign-in options could not be loaded.</p>
      </LoginScreen>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Sign-in options could not be loaded.',
    );
    titleRef.current?.focus();
    expect(screen.getByRole('heading', { name: 'Welcome' })).toHaveFocus();
  });

  test('merges a caller className onto the root', () => {
    render(<LoginScreen title="Welcome" className="flex-1" />);

    expect(screen.getByRole('region', { name: 'Welcome' })).toHaveClass(
      'flex-1',
    );
  });
});
