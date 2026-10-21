import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { StateScreen } from './StateScreen';

describe('Dial UI Kit :: StateScreen', () => {
  test('renders the title as the h1 and names the region after it', () => {
    render(<StateScreen title="Access denied" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Access denied' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Access denied' }),
    ).toBeInTheDocument();
  });

  test('renders the description when given and omits it otherwise', () => {
    const { rerender } = render(
      <StateScreen title="Access denied" description="Ask the owner." />,
    );

    expect(screen.getByText('Ask the owner.')).toBeInTheDocument();

    rerender(<StateScreen title="Access denied" />);

    expect(screen.queryByText('Ask the owner.')).not.toBeInTheDocument();
  });

  test('hides the icon badge from assistive tech and drops it without an icon', () => {
    const { container, rerender } = render(
      <StateScreen title="Log in" icon={<svg />} />,
    );

    const badge = container.querySelector('svg')?.parentElement;
    expect(badge).toHaveAttribute('aria-hidden', 'true');

    rerender(<StateScreen title="Log in" />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  test('renders the action and leaves it interactive', async () => {
    const onClick = vi.fn();
    render(
      <StateScreen
        title="Log in"
        action={
          <button type="button" onClick={onClick}>
            Log in
          </button>
        }
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  test('merges the caller classes onto the root, title and description', () => {
    render(
      <StateScreen
        title="Log in"
        description="Set up."
        className="h-dvh"
        titleClassName="custom-title"
        descriptionClassName="custom-description"
      />,
    );

    expect(screen.getByRole('region', { name: 'Log in' })).toHaveClass('h-dvh');
    expect(screen.getByRole('heading', { name: 'Log in' })).toHaveClass(
      'custom-title',
    );
    expect(screen.getByText('Set up.')).toHaveClass('custom-description');
  });
});
