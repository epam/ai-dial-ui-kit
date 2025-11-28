import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialFileManagerToolbar } from './DialFileManagerToolbar';
import type { TabModel } from '@/models/tab';

describe('Dial UI Kit :: DialFileManagerToolbar', () => {
  const mockTabs: TabModel[] = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
  ];

  it('renders tabs passed via props', () => {
    render(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
      />,
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn();
    render(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={onTabChange}
        onToggleHiddenFiles={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('manages hidden files switch state via props', () => {
    const onToggleHiddenFiles = vi.fn();
    render(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={true}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={onToggleHiddenFiles}
      />,
    );

    const switcher = screen.getByRole('checkbox');
    expect(switcher).toBeChecked();

    fireEvent.click(switcher);
    expect(onToggleHiddenFiles).toHaveBeenCalledWith(false);
  });

  it('shows new button only when isNewButtonVisible is true', () => {
    const { rerender } = render(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        isNewButtonVisible={false}
        newButtonLabel="New"
      />,
    );

    expect(
      screen.queryByRole('button', { name: /new/i }),
    ).not.toBeInTheDocument();

    rerender(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        isNewButtonVisible={true}
        newButtonLabel="New"
        newButtonDropdownItems={[{ key: '1', label: 'New File' }]}
      />,
    );

    expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();
  });

  it('renders new button with custom label', () => {
    const customLabel = 'Create New';
    render(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
        isNewButtonVisible={true}
        newButtonLabel={customLabel}
        newButtonDropdownItems={[{ key: '1', label: 'New File' }]}
      />,
    );

    expect(
      screen.getByRole('button', { name: /create new/i }),
    ).toBeInTheDocument();
  });

  it('does not render tabs when not provided', () => {
    render(
      <DialFileManagerToolbar
        areHiddenFilesVisible={false}
        onToggleHiddenFiles={vi.fn()}
      />,
    );

    expect(screen.queryByText('Tab 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Tab 2')).not.toBeInTheDocument();
  });

  it('renders with correct hidden files switch label', () => {
    const customLabel = 'Show System Files';
    render(
      <DialFileManagerToolbar
        tabs={mockTabs}
        activeTab="tab1"
        areHiddenFilesVisible={false}
        hiddenFilesSwitcherLabel={customLabel}
        onTabChange={vi.fn()}
        onToggleHiddenFiles={vi.fn()}
      />,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });
});
