import { fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { DialTabs } from './Tabs';
import { TabOrientation } from '@/types/tab';

const tabsMock = [
  { id: 'tab1', name: 'Tab1' },
  { id: 'tab2', name: 'Tab2' },
];

describe('Dial UI Kit :: DialTabs', () => {
  let originalResizeObserver: typeof ResizeObserver;

  beforeAll(() => {
    originalResizeObserver = globalThis.ResizeObserver;

    class ResizeObserverMock implements ResizeObserver {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    globalThis.ResizeObserver =
      ResizeObserverMock as unknown as typeof ResizeObserver;
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

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
});
