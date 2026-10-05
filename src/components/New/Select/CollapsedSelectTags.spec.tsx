import { render, screen } from '@testing-library/react';
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
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(100);
};

const renderTags = () =>
  render(
    <CollapsedSelectTags
      options={options}
      selectedValues={['a', 'b', 'c']}
      handleRemoveTag={vi.fn()}
    />,
  );

describe('CollapsedSelectTags', () => {
  afterEach(() => vi.restoreAllMocks());

  test('shows every tag and no counter when the row has no layout yet', () => {
    renderTags();

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(3);
    expect(screen.queryByLabelText(/more selected/)).not.toBeInTheDocument();
  });

  test('shows every tag when they all fit the row', () => {
    stubLayout(400);
    renderTags();

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(3);
    expect(screen.queryByLabelText(/more selected/)).not.toBeInTheDocument();
  });

  test('folds the tags that do not fit into a +N counter', () => {
    stubLayout(300);
    renderTags();

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(1);
    expect(screen.getByLabelText('2 more selected')).toHaveTextContent('+2');
  });
});
