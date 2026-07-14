import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialBreadcrumb } from './Breadcrumb';
import { DialBreadcrumbItem } from './BreadcrumbItem';

describe('Dial UI Kit :: DialBreadcrumb (final)', () => {
  test('renders <nav> with default aria-label and horizontal scroll container', () => {
    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '/' },
          { label: 'Section', href: '/section' },
          { label: 'Current' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    expect(nav.className).toContain('w-full overflow-hidden');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('pathItems prop: interactive pathItems are links; last is current with primary text', () => {
    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#home' },
          { label: 'Library', href: '#lib' },
          { label: 'Data' },
        ]}
      />,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.className).toMatch(/hover:text-accent-primary/);

    const currentText = screen.getByText('Data');
    const currentLi = currentText.closest('li') as HTMLElement;
    const currentWrapper = currentLi.querySelector(
      '[aria-current="page"]',
    ) as HTMLElement;
    expect(currentWrapper).toBeTruthy();
    expect(currentWrapper.className).toMatch(/text-primary/);
  });

  test('disabled item becomes non-interactive and has disabled styles', () => {
    const onClick = vi.fn();
    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#', onClick, disabled: true },
          { label: 'Current' },
        ]}
      />,
    );

    const disabledText = screen.getByText('Home');
    expect(disabledText.closest('a')).toBeNull();

    const disabledLi = disabledText.closest('li') as HTMLElement;
    const disabledWrapper = disabledLi.querySelector(
      '[aria-disabled="true"]',
    ) as HTMLElement;
    expect(disabledWrapper).toBeTruthy();
    expect(disabledWrapper.className).toMatch(/opacity-75/);

    fireEvent.click(disabledText);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('composition API: children <DialBreadcrumbItem/> receive current/last injection', () => {
    render(
      <DialBreadcrumb>
        <DialBreadcrumbItem label="Home" href="#" />
        <DialBreadcrumbItem label="Section" href="#" />
        <DialBreadcrumbItem label="Current" />
      </DialBreadcrumb>,
    );
    const currentText = screen.getByText('Current');
    const currentLi = currentText.closest('li') as HTMLElement;
    const currentWrapper = currentLi.querySelector(
      '[aria-current="page"]',
    ) as HTMLElement;
    expect(currentWrapper).toBeTruthy();
  });

  test('custom separator string is rendered between pathItems', () => {
    render(
      <DialBreadcrumb
        separator="/"
        pathItems={[
          { label: 'A', href: '#' },
          { label: 'B', href: '#' },
          { label: 'C' },
        ]}
      />,
    );
    const separators = screen.getAllByText('/');
    expect(separators.length).toBe(2);
  });

  test('iconBefore is rendered when provided', () => {
    render(
      <DialBreadcrumb
        pathItems={[
          {
            label: 'Folder',
            href: '#',
            iconBefore: <span aria-label="icon">📁</span>,
          },
          { label: 'Current', iconBefore: <span aria-label="icon">📁</span> },
        ]}
      />,
    );
    const icons = screen.getAllByLabelText('icon');
    expect(icons.length).toBe(2);
  });

  test('navigation guard allows navigation when returning true', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(true);
    const onClick = vi.fn();

    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#home', onClick },
          { label: 'Current' },
        ]}
        onBeforeNavigate={onBeforeNavigate}
      />,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('navigation guard prevents navigation when returning false', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(false);
    const onClick = vi.fn();

    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#home', onClick },
          { label: 'Current' },
        ]}
        onBeforeNavigate={onBeforeNavigate}
      />,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('navigation guard supports async checks with Promise', async () => {
    const onBeforeNavigate = vi.fn().mockResolvedValue(true);
    const onClick = vi.fn();

    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#home', onClick },
          { label: 'Current' },
        ]}
        onBeforeNavigate={onBeforeNavigate}
      />,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    // Wait for async guard to complete
    await vi.waitFor(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  test('navigation guard prevents async navigation when Promise resolves to false', async () => {
    const onBeforeNavigate = vi.fn().mockResolvedValue(false);
    const onClick = vi.fn();

    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#home', onClick },
          { label: 'Current' },
        ]}
        onBeforeNavigate={onBeforeNavigate}
      />,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    // Wait to ensure onClick is never called
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('navigation guard is not called for last/current item', async () => {
    const onBeforeNavigate = vi.fn();

    render(
      <DialBreadcrumb
        pathItems={[{ label: 'Home', href: '#home' }, { label: 'Current' }]}
        onBeforeNavigate={onBeforeNavigate}
      />,
    );

    const currentText = screen.getByText('Current');
    await fireEvent.click(currentText);

    expect(onBeforeNavigate).not.toHaveBeenCalled();
  });

  test('navigation guard works with composition API children', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(false);
    const onClick = vi.fn();

    render(
      <DialBreadcrumb onBeforeNavigate={onBeforeNavigate}>
        <DialBreadcrumbItem label="Home" href="#" onClick={onClick} />
        <DialBreadcrumbItem label="Current" />
      </DialBreadcrumb>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('navigation guard works with collapsed dropdown items', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(false);

    // Create 5+ items to trigger collapsed view with dropdown
    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Home', href: '#home' },
          { label: 'Level 2', href: '#level2' },
          { label: 'Level 3', href: '#level3' },
          { label: 'Level 4', href: '#level4' },
          { label: 'Current' },
        ]}
        onBeforeNavigate={onBeforeNavigate}
      />,
    );

    // Find and click the ellipsis button to open dropdown
    const ellipsisButton = screen.getByRole('button', {
      name: /more breadcrumbs/i,
    });
    await fireEvent.click(ellipsisButton);

    // The dropdown items should appear - find one and try to click
    const dropdownItem = screen.getByText('Level 2');
    await fireEvent.click(dropdownItem);

    expect(onBeforeNavigate).toHaveBeenCalled();
  });

  test('root and current items can both shrink/truncate, current item is capped at 40%', () => {
    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'Organization', href: '#org' },
          { label: 'Some very long current sub-folder name' },
        ]}
      />,
    );

    const rootLink = screen.getByRole('link', { name: 'Organization' });
    const rootLi = rootLink.closest('li') as HTMLElement;
    expect(rootLi.className).toMatch(/shrink/);
    expect(rootLi.className).toMatch(/min-w-0/);
    expect(rootLi.className).not.toMatch(/max-w-\[30%\]/);

    const currentText = screen.getByText('Some very long current sub-folder name');
    const currentLi = currentText.closest('li') as HTMLElement;
    expect(currentLi.className).toMatch(/shrink/);
    expect(currentLi.className).toMatch(/max-w-\[40%\]/);
  });

  test('deep path with long consecutive folder names: penultimate and last folder are both rendered and can shrink to fit', () => {
    const penultimate =
      'Project_Regression_Testing_Artifacts_For_Shared_File_Manager_Workflows_Part_One';
    const last =
      'Project_Regression_Testing_Artifacts_For_Shared_File_Manager_Workflows_Part_Two';

    render(
      <DialBreadcrumb
        pathItems={[
          { label: 'My Files', href: '#root' },
          { label: 'A folder', href: '#a' },
          { label: 'Nested folder', href: '#b' },
          { label: penultimate, href: '#c' },
          { label: last },
        ]}
      />,
    );

    const penultimateLi = screen.getByText(penultimate).closest('li') as HTMLElement;
    const lastLi = screen.getByText(last).closest('li') as HTMLElement;

    // Both segments must stay in the DOM (visible), not be pushed out by shrink-0 siblings.
    expect(penultimateLi).toBeInTheDocument();
    expect(lastLi).toBeInTheDocument();

    // Neither is shrink-0 anymore - both must be able to shrink to fit the available width.
    expect(penultimateLi.className).not.toMatch(/shrink-0/);
    expect(lastLi.className).not.toMatch(/shrink-0/);
    expect(penultimateLi.className).toMatch(/min-w-0/);
    expect(lastLi.className).toMatch(/min-w-0/);
  });
});
