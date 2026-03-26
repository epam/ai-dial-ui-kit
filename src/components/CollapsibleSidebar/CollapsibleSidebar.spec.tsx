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
    expect(root).toHaveStyle({ width: '48px' });
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

    expect(root).toHaveStyle({ width: '48px' });
    expect(screen.getByText('RightIcon')).toBeInTheDocument();
  });

  test('Controlled: clicking toggle calls onToggle and does not change own state', () => {
    const onToggle = vi.fn();
    render(
      <DialCollapsibleSidebar
        width={220}
        title="Ctl"
        isOpened={false}
        onToggle={onToggle}
      >
        <div>Hidden</div>
      </DialCollapsibleSidebar>,
    );

    expect(screen.getByText('RightIcon')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true, expect.any(Object));

    expect(screen.getByText('RightIcon')).toBeInTheDocument();
  });

  test('Resizable: shows resize handle when resizable is true and opened', () => {
    render(
      <DialCollapsibleSidebar width={300} title="Resize" resizable>
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('Resizable: hides resize handle when collapsed', () => {
    render(
      <DialCollapsibleSidebar width={300} title="Resize" resizable>
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  test('Resizable: does not show resize handle when resizable is false', () => {
    render(
      <DialCollapsibleSidebar width={300} title="No Resize">
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  test('Resizable: dragging changes width', () => {
    const { container } = render(
      <DialCollapsibleSidebar
        width={300}
        title="Drag"
        resizable
        minWidth={100}
        maxWidth={500}
      >
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    const handle = screen.getByRole('separator');

    fireEvent.mouseDown(handle, { clientX: 300 });
    fireEvent.mouseMove(document, { clientX: 350 });
    fireEvent.mouseUp(document);

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ width: '350px' });
  });

  test('Resizable: clamps width to minWidth', () => {
    const { container } = render(
      <DialCollapsibleSidebar
        width={300}
        title="Clamp"
        resizable
        minWidth={200}
        maxWidth={500}
      >
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    const handle = screen.getByRole('separator');

    fireEvent.mouseDown(handle, { clientX: 300 });
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document);

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ width: '200px' });
  });

  test('Resizable: clamps width to maxWidth', () => {
    const { container } = render(
      <DialCollapsibleSidebar
        width={300}
        title="Clamp"
        resizable
        minWidth={100}
        maxWidth={400}
      >
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    const handle = screen.getByRole('separator');

    fireEvent.mouseDown(handle, { clientX: 300 });
    fireEvent.mouseMove(document, { clientX: 800 });
    fireEvent.mouseUp(document);

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ width: '400px' });
  });

  test('Resizable: restores resized width after collapse and expand', () => {
    const { container } = render(
      <DialCollapsibleSidebar
        width={300}
        title="Restore"
        resizable
        minWidth={100}
        maxWidth={500}
      >
        <div>Content</div>
      </DialCollapsibleSidebar>,
    );

    const handle = screen.getByRole('separator');
    const root = container.firstElementChild as HTMLElement;

    // Drag to resize to 400px
    fireEvent.mouseDown(handle, { clientX: 300 });
    fireEvent.mouseMove(document, { clientX: 400 });
    fireEvent.mouseUp(document);
    expect(root).toHaveStyle({ width: '400px' });

    // Collapse
    fireEvent.click(screen.getByRole('button'));
    expect(root).toHaveStyle({ width: '48px' });

    // Expand — should restore 400px, not the original 300px
    fireEvent.click(screen.getByRole('button'));
    expect(root).toHaveStyle({ width: '400px' });
  });
});
