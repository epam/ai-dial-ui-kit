import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { TransferQueueItemStatus } from '@/types/transfer-queue';
import {
  TransferQueue,
  type TransferQueueItem,
  type TransferQueueProps,
} from './TransferQueue';

const makeItem = (
  overrides: Partial<TransferQueueItem> = {},
): TransferQueueItem => ({
  id: 'item-1',
  name: 'report.pdf',
  status: TransferQueueItemStatus.InProgress,
  ...overrides,
});

const renderQueue = (props: Partial<TransferQueueProps> = {}) =>
  render(
    <TransferQueue
      title="Importing 1 file"
      items={[makeItem()]}
      onClose={vi.fn()}
      onCancelItem={vi.fn()}
      {...props}
    />,
  );

const clickClose = () =>
  userEvent.click(screen.getByRole('button', { name: 'Close' }));

describe('Dial UI Kit :: TransferQueue', () => {
  test('renders nothing with no items', () => {
    const { container } = renderQueue({ items: [] });

    expect(container).toBeEmptyDOMElement();
  });

  test('renders the host-composed title verbatim', () => {
    renderQueue({ title: 'Importing 5 files' });

    expect(screen.getByText('Importing 5 files')).toBeInTheDocument();
  });

  test('is a polite live region', () => {
    renderQueue();

    expect(screen.getAllByRole('status')[0]).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  describe('rows', () => {
    test('show the file name', () => {
      renderQueue({ items: [makeItem({ name: 'data.csv' })] });

      expect(screen.getByText('data.csv')).toBeInTheDocument();
    });

    test('name an in-progress spinner after the file', () => {
      renderQueue();

      expect(
        screen.getByRole('img', { name: '"report.pdf" in progress' }),
      ).toBeInTheDocument();
    });

    test('name a succeeded row', () => {
      renderQueue({
        items: [makeItem({ status: TransferQueueItemStatus.Success })],
      });

      expect(
        screen.getByRole('img', { name: 'Completed' }),
      ).toBeInTheDocument();
    });

    test('explain a failure through the icon name, reachable without hovering', () => {
      renderQueue({
        items: [
          makeItem({
            status: TransferQueueItemStatus.Failed,
            message: 'File is too large',
          }),
        ],
      });

      const icon = screen.getByRole('img', { name: 'File is too large' });
      expect(icon).toHaveAttribute('tabindex', '0');
    });

    test('fall back to the default failure and warning messages', () => {
      renderQueue({
        items: [
          makeItem({ id: 'a', status: TransferQueueItemStatus.Failed }),
          makeItem({ id: 'b', status: TransferQueueItemStatus.Warning }),
        ],
      });

      expect(screen.getByRole('img', { name: 'Failed' })).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: 'Completed with warnings' }),
      ).toBeInTheDocument();
    });

    test('keep a canceled row with its label and no spinner', () => {
      renderQueue({
        items: [makeItem({ status: TransferQueueItemStatus.Canceled })],
      });

      expect(screen.getByText('Canceled')).toBeInTheDocument();
      expect(screen.getByText('report.pdf')).toHaveClass('text-secondary');
      expect(screen.queryByRole('img', { name: /in progress/ })).toBeNull();
    });

    test('expose no control on a settled row', () => {
      renderQueue({
        items: [
          makeItem({ id: 'a', status: TransferQueueItemStatus.Success }),
          makeItem({ id: 'b', status: TransferQueueItemStatus.Failed }),
          makeItem({ id: 'c', status: TransferQueueItemStatus.Canceled }),
        ],
      });

      /* Only the header's collapse and close controls remain. */
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    test('apply label overrides', () => {
      renderQueue({
        labels: {
          itemProgressAriaLabel: (name) => `Importation de ${name}`,
        },
      });

      expect(
        screen.getByRole('img', { name: 'Importation de report.pdf' }),
      ).toBeInTheDocument();
    });
  });

  describe('cancel control', () => {
    test('is reachable by keyboard without hovering', async () => {
      const onCancelItem = vi.fn();
      renderQueue({ items: [makeItem({ id: 'job-9' })], onCancelItem });

      /* Tab order: header collapse, header close, then the row's cancel. */
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();
      expect(
        screen.getByRole('button', { name: 'Cancel "report.pdf"' }),
      ).toHaveFocus();
      await userEvent.keyboard('{Enter}');

      expect(onCancelItem).toHaveBeenCalledWith('job-9');
    });

    test('coexists with the spinner, which never takes the pointer', () => {
      renderQueue();

      expect(
        screen.getByRole('button', { name: 'Cancel "report.pdf"' }),
      ).toBeInTheDocument();
      /* The queue root is the first live region; the row's spinner is the second. */
      const [, spinner] = screen.getAllByRole('status');
      expect(spinner).toHaveClass('pointer-events-none');
    });

    test('is absent without onCancelItem', () => {
      renderQueue({ onCancelItem: undefined });

      expect(
        screen.queryByRole('button', { name: /^Cancel / }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: '"report.pdf" in progress' }),
      ).toBeInTheDocument();
    });
  });

  describe('header', () => {
    test('collapses the rows without hiding itself', async () => {
      renderQueue();

      const toggle = screen.getByRole('button', { name: 'Collapse' });
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(toggle);

      expect(screen.queryByText('report.pdf')).toBeNull();
      expect(screen.getByText('Importing 1 file')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Expand' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    test('shows the failed count only when an item failed', () => {
      const { rerender } = renderQueue();
      expect(screen.queryByText('1')).toBeNull();

      rerender(
        <TransferQueue
          title="Importing 1 file"
          items={[makeItem({ status: TransferQueueItemStatus.Failed })]}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('collapsed aggregate progress', () => {
    const collapse = () =>
      userEvent.click(screen.getByRole('button', { name: 'Collapse' }));

    test('shows the mean completion of every item', async () => {
      renderQueue({
        items: [
          makeItem({ id: 'a', status: TransferQueueItemStatus.Success }),
          makeItem({ id: 'b', percent: 40 }),
          makeItem({ id: 'c', percent: 10 }),
        ],
      });
      await collapse();

      expect(
        screen.getByRole('progressbar', { name: 'Progress' }),
      ).toHaveAttribute('aria-valuenow', '50');
    });

    test('announces settled counts rather than a percentage', async () => {
      renderQueue({
        items: [
          makeItem({ id: 'a', status: TransferQueueItemStatus.Success }),
          makeItem({ id: 'b', status: TransferQueueItemStatus.Warning }),
          makeItem({ id: 'c', percent: 20 }),
        ],
      });
      await collapse();

      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuetext',
        '2 of 3',
      );
    });

    test('renders no bar while expanded', () => {
      renderQueue({ items: [makeItem({ percent: 40 })] });

      expect(screen.queryByRole('progressbar')).toBeNull();
    });

    test('renders no bar once nothing is in progress', async () => {
      renderQueue({
        items: [
          makeItem({ id: 'a', status: TransferQueueItemStatus.Success }),
          makeItem({ id: 'b', status: TransferQueueItemStatus.Failed }),
        ],
      });
      await collapse();

      expect(screen.queryByRole('progressbar')).toBeNull();
    });
  });

  describe('closing', () => {
    test('closes at once when every item succeeded', async () => {
      const onClose = vi.fn();
      renderQueue({
        items: [makeItem({ status: TransferQueueItemStatus.Success })],
        onClose,
      });

      await clickClose();

      expect(onClose).toHaveBeenCalledOnce();
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    test('closes at once when the only unfinished work was canceled', async () => {
      const onClose = vi.fn();
      renderQueue({
        items: [
          makeItem({ id: 'a', status: TransferQueueItemStatus.Success }),
          makeItem({ id: 'b', status: TransferQueueItemStatus.Canceled }),
        ],
        onClose,
      });

      await clickClose();

      expect(onClose).toHaveBeenCalledOnce();
    });

    test.each([
      ['in progress', [makeItem()], 'Some items are still in progress.'],
      [
        'failed',
        [makeItem({ status: TransferQueueItemStatus.Failed })],
        'Some items have failed.',
      ],
      [
        'both',
        [
          makeItem({ id: 'a' }),
          makeItem({ id: 'b', status: TransferQueueItemStatus.Failed }),
        ],
        'Some items are still in progress, and some have failed.',
      ],
    ])(
      'asks for confirmation with work %s',
      async (_case, items, description) => {
        const onClose = vi.fn();
        renderQueue({ items, onClose });

        await clickClose();

        expect(screen.getByRole('dialog')).toHaveTextContent(description);
        expect(onClose).not.toHaveBeenCalled();
      },
    );

    test('closes once the confirmation is accepted', async () => {
      const onClose = vi.fn();
      renderQueue({ onClose });

      await clickClose();
      await userEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: 'Close',
        }),
      );

      expect(onClose).toHaveBeenCalledOnce();
    });

    test('stays open when the confirmation is dismissed', async () => {
      const onClose = vi.fn();
      renderQueue({ onClose });

      await clickClose();
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByText('report.pdf')).toBeInTheDocument();
    });
  });

  describe('auto-close', () => {
    const withFakeTimers = (assertions: () => void) => {
      vi.useFakeTimers();
      try {
        assertions();
      } finally {
        vi.useRealTimers();
      }
    };

    const advance = (ms: number) =>
      act(() => {
        vi.advanceTimersByTime(ms);
      });

    test('closes 8 seconds after every item succeeds', () => {
      withFakeTimers(() => {
        const onClose = vi.fn();
        renderQueue({
          items: [makeItem({ status: TransferQueueItemStatus.Success })],
          onClose,
        });

        advance(7999);
        expect(onClose).not.toHaveBeenCalled();
        advance(1);
        expect(onClose).toHaveBeenCalledOnce();
      });
    });

    test('honours a custom delay, and 0 disables it', () => {
      withFakeTimers(() => {
        const onClose = vi.fn();
        const items = [makeItem({ status: TransferQueueItemStatus.Success })];
        const { rerender } = renderQueue({
          items,
          onClose,
          autoCloseDelay: 1000,
        });

        advance(1000);
        expect(onClose).toHaveBeenCalledOnce();

        rerender(
          <TransferQueue
            title="t"
            items={items}
            onClose={onClose}
            autoCloseDelay={0}
          />,
        );
        advance(60_000);
        expect(onClose).toHaveBeenCalledOnce();
      });
    });

    test.each([
      ['in progress', TransferQueueItemStatus.InProgress],
      ['failed', TransferQueueItemStatus.Failed],
      ['warned', TransferQueueItemStatus.Warning],
      ['canceled', TransferQueueItemStatus.Canceled],
    ])('stays open while an item is %s', (_case, status) => {
      withFakeTimers(() => {
        const onClose = vi.fn();
        renderQueue({
          items: [
            makeItem({ id: 'a', status: TransferQueueItemStatus.Success }),
            makeItem({ id: 'b', status }),
          ],
          onClose,
        });

        advance(8000);
        expect(onClose).not.toHaveBeenCalled();
      });
    });

    test('restarts the countdown when a new item starts', () => {
      withFakeTimers(() => {
        const onClose = vi.fn();
        const done = makeItem({
          id: 'a',
          status: TransferQueueItemStatus.Success,
        });
        const { rerender } = renderQueue({ items: [done], onClose });

        advance(4000);
        rerender(
          <TransferQueue
            title="Importing 2 files"
            items={[done, makeItem({ id: 'b' })]}
            onClose={onClose}
          />,
        );
        advance(8000);

        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  test('merges className and bodyClassName', () => {
    renderQueue({ className: 'custom-root', bodyClassName: 'custom-body' });

    const root = screen.getAllByRole('status')[0];
    expect(root).toHaveClass('custom-root');
    expect(root.querySelector('.custom-body')).not.toBeNull();
  });
});
