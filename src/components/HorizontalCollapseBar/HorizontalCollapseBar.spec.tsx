import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialHorizontalCollapseBar } from './HorizontalCollapseBar';

vi.mock('@tabler/icons-react', () => ({
  IconChevronsLeft: () => <span>LeftIcon</span>,
  IconChevronsRight: () => <span>RightIcon</span>,
}));

describe('Dial UI Kit :: DialHorizontalCollapseBar', () => {
  test('Should render with children and title', () => {
    render(
      <DialHorizontalCollapseBar width={200} title="My Title">
        <div>ChildContent</div>
      </DialHorizontalCollapseBar>,
    );
    expect(screen.getByText('ChildContent')).toBeInTheDocument();
  });

  test('Should collapse and show title when button is clicked', () => {
    render(
      <DialHorizontalCollapseBar width={200} title="My Title">
        <div>ChildContent</div>
      </DialHorizontalCollapseBar>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('RightIcon')).toBeInTheDocument();
  });

  test('Should expand again when button is clicked twice', () => {
    render(
      <DialHorizontalCollapseBar width={200} title="My Title">
        <div>ChildContent</div>
      </DialHorizontalCollapseBar>,
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('ChildContent')).toBeVisible();
    expect(screen.getByText('LeftIcon')).toBeInTheDocument();
  });
});
