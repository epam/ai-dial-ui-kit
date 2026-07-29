import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
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
});
