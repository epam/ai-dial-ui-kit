import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Dropdown } from '@/components/New/Dropdown/Dropdown';
import { ThemeScope, useThemeScope } from './ThemeScope';

const ScopeProbe = () => <span data-testid="probe">{useThemeScope()}</span>;

describe('Dial UI Kit :: ThemeScope', () => {
  test('generates no box, so it does not disturb the surrounding layout', () => {
    const { container } = render(
      <ThemeScope className="panel-theme">
        <span>content</span>
      </ThemeScope>,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('contents');
    expect(wrapper).toHaveClass('panel-theme');
  });

  test('reports no scope outside any ThemeScope', () => {
    render(<ScopeProbe />);

    expect(screen.getByTestId('probe')).toBeEmptyDOMElement();
  });

  test('nests outer scopes before inner ones, matching the cascade', () => {
    render(
      <ThemeScope className="outer-theme">
        <ThemeScope className="inner-theme">
          <ScopeProbe />
        </ThemeScope>
      </ThemeScope>,
    );

    expect(screen.getByTestId('probe')).toHaveTextContent(
      'outer-theme inner-theme',
    );
  });

  test('carries the scope onto an overlay the subtree opens in a portal', () => {
    render(
      <ThemeScope className="panel-theme">
        <Dropdown
          defaultOpen
          items={[{ key: 'rename', label: 'Rename' }]}
          listClassName="dropdown-list"
        >
          <button type="button">Actions</button>
        </Dropdown>
      </ThemeScope>,
    );

    // The overlay is portalled to the end of <body>, outside the scope's
    // subtree, so the class is the only thing carrying the tokens to it.
    const list = document.querySelector('.dropdown-list');
    expect(list).not.toBeNull();
    expect(list).toHaveClass('panel-theme');
    expect(list?.closest('.contents')).toBeNull();
  });

  test('leaves overlays opened outside a scope unclassed', () => {
    render(
      <Dropdown
        defaultOpen
        items={[{ key: 'rename', label: 'Rename' }]}
        listClassName="dropdown-list"
      >
        <button type="button">Actions</button>
      </Dropdown>,
    );

    expect(document.querySelector('.dropdown-list')).not.toHaveClass(
      'panel-theme',
    );
  });
});
