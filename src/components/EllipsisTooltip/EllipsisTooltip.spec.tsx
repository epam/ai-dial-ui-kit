import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DialEllipsisTooltip } from './EllipsisTooltip';

const setWidths = (
  el: HTMLElement,
  clientWidth: number,
  scrollWidth: number,
) => {
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    value: clientWidth,
  });
  Object.defineProperty(el, 'scrollWidth', {
    configurable: true,
    value: scrollWidth,
  });
  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      width: clientWidth,
      height: 16,
      top: 0,
      left: 0,
      bottom: 16,
      right: clientWidth,
      x: 0,
      y: 0,
      toJSON: () => null,
    }),
  });
};

describe('Dial UI Kit :: DialEllipsisTooltip', () => {
  test('renders provided text', () => {
    render(<DialEllipsisTooltip text="Hello ellipsis" initialOpen />);
    expect(screen.getByText('Hello ellipsis')).toBeInTheDocument();
  });

  test('no tooltip content (hidden) when not truncated', async () => {
    render(<DialEllipsisTooltip text="Short" initialOpen />);
    const triggerSpan = screen.getByText('Short', { selector: 'span' });
    const tooltip = screen.getByRole('tooltip');

    setWidths(triggerSpan as HTMLElement, 200, 200);
    window.dispatchEvent(new Event('resize'));
    await userEvent.hover(triggerSpan);

    await waitFor(() => expect(tooltip).toHaveClass('hidden'));
    expect(tooltip).toHaveTextContent('');
    expect(triggerSpan).not.toHaveAttribute('aria-label');
  });

  test('shows tooltip content when truncated', async () => {
    const longText =
      'This is a long message that should be truncated in a narrow container and shown fully in the tooltip.';
    render(<DialEllipsisTooltip text={longText} initialOpen />);
    const triggerSpan = screen.getByText(longText, { selector: 'span' });

    setWidths(triggerSpan as HTMLElement, 100, 300);
    window.dispatchEvent(new Event('resize'));
    await userEvent.hover(triggerSpan);

    const tooltip = screen.getByRole('tooltip');
    await waitFor(() => expect(tooltip).not.toHaveClass('hidden'));
    expect(tooltip).toHaveTextContent(longText);
    await waitFor(() =>
      expect(triggerSpan).toHaveAttribute('aria-label', longText),
    );
  });

  test('respects hideTooltip even when truncated (still sets aria-label)', async () => {
    const longText = 'A very very very long line';
    render(<DialEllipsisTooltip text={longText} hideTooltip initialOpen />);
    const triggerSpan = screen.getByText(longText, { selector: 'span' });

    setWidths(triggerSpan as HTMLElement, 80, 240);
    window.dispatchEvent(new Event('resize'));
    await userEvent.hover(triggerSpan);

    const tooltip = screen.getByRole('tooltip');
    await waitFor(() => expect(tooltip).toHaveClass('hidden'));
    await waitFor(() =>
      expect(triggerSpan).toHaveAttribute('aria-label', longText),
    );
  });

  test('honors cssClass override (width and spacing)', () => {
    render(
      <DialEllipsisTooltip
        text="Styled text"
        cssClass="w-96 px-4 text-secondary"
        contentClassName="bg-surface"
        initialOpen
      />,
    );

    const triggerSpan = screen.getByText('Styled text', { selector: 'span' });
    expect(triggerSpan).toHaveClass('w-96');
    expect(triggerSpan).toHaveClass('px-4');
    expect(triggerSpan).toHaveClass('text-secondary');

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('bg-surface');
  });
});
