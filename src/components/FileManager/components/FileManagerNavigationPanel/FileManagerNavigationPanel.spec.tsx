import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialFileManagerNavigationPanel } from './FileManagerNavigationPanel';

describe('Dial UI Kit :: DialFileManagerNavigationPanel', () => {
  test('renders breadcrumb nav with default aria label and segments from `path`', () => {
    render(<DialFileManagerNavigationPanel path="Organization/Folder 4" />);
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Folder 4')).toBeInTheDocument();
  });

  test('uses custom aria label for breadcrumb', () => {
    render(
      <DialFileManagerNavigationPanel
        path="Org/Team"
        ariaLabel="My Breadcrumb"
      />,
    );
    expect(
      screen.getByRole('navigation', { name: 'My Breadcrumb' }),
    ).toBeInTheDocument();
  });

  test('trims and filters empty path segments', () => {
    render(<DialFileManagerNavigationPanel path="  Org  //  Team / " />);
    expect(screen.getByText('Org')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  test('creates hrefs via `makeHref` and invokes `onItemClick` with href (click a non-last segment)', () => {
    const onItemClick = vi.fn();
    const makeHref = (segments: string[], index: number) =>
      '/' + segments.slice(0, index + 1).join('/');

    render(
      <DialFileManagerNavigationPanel
        path="Org/Dept/Team"
        makeHref={makeHref}
        onItemClick={onItemClick}
      />,
    );

    const deptLink = screen.getByRole('link', { name: 'Dept' });
    fireEvent.click(deptLink);
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith('/Org/Dept');
  });

  test('renders search when `searchable` is true and reflects controlled value', () => {
    render(
      <DialFileManagerNavigationPanel
        path="Root"
        searchable
        elementId="fm-search"
        value="diagram"
      />,
    );
    expect(screen.getByRole('search', { name: 'Search' })).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(input.value).toBe('diagram');
    expect(input).toHaveAttribute('id', 'fm-search');
  });

  test('hides search when `searchable` is false', () => {
    render(<DialFileManagerNavigationPanel path="Root" searchable={false} />);
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
  });

  test('calls `onSearchChange` with new text', () => {
    const onSearchChange = vi.fn();
    render(
      <DialFileManagerNavigationPanel
        path="Root"
        searchable
        elementId="fm-search-2"
        value=""
        onSearchChange={onSearchChange}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onSearchChange).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalledWith('abc');
  });

  test('applies container className to the root element', () => {
    const { container } = render(
      <DialFileManagerNavigationPanel path="Root" className="bg-red-500" />,
    );
    expect(container.firstChild).toHaveClass('bg-red-500');
  });

  test('renders breadcrumb even when `path` is undefined (empty trail allowed)', () => {
    render(<DialFileManagerNavigationPanel />);
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
  });

  test('renders single "/" item when path resolves to no segments', () => {
    render(<DialFileManagerNavigationPanel path="///" />);
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
  });
});
