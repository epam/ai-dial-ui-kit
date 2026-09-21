import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { TabOrientation } from '@/types/tab';
import { Tabs, type TabsProps } from './Tabs';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'shared', label: 'Shared' },
  { id: 'published', label: 'Published' },
];

describe('Dial UI Kit :: Tabs', () => {
  test('renders every tab with its label as the accessible name', () => {
    render(<Tabs tabs={tabs} activeTabId="all" onTabChange={vi.fn()} />);

    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: 'Shared' })).toBeInTheDocument();
  });

  test('names the tab list with ariaLabel', () => {
    render(
      <Tabs
        tabs={tabs}
        activeTabId="all"
        onTabChange={vi.fn()}
        ariaLabel="Conversation views"
      />,
    );

    expect(screen.getByRole('tablist')).toHaveAccessibleName(
      'Conversation views',
    );
  });

  test('marks only the active tab as selected', () => {
    render(<Tabs tabs={tabs} activeTabId="shared" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'Shared' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  test('keeps only the active tab in the tab order', () => {
    render(<Tabs tabs={tabs} activeTabId="shared" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'Shared' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  test('calls onTabChange with the clicked tab id', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<Tabs tabs={tabs} activeTabId="all" onTabChange={onTabChange} />);

    await user.click(screen.getByRole('tab', { name: 'Published' }));

    expect(onTabChange).toHaveBeenCalledWith('published');
  });

  test('renders a count badge only for tabs that provide a count', () => {
    render(
      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: 12 },
          { id: 'shared', label: 'Shared' },
        ]}
        activeTabId="all"
        onTabChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: 'All 12' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Shared' })).toBeInTheDocument();
  });

  test('renders a zero count rather than dropping the badge', () => {
    render(
      <Tabs
        tabs={[{ id: 'all', label: 'All', count: 0 }]}
        activeTabId="all"
        onTabChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: 'All 0' })).toBeInTheDocument();
  });

  test('gives only the selected tab the gradient underline', () => {
    render(<Tabs tabs={tabs} activeTabId="shared" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'Shared' })).toHaveClass(
      'dial-kit-tab-selected-underline',
    );
    expect(screen.getByRole('tab', { name: 'All' })).not.toHaveClass(
      'dial-kit-tab-selected-underline',
    );
  });

  describe('disabled tabs', () => {
    const withDisabled = [
      { id: 'all', label: 'All' },
      { id: 'shared', label: 'Shared', disabled: true },
      { id: 'published', label: 'Published' },
    ];

    test('disables the tab and paints it with the disabled tokens', () => {
      render(
        <Tabs tabs={withDisabled} activeTabId="all" onTabChange={vi.fn()} />,
      );

      const disabled = screen.getByRole('tab', { name: 'Shared' });

      expect(disabled).toBeDisabled();
      expect(disabled).toHaveClass('text-control-disable-primary');
      expect(disabled).toHaveClass('border-control-disable-primary');
    });

    test('a disabled tab keeps the flat underline even while selected', () => {
      render(
        <Tabs tabs={withDisabled} activeTabId="shared" onTabChange={vi.fn()} />,
      );

      const disabled = screen.getByRole('tab', { name: 'Shared' });

      expect(disabled).toHaveClass('border-control-disable-primary');
      expect(disabled).not.toHaveClass('dial-kit-tab-selected-underline');
    });

    test('does not call onTabChange when a disabled tab is clicked', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(
        <Tabs
          tabs={withDisabled}
          activeTabId="all"
          onTabChange={onTabChange}
        />,
      );

      await user.click(screen.getByRole('tab', { name: 'Shared' }));

      expect(onTabChange).not.toHaveBeenCalled();
    });

    test('the arrow keys skip over a disabled tab', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(
        <Tabs
          tabs={withDisabled}
          activeTabId="all"
          onTabChange={onTabChange}
        />,
      );

      screen.getByRole('tab', { name: 'All' }).focus();
      await user.keyboard('{ArrowRight}');

      expect(onTabChange).toHaveBeenCalledWith('published');
    });

    test('End lands on the last enabled tab', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(
        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'published', label: 'Published', disabled: true },
          ]}
          activeTabId="all"
          onTabChange={onTabChange}
        />,
      );

      screen.getByRole('tab', { name: 'All' }).focus();
      await user.keyboard('{End}');

      expect(onTabChange).not.toHaveBeenCalled();
    });

    test('moves the tab stop to the first enabled tab when the active tab is disabled', () => {
      render(
        <Tabs tabs={withDisabled} activeTabId="shared" onTabChange={vi.fn()} />,
      );

      expect(screen.getByRole('tab', { name: 'Shared' })).toHaveAttribute(
        'tabindex',
        '-1',
      );
      expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
        'tabindex',
        '0',
      );
    });
  });

  describe('keyboard navigation', () => {
    test('the arrow keys move selection and focus', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(<Tabs tabs={tabs} activeTabId="all" onTabChange={onTabChange} />);

      await user.tab();
      expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');

      expect(onTabChange).toHaveBeenCalledWith('shared');
      expect(screen.getByRole('tab', { name: 'Shared' })).toHaveFocus();
    });

    test('ArrowRight wraps from the last tab to the first', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(
        <Tabs tabs={tabs} activeTabId="published" onTabChange={onTabChange} />,
      );

      screen.getByRole('tab', { name: 'Published' }).focus();
      await user.keyboard('{ArrowRight}');

      expect(onTabChange).toHaveBeenCalledWith('all');
    });

    test('ArrowLeft wraps from the first tab to the last', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(<Tabs tabs={tabs} activeTabId="all" onTabChange={onTabChange} />);

      screen.getByRole('tab', { name: 'All' }).focus();
      await user.keyboard('{ArrowLeft}');

      expect(onTabChange).toHaveBeenCalledWith('published');
    });

    test('Home and End jump to the first and last tab', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(
        <Tabs tabs={tabs} activeTabId="shared" onTabChange={onTabChange} />,
      );

      screen.getByRole('tab', { name: 'Shared' }).focus();
      await user.keyboard('{End}');
      expect(onTabChange).toHaveBeenCalledWith('published');

      await user.keyboard('{Home}');
      expect(onTabChange).toHaveBeenCalledWith('all');
    });

    test('ignores keys that are not navigation keys', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(<Tabs tabs={tabs} activeTabId="all" onTabChange={onTabChange} />);

      screen.getByRole('tab', { name: 'All' }).focus();
      await user.keyboard('{ArrowDown}');

      expect(onTabChange).not.toHaveBeenCalled();
    });

    test('does not re-fire onTabChange when navigating onto the active tab', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      render(
        <Tabs
          tabs={[{ id: 'all', label: 'All' }]}
          activeTabId="all"
          onTabChange={onTabChange}
        />,
      );

      screen.getByRole('tab', { name: 'All' }).focus();
      await user.keyboard('{ArrowRight}');

      expect(onTabChange).not.toHaveBeenCalled();
    });
  });

  test('applies the enhanced pointer target to the 40px tabs', () => {
    render(<Tabs tabs={tabs} activeTabId="all" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'All' })).toHaveClass(
      'dial-kit-enhanced-target',
    );
  });

  describe('vertical orientation', () => {
    const items = [
      { id: 'preferences', label: 'Preferences' },
      { id: 'usage', label: 'Usage' },
      { id: 'about', label: 'About' },
    ];

    const renderVertical = (props: Partial<TabsProps> = {}) =>
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
          ariaLabel="Settings sections"
          {...props}
        />,
      );

    test('declares the tab list vertical', () => {
      renderVertical();

      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-orientation',
        'vertical',
      );
    });

    test('the down and up arrows move selection and focus', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      renderVertical({ onTabChange });

      screen.getByRole('tab', { name: 'Preferences' }).focus();
      await user.keyboard('{ArrowDown}');

      expect(onTabChange).toHaveBeenCalledWith('usage');
      expect(screen.getByRole('tab', { name: 'Usage' })).toHaveFocus();
    });

    test('ArrowUp wraps from the first row to the last', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      renderVertical({ onTabChange });

      screen.getByRole('tab', { name: 'Preferences' }).focus();
      await user.keyboard('{ArrowUp}');

      expect(onTabChange).toHaveBeenCalledWith('about');
    });

    test('the horizontal arrows do not move a vertical list', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      renderVertical({ onTabChange });

      screen.getByRole('tab', { name: 'Preferences' }).focus();
      await user.keyboard('{ArrowRight}{ArrowLeft}');

      expect(onTabChange).not.toHaveBeenCalled();
    });

    test('the arrow keys skip over a disabled row', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();
      renderVertical({
        tabs: [
          { id: 'preferences', label: 'Preferences' },
          { id: 'usage', label: 'Usage', disabled: true },
          { id: 'about', label: 'About' },
        ],
        onTabChange,
      });

      screen.getByRole('tab', { name: 'Preferences' }).focus();
      await user.keyboard('{ArrowDown}');

      expect(onTabChange).toHaveBeenCalledWith('about');
    });

    test('paints the active row as a pill rather than an underline', () => {
      renderVertical();

      const active = screen.getByRole('tab', { name: 'Preferences' });

      expect(active).toHaveClass('bg-control-accent-alpha');
      expect(active).not.toHaveClass('dial-kit-tab-selected-underline');
    });

    test('applies the enhanced pointer target to the rows', () => {
      renderVertical();

      expect(screen.getByRole('tab', { name: 'Usage' })).toHaveClass(
        'dial-kit-enhanced-target',
      );
    });
  });

  describe('sectionLabel', () => {
    const items = [{ id: 'preferences', label: 'Preferences' }];

    test('renders the heading and names the tab list with it', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          sectionLabel="Settings"
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toHaveAccessibleName('Settings');
    });

    test('an explicit ariaLabel wins over the heading', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          sectionLabel="Settings"
          ariaLabel="Settings sections"
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
        />,
      );

      expect(screen.getByRole('tablist')).toHaveAccessibleName(
        'Settings sections',
      );
    });

    test('className lands on the tab list when there is no heading', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          className="w-60"
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
          ariaLabel="Settings sections"
        />,
      );

      expect(screen.getByRole('tablist')).toHaveClass('w-60');
    });

    test('className moves to the wrapper once a heading is rendered', () => {
      const { container } = render(
        <Tabs
          orientation={TabOrientation.Vertical}
          sectionLabel="Settings"
          className="w-60"
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
        />,
      );

      expect(screen.getByRole('tablist')).not.toHaveClass('w-60');
      expect(container.querySelector('.w-60')).toHaveClass(DIAL_KIT_CLASS.tabs);
    });

    test('tabListClassName reaches the tab list even behind a heading', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          sectionLabel="Settings"
          className="w-60"
          tabListClassName="px-6"
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
        />,
      );

      const tabList = screen.getByRole('tablist');

      expect(tabList).toHaveClass('px-6');
      expect(tabList).not.toHaveClass('w-60');
    });

    test('tabListClassName and className land together when there is no heading', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          className="w-60"
          tabListClassName="px-6"
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
          ariaLabel="Settings sections"
        />,
      );

      const tabList = screen.getByRole('tablist');

      expect(tabList).toHaveClass('w-60');
      expect(tabList).toHaveClass('px-6');
    });
  });

  describe('selected tab class', () => {
    const items = [
      { id: 'preferences', label: 'Preferences' },
      { id: 'usage', label: 'Usage' },
    ];

    test('marks the selected tab in a horizontal row', () => {
      render(<Tabs tabs={items} activeTabId="usage" onTabChange={vi.fn()} />);

      expect(screen.getByRole('tab', { name: 'Usage' })).toHaveClass(
        DIAL_KIT_CLASS.tabSelected,
      );
      expect(screen.getByRole('tab', { name: 'Preferences' })).not.toHaveClass(
        DIAL_KIT_CLASS.tabSelected,
      );
    });

    test('marks the selected tab in a vertical rail', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          tabs={items}
          activeTabId="preferences"
          onTabChange={vi.fn()}
          ariaLabel="Settings sections"
        />,
      );

      expect(screen.getByRole('tab', { name: 'Preferences' })).toHaveClass(
        DIAL_KIT_CLASS.tabSelected,
      );
      expect(screen.getByRole('tab', { name: 'Usage' })).not.toHaveClass(
        DIAL_KIT_CLASS.tabSelected,
      );
    });
  });

  describe('tab icons', () => {
    test('keeps the icon out of the accessible name', () => {
      render(
        <Tabs
          orientation={TabOrientation.Vertical}
          tabs={[
            {
              id: 'preferences',
              label: 'Preferences',
              icon: <svg data-testid="icon" />,
            },
          ]}
          activeTabId="preferences"
          onTabChange={vi.fn()}
          ariaLabel="Settings sections"
        />,
      );

      expect(
        screen.getByRole('tab', { name: 'Preferences' }),
      ).toHaveAccessibleName('Preferences');
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });
});
