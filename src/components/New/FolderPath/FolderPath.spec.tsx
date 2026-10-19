import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { FolderPath } from './FolderPath';

describe('Dial UI Kit :: FolderPath', () => {
  test('Should render every segment, in order', () => {
    render(<FolderPath segments={['Shared', 'Team Space', 'Reports']} />);
    const nav = screen.getByRole('navigation');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(nav).toHaveTextContent('SharedTeam SpaceReports');
  });

  test('Should style only the last segment as the leaf', () => {
    render(<FolderPath segments={['Shared', 'Team Space', 'Reports']} />);
    const leaf = screen.getByText('Reports');
    expect(leaf.tagName).toBe('SPAN');
    expect(leaf).toHaveClass('dial-small-semi-text');

    expect(screen.getByText('Shared')).not.toHaveClass('dial-small-semi-text');
    expect(screen.getByText('Team Space')).not.toHaveClass(
      'dial-small-semi-text',
    );
  });

  test('Should render the folder icon exactly once, before the first segment', () => {
    const { container } = render(
      <FolderPath segments={['Shared', 'Team Space', 'Reports']} />,
    );
    const icons = container.querySelectorAll('svg.tabler-icon-folder');
    expect(icons).toHaveLength(1);

    const items = screen.getAllByRole('listitem');
    expect(items[0].querySelector('svg.tabler-icon-folder')).not.toBeNull();
    expect(items[1].querySelector('svg.tabler-icon-folder')).toBeNull();
    expect(items[2].querySelector('svg.tabler-icon-folder')).toBeNull();
  });

  test('Should mark every segment as disabled/non-interactive', () => {
    render(<FolderPath segments={['Shared', 'Team Space', 'Reports']} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    const disabledSpans = screen
      .getAllByRole('listitem')
      .map((item) => item.querySelector('[aria-disabled="true"]'));
    expect(disabledSpans.every(Boolean)).toBe(true);
  });

  test("Should forward caller className to the breadcrumb's nav element", () => {
    render(
      <FolderPath segments={['Shared', 'Reports']} className="custom-path" />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom-path');
  });

  test('Should name the landmark as a folder path rather than a breadcrumb', () => {
    render(<FolderPath segments={['Shared', 'Reports']} />);

    // DialBreadcrumb defaults to "Breadcrumb", which misdescribes a path whose
    // segments are all disabled and non-navigable.
    expect(
      screen.getByRole('navigation', { name: 'Folder path' }),
    ).toBeInTheDocument();
  });

  test('Should let the caller rename the landmark', () => {
    render(
      <FolderPath segments={['Shared', 'Reports']} ariaLabel="Source folder" />,
    );

    expect(
      screen.getByRole('navigation', { name: 'Source folder' }),
    ).toBeInTheDocument();
  });

  test('Should collapse the middle of a long path into a non-interactive ellipsis', () => {
    render(
      <FolderPath segments={['Shared', 'Team', 'Sub', 'Project', 'Reports']} />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('Shared')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    // The hidden segments open no menu: nothing in the path is interactive.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('Should keep the collapsed segments in the accessible text', () => {
    render(
      <FolderPath segments={['Shared', 'Team', 'Sub', 'Project', 'Reports']} />,
    );

    expect(screen.getByText('Team, Sub')).toHaveClass('sr-only');
  });

  test('Should show the full path in a tooltip when the ellipsis is hovered', async () => {
    const user = userEvent.setup();
    render(
      <FolderPath segments={['Shared', 'Team', 'Sub', 'Project', 'Reports']} />,
    );

    await user.hover(screen.getByText('Team, Sub'));

    expect(
      await screen.findByText('Shared > Team > Sub > Project > Reports'),
    ).toBeInTheDocument();
  });

  test('Should not collapse a path of three segments', () => {
    render(<FolderPath segments={['Shared', 'Team', 'Reports']} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByText(/ > /)).not.toBeInTheDocument();
  });

  test('Should fold the folder before the leaf into the ellipsis when the leaf still does not fit', async () => {
    /*
     * jsdom has no layout: the leaf reports a clipped label, the folder before
     * it reports zero width (its minimum, since jsdom applies no min-width).
     */
    const widthOf = (element: HTMLElement, leaf: number, other: number) =>
      element.textContent === 'Reports' ? leaf : other;
    const scrollWidth = vi
      .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
      .mockImplementation(function (this: HTMLElement) {
        return widthOf(this, 200, 0);
      });
    const clientWidth = vi
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(function (this: HTMLElement) {
        return this.tagName === 'NAV' ? 300 : widthOf(this, 120, 0);
      });

    render(<FolderPath segments={['Shared', 'Team', 'Reports']} />);

    await waitFor(() =>
      expect(screen.getByText('Team')).toHaveClass('sr-only'),
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Reports')).toBeInTheDocument();

    scrollWidth.mockRestore();
    clientWidth.mockRestore();
  });

  test('Should keep every segment of a path that fits', async () => {
    render(<FolderPath segments={['Shared', 'Team', 'Reports']} />);

    // Give the deferred measurement a frame to run.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(screen.getByText('Team')).not.toHaveClass('sr-only');
  });

  test('Should hide decorative icons from assistive tech', () => {
    const { container } = render(
      <FolderPath segments={['Shared', 'Team', 'Reports']} />,
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((icon) =>
      expect(icon).toHaveAttribute('aria-hidden', 'true'),
    );
  });
});
