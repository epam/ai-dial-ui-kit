import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { EllipsisTooltip } from './EllipsisTooltip';

/**
 * jsdom performs no layout, so every box measures 0 and nothing ever reads as
 * truncated. These stub the three reads `useTruncation` makes.
 */
const setWidths = (
  element: HTMLElement,
  clientWidth: number,
  scrollWidth: number,
) => {
  Object.defineProperty(element, 'clientWidth', {
    configurable: true,
    value: clientWidth,
  });
  Object.defineProperty(element, 'scrollWidth', {
    configurable: true,
    value: scrollWidth,
  });
  Object.defineProperty(element, 'getBoundingClientRect', {
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

const LONG_TEXT =
  'This is a long message that should be truncated in a narrow container and shown in full in the tooltip.';

const renderTruncated = async (element: React.ReactElement, text: string) => {
  render(element);

  const trigger = screen.getByText(text, { selector: 'span' });

  setWidths(trigger, 100, 300);
  window.dispatchEvent(new Event('resize'));
  await userEvent.hover(trigger);

  return trigger;
};

describe('Dial UI Kit :: EllipsisTooltip', () => {
  test('Should render the given text', () => {
    render(<EllipsisTooltip text="Hello ellipsis" initialOpen />);

    expect(screen.getByText('Hello ellipsis')).toBeInTheDocument();
  });

  test('Should show no tooltip while the text fits', async () => {
    render(<EllipsisTooltip text="Short" initialOpen />);

    const trigger = screen.getByText('Short', { selector: 'span' });

    setWidths(trigger, 200, 200);
    window.dispatchEvent(new Event('resize'));
    await userEvent.hover(trigger);

    await waitFor(() => expect(trigger).not.toHaveAttribute('aria-label'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('Should show the full text in a tooltip while truncated', async () => {
    const trigger = await renderTruncated(
      <EllipsisTooltip text={LONG_TEXT} initialOpen />,
      LONG_TEXT,
    );

    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveTextContent(LONG_TEXT),
    );
    expect(trigger).toHaveAttribute('aria-label', LONG_TEXT);
  });

  test('Should name the truncated text even when the tooltip is hidden', async () => {
    const trigger = await renderTruncated(
      <EllipsisTooltip text={LONG_TEXT} hideTooltip initialOpen />,
      LONG_TEXT,
    );

    // The tooltip is suppressed, but the text is still clipped on screen, so
    // the full string has to stay reachable by name.
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-label', LONG_TEXT),
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('Should show customTooltipContent instead of the text while truncated', async () => {
    await renderTruncated(
      <EllipsisTooltip
        text={LONG_TEXT}
        customTooltipContent="Custom content"
        initialOpen
      />,
      LONG_TEXT,
    );

    const tooltip = await waitFor(() => screen.getByRole('tooltip'));
    expect(tooltip).toHaveTextContent('Custom content');
    expect(tooltip).not.toHaveTextContent(LONG_TEXT);
  });

  test('Should not show customTooltipContent while the text fits', async () => {
    render(
      <EllipsisTooltip
        text="Short"
        customTooltipContent="Custom content"
        initialOpen
      />,
    );

    const trigger = screen.getByText('Short', { selector: 'span' });

    setWidths(trigger, 200, 200);
    window.dispatchEvent(new Event('resize'));
    await userEvent.hover(trigger);

    await waitFor(() => expect(trigger).not.toHaveAttribute('aria-label'));
    expect(screen.queryByText('Custom content')).not.toBeInTheDocument();
  });

  test('Should read the full string out of a node', async () => {
    render(
      <EllipsisTooltip
        text={<span className="dial-small-semi-text">{LONG_TEXT}</span>}
        initialOpen
      />,
    );

    // The node is rendered inside the element that truncates, so it is the
    // parent that gets measured.
    const trigger = screen.getByText(LONG_TEXT).parentElement!;

    setWidths(trigger, 100, 300);
    window.dispatchEvent(new Event('resize'));
    await userEvent.hover(trigger);

    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveTextContent(LONG_TEXT),
    );
    expect(trigger).toHaveAttribute('aria-label', LONG_TEXT);
  });

  test('Should apply the text and tooltip class names', async () => {
    const trigger = await renderTruncated(
      <EllipsisTooltip
        text={LONG_TEXT}
        className="w-96 px-4 text-secondary"
        contentClassName="custom-content"
        initialOpen
      />,
      LONG_TEXT,
    );

    expect(trigger).toHaveClass('w-96', 'px-4', 'text-secondary', 'truncate');
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveClass(
        'custom-content',
        'bg-control-inverted',
      ),
    );
  });
});
