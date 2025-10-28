import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialCollapsibleSidebar } from './CollapsibleSidebar';

vi.mock('@tabler/icons-react', () => ({
  IconChevronsLeft: () => <span>LeftIcon</span>,
  IconChevronsRight: () => <span>RightIcon</span>,
}));

describe('Dial UI Kit :: DialCollapsibleSidebar', () => {
  test('Should render with children and title', () => {
    render(
      <DialCollapsibleSidebar width={200} title="My Title">
        <div>ChildContent</div>
      </DialCollapsibleSidebar>,
    );
    expect(screen.getByText('ChildContent')).toBeInTheDocument();
  });

  test('Should collapse and show title when button is clicked', () => {
    render(
      <DialCollapsibleSidebar width={200} title="My Title">
        <div>ChildContent</div>
      </DialCollapsibleSidebar>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('RightIcon')).toBeInTheDocument();
  });

  test('Should expand again when button is clicked twice', () => {
    render(
      <DialCollapsibleSidebar width={200} title="My Title">
        <div>ChildContent</div>
      </DialCollapsibleSidebar>,
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('ChildContent')).toBeVisible();
    expect(screen.getByText('LeftIcon')).toBeInTheDocument();
  });

  test('Controlled: responds to prop changes (closed -> open -> closed)', () => {
    const { container, rerender } = render(
      <DialCollapsibleSidebar width={240} title="Ctl" isOpened={false}>
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ width: '60px' });
    expect(screen.getByText('RightIcon')).toBeInTheDocument();

    rerender(
      <DialCollapsibleSidebar width={240} title="Ctl" isOpened={true}>
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    expect(root).toHaveStyle({ width: '240px' });
    expect(screen.getByText('LeftIcon')).toBeInTheDocument();

    rerender(
      <DialCollapsibleSidebar width={240} title="Ctl" isOpened={false}>
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    expect(root).toHaveStyle({ width: '60px' });
    expect(screen.getByText('RightIcon')).toBeInTheDocument();
  });
});
