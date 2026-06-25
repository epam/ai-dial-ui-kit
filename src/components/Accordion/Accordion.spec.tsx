import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialAccordion } from './Accordion';

describe('Dial UI Kit :: DialAccordion', () => {
  test('renders title and description in the header', () => {
    render(
      <DialAccordion title="Settings" description="Optional configuration">
        <p>Content</p>
      </DialAccordion>,
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Optional configuration')).toBeInTheDocument();
  });

  test('is collapsed by default and expands on header click', () => {
    render(
      <DialAccordion title="Settings">
        <p>Content</p>
      </DialAccordion>,
    );

    const header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content')).toBeNull();

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('respects defaultExpanded', () => {
    render(
      <DialAccordion title="Settings" defaultExpanded>
        <p>Content</p>
      </DialAccordion>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('collapses again on a second click', () => {
    render(
      <DialAccordion title="Settings" defaultExpanded>
        <p>Content</p>
      </DialAccordion>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Content')).toBeNull();
  });

  test('calls onToggle with the next state', () => {
    const onToggle = vi.fn();
    render(
      <DialAccordion title="Settings" onToggle={onToggle}>
        <p>Content</p>
      </DialAccordion>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  test('controlled: does not change internally, reflects expanded prop', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <DialAccordion title="Settings" expanded={false} onToggle={onToggle}>
        <p>Content</p>
      </DialAccordion>,
    );

    const header = screen.getByRole('button');
    fireEvent.click(header);

    // stays collapsed because it is controlled
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content')).toBeNull();

    rerender(
      <DialAccordion title="Settings" expanded onToggle={onToggle}>
        <p>Content</p>
      </DialAccordion>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('does not toggle when disabled', () => {
    const onToggle = vi.fn();
    render(
      <DialAccordion title="Settings" disabled onToggle={onToggle}>
        <p>Content</p>
      </DialAccordion>,
    );

    const header = screen.getByRole('button');
    fireEvent.click(header);

    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Content')).toBeNull();
    expect(header).toBeDisabled();
  });

  test('links the header to the content region via aria-controls', () => {
    render(
      <DialAccordion title="Settings" defaultExpanded>
        <p>Content</p>
      </DialAccordion>,
    );

    const header = screen.getByRole('button');
    const region = screen.getByRole('region');
    expect(header.getAttribute('aria-controls')).toBe(region.id);
  });
});
