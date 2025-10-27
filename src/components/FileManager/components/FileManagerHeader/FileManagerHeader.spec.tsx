import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialFileManagerHeader } from './FileManagerHeader';
import type { DialTabsProps } from '@/components/Tabs/Tabs';
import type { DialSwitchProps } from '@/components/Switch/Switch';
import type { DialButtonProps } from '@/components/Button/Button';
import type { DialButtonDropdownProps } from '@/components/ButtonDropdown/ButtonDropdown';

vi.mock('@/components/Tabs/Tabs', () => ({
  DialTabs: ({ tabs, activeTab, onClick }: DialTabsProps) => (
    <div data-testid="dial-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-testid={`tab-${tab.id}`}
          data-active={tab.id === activeTab}
          onClick={() => onClick(tab.id)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/components/Switch/Switch', () => ({
  DialSwitch: ({ isOn, onChange }: DialSwitchProps) => (
    <button
      data-testid="hidden-switch"
      data-on={isOn}
      onClick={() => onChange?.(!isOn)}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  ),
}));

vi.mock('@/components/Button/Button', () => ({
  DialButton: ({ title, onClick }: DialButtonProps) => (
    <button data-testid="button" onClick={onClick}>
      {title}
    </button>
  ),
}));

vi.mock('@/components/ButtonDropdown/ButtonDropdown', () => ({
  DialButtonDropdown: ({ title }: DialButtonDropdownProps) => (
    <div data-testid="create-button">{title}</div>
  ),
}));

vi.mock('@tabler/icons-react', () => ({
  IconRefresh: () => <svg data-testid="refresh-icon" />,
}));

describe('Dial UI Kit :: DialFileManagerHeader', () => {
  const mockTabs = [
    { id: 'tab1', name: 'Tab 1' },
    { id: 'tab2', name: 'Tab 2' },
  ];

  it('renders tabs passed via props', () => {
    render(
      <DialFileManagerHeader
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByTestId('tab-tab1')).toBeInTheDocument();
    expect(screen.getByTestId('tab-tab2')).toBeInTheDocument();
  });

  it('manages hidden files switch state via props', () => {
    const onToggleHiddenFiles = vi.fn();
    render(
      <DialFileManagerHeader
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={true}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={onToggleHiddenFiles}
        onRefresh={vi.fn()}
      />,
    );

    const switcher = screen.getByTestId('hidden-switch');
    expect(switcher).toHaveAttribute('data-on', 'true');

    fireEvent.click(switcher);
    expect(onToggleHiddenFiles).toHaveBeenCalledWith(false);
  });

  it('shows create button only when isCreateButtonVisible is true', () => {
    const { queryByTestId, rerender } = render(
      <DialFileManagerHeader
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        onRefresh={vi.fn()}
        isCreateButtonVisible={false}
      />,
    );

    expect(queryByTestId('create-button')).toBeNull();

    rerender(
      <DialFileManagerHeader
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        onRefresh={vi.fn()}
        isCreateButtonVisible={true}
        createButtonDropdownItems={[{ key: '1', label: 'New File' }]}
      />,
    );

    expect(queryByTestId('create-button')).toBeInTheDocument();
  });

  it('calls onRefresh when clicking refresh button', () => {
    const onRefresh = vi.fn();
    render(
      <DialFileManagerHeader
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        onRefresh={onRefresh}
      />,
    );

    fireEvent.click(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
