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
});
