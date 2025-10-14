import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialBreadcrumb } from './Breadcrumb';
import { DialBreadcrumbItem } from './BreadcrumbItem';

describe('Dial UI Kit :: DialBreadcrumb (final)', () => {
  test('renders <nav> with default aria-label and horizontal scroll container', () => {
    render(
      <DialBreadcrumb
        items={[
          { title: 'Home', href: '/' },
          { title: 'Section', href: '/section' },
          { title: 'Current' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    expect(nav.className).toContain('overflow-x-auto');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('items prop: interactive items are links; last is current with primary text', () => {
    render(
      <DialBreadcrumb
        items={[
          { title: 'Home', href: '#home' },
          { title: 'Library', href: '#lib' },
          { title: 'Data' },
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
        items={[
          { title: 'Home', href: '#', onClick, disabled: true },
          { title: 'Current' },
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
        <DialBreadcrumbItem title="Home" href="#" />
        <DialBreadcrumbItem title="Section" href="#" />
        <DialBreadcrumbItem title="Current" />
      </DialBreadcrumb>,
    );
    const currentText = screen.getByText('Current');
    const currentLi = currentText.closest('li') as HTMLElement;
    const currentWrapper = currentLi.querySelector(
      '[aria-current="page"]',
    ) as HTMLElement;
    expect(currentWrapper).toBeTruthy();
  });

  test('custom separator string is rendered between items', () => {
    render(
      <DialBreadcrumb
        separator="/"
        items={[
          { title: 'A', href: '#' },
          { title: 'B', href: '#' },
          { title: 'C' },
        ]}
      />,
    );
    const separators = screen.getAllByText('/');
    expect(separators.length).toBe(2);
  });

  test('titleCssClass applies to interactive element when using items prop', () => {
    render(
      <DialBreadcrumb
        titleCssClass="underline"
        items={[{ title: 'Home', href: '#u' }, { title: 'Current' }]}
      />,
    );
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink.className).toContain('underline');
  });

  test('iconBefore is rendered when provided', () => {
    render(
      <DialBreadcrumb
        items={[
          {
            title: 'Folder',
            href: '#',
            iconBefore: <span aria-label="icon">📁</span>,
          },
          { title: 'Current', iconBefore: <span aria-label="icon">📁</span> },
        ]}
      />,
    );
    const icons = screen.getAllByLabelText('icon');
    expect(icons.length).toBe(2);
  });
});
