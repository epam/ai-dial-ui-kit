import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { CollapsibleSidebar } from './CollapsibleSidebar';

const getSidebar = (name = 'Sidebar') =>
  screen.getByRole('complementary', { name });

describe('Dial UI Kit :: CollapsibleSidebar', () => {
  test('renders children in a region named by ariaLabel', () => {
    render(
      <CollapsibleSidebar title="Filters" ariaLabel="Filters sidebar">
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    expect(getSidebar('Filters sidebar')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeVisible();
  });

  test('is expanded by default and the toggle names the collapse action', () => {
    render(
      <CollapsibleSidebar title="Filters">
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(getSidebar()).toHaveStyle({ width: '280px' });
    // The vertical title belongs to the collapsed rail only.
    expect(screen.getByText('Filters')).not.toBeVisible();
  });

  test('the toggle points at the content region it operates', () => {
    render(
      <CollapsibleSidebar title="Filters">
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    const contentId = screen
      .getByRole('button', { name: 'Collapse sidebar' })
      .getAttribute('aria-controls');

    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId as string)).toContainElement(
      screen.getByText('Child content'),
    );
  });

  test('collapses to the rail width and reveals the title on toggle', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSidebar title="Filters" width={320}>
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    const toggle = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(getSidebar()).toHaveStyle({ width: '48px' });
    expect(screen.getByText('Filters')).toBeVisible();
    // Kept mounted so the content does not lose its state, but hidden from view.
    expect(screen.getByText('Child content')).not.toBeVisible();
  });

  test('expands again on a second toggle', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSidebar title="Filters">
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(screen.getByText('Child content')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Collapse sidebar' }),
    ).toBeInTheDocument();
  });

  test('starts collapsed when defaultOpened is false', () => {
    render(
      <CollapsibleSidebar title="Filters" defaultOpened={false}>
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    expect(getSidebar()).toHaveStyle({ width: '48px' });
    expect(
      screen.getByRole('button', { name: 'Expand sidebar' }),
    ).toBeInTheDocument();
  });

  test('honours a custom collapsedWidth', () => {
    render(
      <CollapsibleSidebar
        title="Filters"
        collapsedWidth={64}
        defaultOpened={false}
      >
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    expect(getSidebar()).toHaveStyle({ width: '64px' });
  });

  test('controlled: follows isOpened and keeps up with a changing width', () => {
    const { rerender } = render(
      <CollapsibleSidebar title="Filters" width={240} isOpened={false}>
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    expect(getSidebar()).toHaveStyle({ width: '48px' });

    rerender(
      <CollapsibleSidebar title="Filters" width={240} isOpened>
        <div>Child content</div>
      </CollapsibleSidebar>,
    );
    expect(getSidebar()).toHaveStyle({ width: '240px' });

    rerender(
      <CollapsibleSidebar title="Filters" width={360} isOpened>
        <div>Child content</div>
      </CollapsibleSidebar>,
    );
    expect(getSidebar()).toHaveStyle({ width: '360px' });
  });

  test('controlled: reports the next state without changing its own', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <CollapsibleSidebar
        title="Filters"
        isOpened={false}
        onToggle={onToggle}
        width={220}
      >
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true, expect.any(Object));
    expect(getSidebar()).toHaveStyle({ width: '48px' });
  });

  test('uncontrolled: reports the next state as well', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <CollapsibleSidebar title="Filters" onToggle={onToggle}>
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(onToggle).toHaveBeenCalledWith(false, expect.any(Object));
  });

  test('renders additional buttons only while expanded', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSidebar
        title="Filters"
        additionalButtons={<button type="button">Extra</button>}
      >
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    expect(screen.getByRole('button', { name: 'Extra' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(
      screen.queryByRole('button', { name: 'Extra' }),
    ).not.toBeInTheDocument();
  });

  test('uses custom toggle labels', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSidebar
        title="Filters"
        collapseLabel="Свернуть панель"
        expandLabel="Развернуть панель"
      >
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    await user.click(screen.getByRole('button', { name: 'Свернуть панель' }));

    expect(
      screen.getByRole('button', { name: 'Развернуть панель' }),
    ).toBeInTheDocument();
  });

  test('shows the toggle label as a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSidebar title="Filters">
        <div>Child content</div>
      </CollapsibleSidebar>,
    );

    await user.hover(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Collapse sidebar',
    );
  });

  test('gives every sidebar its own content id', () => {
    render(
      <>
        <CollapsibleSidebar title="First" ariaLabel="First">
          <div>First content</div>
        </CollapsibleSidebar>
        <CollapsibleSidebar title="Second" ariaLabel="Second">
          <div>Second content</div>
        </CollapsibleSidebar>
      </>,
    );

    const [first, second] = screen
      .getAllByRole('button', { name: 'Collapse sidebar' })
      .map((toggle) => toggle.getAttribute('aria-controls'));

    expect(first).not.toEqual(second);
  });
});
