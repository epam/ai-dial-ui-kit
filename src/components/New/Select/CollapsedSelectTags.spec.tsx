import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import type { SelectOption } from '@/models/select';
import { CollapsedSelectTags } from './CollapsedSelectTags';

const options: SelectOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

/** jsdom does no layout, so give every tag 100px and the row `rowWidth`. */
const stubLayout = (rowWidth: number) => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
    rowWidth,
  );
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
};

const renderTags = (handleRemoveTag = vi.fn(), onClick = vi.fn()) =>
  render(
    <div onClick={onClick}>
      <CollapsedSelectTags
        options={options}
        selectedValues={['a', 'b', 'c']}
        handleRemoveTag={handleRemoveTag}
      />
    </div>,
  );

describe('CollapsedSelectTags', () => {
  afterEach(() => vi.restoreAllMocks());

  test('shows every tag and no counter when the row has no layout yet', () => {
    renderTags();

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(3);
    expect(
      screen.queryByRole('button', { name: /more selected/ }),
    ).not.toBeInTheDocument();
  });

  test('shows every tag when they all fit the row', () => {
    stubLayout(400);
    renderTags();

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(3);
    expect(
      screen.queryByRole('button', { name: /more selected/ }),
    ).not.toBeInTheDocument();
  });

  test('folds the tags that do not fit into a +N counter', () => {
    stubLayout(300);
    renderTags();

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: '2 more selected: Beta, Gamma' }),
    ).toHaveTextContent('+2');
  });

  describe('hidden tags panel', () => {
    // jsdom has no layout, so the pointer "leaves" the trigger the moment it
    // moves toward the panel; clicks inside the panel are fired directly.
    const openPanel = async () => {
      const user = userEvent.setup();
      await user.hover(screen.getByRole('button', { name: /more selected/ }));
      return user;
    };

    test('lists the hidden tags on hover, each removable', async () => {
      stubLayout(300);
      const handleRemoveTag = vi.fn();
      renderTags(handleRemoveTag);

      await openPanel();
      const remove = await screen.findByRole('button', {
        name: 'Remove Beta',
      });
      expect(
        screen.getByRole('button', { name: 'Remove Gamma' }),
      ).toBeInTheDocument();

      fireEvent.click(remove);

      expect(handleRemoveTag).toHaveBeenCalledWith(expect.anything(), 'b');
    });

    test('keeps clicks in the panel from reaching the field around it', async () => {
      stubLayout(300);
      const onFieldClick = vi.fn();
      renderTags(vi.fn(), onFieldClick);

      await openPanel();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Remove Gamma' }),
      );

      expect(onFieldClick).not.toHaveBeenCalled();
    });

    test('closes on Escape', async () => {
      stubLayout(300);
      renderTags();

      const user = await openPanel();
      await screen.findByRole('button', { name: 'Remove Beta' });

      await user.keyboard('{Escape}');

      expect(
        screen.queryByRole('button', { name: 'Remove Beta' }),
      ).not.toBeInTheDocument();
    });
  });
});
