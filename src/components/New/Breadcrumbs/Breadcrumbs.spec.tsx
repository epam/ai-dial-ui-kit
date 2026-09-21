import { IconFolder } from '@tabler/icons-react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Breadcrumbs, type BreadcrumbsItem } from './Breadcrumbs';

const TRAIL: BreadcrumbsItem[] = [
  { label: 'My files', href: '/' },
  { label: 'DK Test', href: '/dk-test' },
  { label: 'DK Test with nested' },
];

const DEEP_TRAIL: BreadcrumbsItem[] = [
  { label: 'My files', href: '/' },
  { label: 'Level 1', href: '/1' },
  { label: 'Level 2', href: '/2' },
  { label: 'Level 3', href: '/3' },
  { label: 'Leaf' },
];

describe('Dial UI Kit :: Breadcrumbs', () => {
  test('renders a named nav holding the trail in order', () => {
    render(<Breadcrumbs items={TRAIL} />);

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(
      within(nav)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['My files', 'DK Test', 'DK Test with nested']);
  });

  test('takes an accessible name for the nav', () => {
    render(<Breadcrumbs items={TRAIL} ariaLabel="File path" />);

    expect(
      screen.getByRole('navigation', { name: 'File path' }),
    ).toBeInTheDocument();
  });

  test('marks the last segment as the current page and leaves it inert', () => {
    render(<Breadcrumbs items={TRAIL} />);

    expect(screen.getByRole('link', { name: 'My files' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'DK Test with nested' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('DK Test with nested').closest('[aria-current="page"]'),
    ).toBeInTheDocument();
  });

  test('never links the last segment, even when it carries an href', () => {
    render(<Breadcrumbs items={[{ label: 'Only', href: '/only' }]} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      screen.getByText('Only').closest('[aria-current="page"]'),
    ).toBeInTheDocument();
  });

  test('links a segment to its href', () => {
    render(<Breadcrumbs items={TRAIL} />);

    expect(screen.getByRole('link', { name: 'DK Test' })).toHaveAttribute(
      'href',
      '/dk-test',
    );
  });

  test('renders a segment with only an onClick as a button and fires it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Breadcrumbs
        items={[{ label: 'My files', onClick }, { label: 'Current' }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'My files' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('fires onClick on a linked segment too', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault(),
    );
    render(
      <Breadcrumbs
        items={[{ label: 'My files', href: '/', onClick }, { label: 'Leaf' }]}
      />,
    );

    await user.click(screen.getByRole('link', { name: 'My files' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('draws a segment with nowhere to go as plain text', () => {
    render(<Breadcrumbs items={[{ label: 'Shared' }, { label: 'Leaf' }]} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Shared')).toBeInTheDocument();
  });

  test('renders the leading icon of a segment', () => {
    render(
      <Breadcrumbs
        items={[
          {
            label: 'My files',
            href: '/',
            icon: <IconFolder data-testid="root-icon" aria-hidden="true" />,
          },
          { label: 'Leaf' },
        ]}
      />,
    );

    expect(screen.getByTestId('root-icon')).toBeInTheDocument();
  });

  test('renders nothing for an empty trail', () => {
    const { container } = render(<Breadcrumbs items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  test('keeps a trail within maxVisibleItems whole', () => {
    render(<Breadcrumbs items={DEEP_TRAIL} maxVisibleItems={5} />);

    expect(
      screen.queryByRole('button', { name: 'Show hidden path segments' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  test('collapses the middle behind the ellipsis, keeping the root and the current page', () => {
    render(<Breadcrumbs items={DEEP_TRAIL} />);

    expect(
      screen.getByRole('button', { name: 'Show hidden path segments' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My files' })).toBeInTheDocument();
    expect(
      screen.getByText('Leaf').closest('[aria-current="page"]'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Level 3' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Level 1' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Level 2' }),
    ).not.toBeInTheDocument();
  });

  test('takes an accessible name for the ellipsis button', () => {
    render(<Breadcrumbs items={DEEP_TRAIL} overflowAriaLabel="Show more" />);

    expect(
      screen.getByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();
  });

  test('clamps maxVisibleItems to root, ellipsis and current page', () => {
    render(<Breadcrumbs items={DEEP_TRAIL} maxVisibleItems={1} />);

    expect(
      screen.getByRole('button', { name: 'Show hidden path segments' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My files' })).toBeInTheDocument();
    expect(
      screen.getByText('Leaf').closest('[aria-current="page"]'),
    ).toBeInTheDocument();
    // Only the root, the ellipsis and the leaf survive the collapse.
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('fires the onClick of a segment picked from the ellipsis menu', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Breadcrumbs
        items={[
          { label: 'My files', href: '/' },
          { label: 'Level 1', onClick },
          { label: 'Level 2', href: '/2' },
          { label: 'Level 3', href: '/3' },
          { label: 'Leaf' },
        ]}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Show hidden path segments' }),
    );
    await user.click(screen.getByRole('menuitem', { name: 'Level 1' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('draws a separator after every segment but the last, hidden from assistive tech', () => {
    render(<Breadcrumbs items={TRAIL} separator={<span>/</span>} />);

    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(TRAIL.length - 1);
    separators.forEach((separator) =>
      expect(separator.closest('[aria-hidden="true"]')).toBeInTheDocument(),
    );
  });
});
