import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Accordion } from './Accordion';

describe('Dial UI Kit :: Accordion', () => {
  test('renders title and description in the header', () => {
    render(
      <Accordion title="Settings" description="Optional configuration">
        <p>Content</p>
      </Accordion>,
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Optional configuration')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAccessibleName(
      'Settings Optional configuration',
    );
  });

  test('is collapsed by default and expands on header click', () => {
    render(
      <Accordion title="Settings">
        <p>Content</p>
      </Accordion>,
    );

    const header = screen.getByRole('button', { name: 'Settings' });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content')).toBeNull();

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('respects defaultExpanded', () => {
    render(
      <Accordion title="Settings" defaultExpanded>
        <p>Content</p>
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('collapses again on a second click', () => {
    render(
      <Accordion title="Settings" defaultExpanded>
        <p>Content</p>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.queryByText('Content')).toBeNull();
  });

  test('calls onToggle with the next state', () => {
    const onToggle = vi.fn();
    render(
      <Accordion title="Settings" onToggle={onToggle}>
        <p>Content</p>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  test('controlled: does not change internally, reflects expanded prop', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <Accordion title="Settings" expanded={false} onToggle={onToggle}>
        <p>Content</p>
      </Accordion>,
    );

    const header = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(header);

    // stays collapsed because it is controlled
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content')).toBeNull();

    rerender(
      <Accordion title="Settings" expanded onToggle={onToggle}>
        <p>Content</p>
      </Accordion>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('does not toggle when disabled', () => {
    const onToggle = vi.fn();
    render(
      <Accordion title="Settings" disabled onToggle={onToggle}>
        <p>Content</p>
      </Accordion>,
    );

    const header = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(header);

    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Content')).toBeNull();
    expect(header).toBeDisabled();
  });

  test('links the header to the content region, and names the region by it', () => {
    render(
      <Accordion title="Settings" defaultExpanded>
        <p>Content</p>
      </Accordion>,
    );

    const header = screen.getByRole('button', { name: 'Settings' });
    const region = screen.getByRole('region', { name: 'Settings' });
    expect(header.getAttribute('aria-controls')).toBe(region.id);
  });

  test('drops aria-controls while the panel is unmounted', () => {
    render(
      <Accordion title="Settings">
        <p>Content</p>
      </Accordion>,
    );

    expect(
      screen.getByRole('button', { name: 'Settings' }),
    ).not.toHaveAttribute('aria-controls');
  });

  test('nonCollapsible renders a static header and keeps the content visible', () => {
    render(
      <Accordion title="Always open" nonCollapsible>
        <p>Content</p>
      </Accordion>,
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('region', { name: 'Always open' })).toBeVisible();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('ariaLabel names a header whose title carries no text', () => {
    render(
      <Accordion title={<span aria-hidden="true">⚙</span>} ariaLabel="Settings">
        <p>Content</p>
      </Accordion>,
    );

    expect(
      screen.getByRole('button', { name: 'Settings' }),
    ).toBeInTheDocument();
  });
});
