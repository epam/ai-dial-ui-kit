import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialTabs } from './Tabs';
import { TabOrientation, TabView } from '@/types/tab';
import * as useScreenTypeHook from '@/hooks/use-screen-type';
import { ScreenType } from '@/types/screen';
import type { TabModel } from '@/models/tab';

const tabsMock: TabModel[] = [
  { id: 'tab1', label: 'Tab1' },
  { id: 'tab2', label: 'Tab2' },
];

describe('Dial UI Kit :: DialTabs', () => {
  test('renders horizontal tabs and handles click', () => {
    const onClick = vi.fn();
    render(<DialTabs tabs={tabsMock} activeTab="tab1" onClick={onClick} />);
    expect(screen.getAllByText('Tab1').length).toBe(1);
    expect(screen.getAllByText('Tab2').length).toBe(1);
    fireEvent.click(screen.getByText('Tab2'));
    expect(onClick).toHaveBeenCalledWith('tab2');
  });

  test('renders vertical tabs when orientation is vertical', () => {
    render(
      <DialTabs
        tabs={tabsMock}
        activeTab="tab1"
        onClick={vi.fn()}
        orientation={TabOrientation.Vertical}
      />,
    );
    expect(screen.getAllByText('Tab1').length).toBe(1);
    expect(screen.getAllByText('Tab2').length).toBe(1);
  });

  test('shows dropdown button when when mobile view', () => {
    const onClick = vi.fn();

    vi.spyOn(useScreenTypeHook, 'useScreenType').mockReturnValue(
      ScreenType.Tablet,
    );

    const { container } = render(
      <DialTabs tabs={tabsMock} activeTab="tab1" onClick={onClick} />,
    );

    const chevronIcon = container.querySelector('.tabler-icon-chevron-down');
    expect(chevronIcon).toBeInTheDocument();
  });

  test('handles tab click in mobile view', () => {
    const onClick = vi.fn();

    vi.spyOn(useScreenTypeHook, 'useScreenType').mockReturnValue(
      ScreenType.Tablet,
    );

    render(<DialTabs tabs={tabsMock} activeTab="tab1" onClick={onClick} />);

    const tab = screen.getByRole('tab');
    expect(tab).toBeInTheDocument();

    fireEvent.click(tab);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('tab1');
  });

  test('handles tab click in desktop view', () => {
    const onClick = vi.fn();

    vi.spyOn(useScreenTypeHook, 'useScreenType').mockReturnValue(
      ScreenType.Desktop,
    );

    render(<DialTabs tabs={tabsMock} activeTab="tab1" onClick={onClick} />);

    const tab2 = screen
      .getAllByRole('tab')
      .find((el) => el.textContent === 'Tab2');
    expect(tab2).toBeInTheDocument();

    fireEvent.click(tab2!);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('tab2');
  });

  test('renders inline view and marks active tab with a check icon', () => {
    const { container } = render(
      <DialTabs
        tabs={tabsMock}
        activeTab="tab1"
        onClick={vi.fn()}
        view={TabView.Inline}
      />,
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);

    const checkIcons = container.querySelectorAll('.tabler-icon-check');
    expect(checkIcons).toHaveLength(1);

    const activeTab = tabs.find((el) => el.textContent === 'Tab1');
    expect(activeTab?.querySelector('.tabler-icon-check')).toBeInTheDocument();
  });

  test('handles tab click in inline view', () => {
    const onClick = vi.fn();
    render(
      <DialTabs
        tabs={tabsMock}
        activeTab="tab1"
        onClick={onClick}
        view={TabView.Inline}
      />,
    );

    fireEvent.click(screen.getByText('Tab2'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('tab2');
  });
});
