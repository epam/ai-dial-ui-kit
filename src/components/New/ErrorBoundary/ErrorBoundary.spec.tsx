import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary';

const Crash = ({ when = true }: { when?: boolean }) => {
  if (when) throw new Error('boom');
  return <p>Content</p>;
};

const LABELS = {
  title: 'Something went wrong',
  description: 'Reload the page.',
  actionLabel: 'Reload',
} satisfies Partial<ErrorBoundaryProps>;

describe('Dial UI Kit :: ErrorBoundary', () => {
  beforeEach(() => {
    // React logs every caught render error to the console.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders the children while nothing throws', () => {
    render(
      <ErrorBoundary {...LABELS}>
        <Crash when={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('replaces a crashed subtree with the error screen', () => {
    render(
      <ErrorBoundary {...LABELS}>
        <Crash />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: LABELS.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(LABELS.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toHaveFocus();
  });

  test('announces the crash through a region mounted before it', () => {
    const { rerender } = render(
      <ErrorBoundary {...LABELS}>
        <Crash when={false} />
      </ErrorBoundary>,
    );

    const region = screen.getByRole('alert');
    expect(region).toBeEmptyDOMElement();

    rerender(
      <ErrorBoundary {...LABELS}>
        <Crash />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBe(region);
    expect(region).toHaveTextContent(LABELS.title);
  });

  test('reports the error once through onError', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary {...LABELS} onError={onError}>
        <Crash />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0]).toEqual(new Error('boom'));
  });

  test('calls onReset and renders the children again', async () => {
    let shouldCrash = true;
    const Flaky = () => <Crash when={shouldCrash} />;
    const onReset = vi.fn(() => {
      shouldCrash = false;
    });
    render(
      <ErrorBoundary {...LABELS} actionLabel="Try again" onReset={onReset}>
        <Flaky />
      </ErrorBoundary>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onReset).toHaveBeenCalledOnce();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('reloads the page when there is no onReset', async () => {
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload,
    });
    render(
      <ErrorBoundary {...LABELS}>
        <Crash />
      </ErrorBoundary>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(reload).toHaveBeenCalledOnce();
  });

  test('clears the error when a reset key changes', () => {
    const { rerender } = render(
      <ErrorBoundary {...LABELS} resetKeys={['/broken']}>
        <Crash />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary {...LABELS} resetKeys={['/broken']}>
        <Crash when={false} />
      </ErrorBoundary>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    rerender(
      <ErrorBoundary {...LABELS} resetKeys={['/working']}>
        <Crash when={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('does not reset into a crash caused by the same key change', () => {
    const onError = vi.fn();
    const { rerender } = render(
      <ErrorBoundary {...LABELS} onError={onError} resetKeys={['/a']}>
        <Crash when={false} />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary {...LABELS} onError={onError} resetKeys={['/b']}>
        <Crash />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: LABELS.title })).toBeVisible();
  });

  test('draws a warning badge by default and drops it for a null icon', () => {
    const { container, rerender } = render(
      <ErrorBoundary {...LABELS}>
        <Crash />
      </ErrorBoundary>,
    );

    expect(container.querySelector('[aria-hidden="true"] svg')).not.toBeNull();

    rerender(
      <ErrorBoundary {...LABELS} icon={null}>
        <Crash />
      </ErrorBoundary>,
    );

    expect(container.querySelector('[aria-hidden="true"] svg')).toBeNull();
  });

  test('merges the caller class onto the fallback screen', () => {
    render(
      <ErrorBoundary {...LABELS} className="h-dvh">
        <Crash />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('region', { name: LABELS.title })).toHaveClass(
      'h-dvh',
    );
  });
});
