import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useTreeAdditionalButtons } from '@/components/FileManager/hooks/use-tree-additional-buttons';
import React from 'react';

describe('Dial UI Kit :: FileManager :: useTreeAdditionalButtons', () => {
  it('renders additionalButtons when provided', () => {
    const Custom = () => <div>CustomButton</div>;

    const { result } = renderHook(() =>
      useTreeAdditionalButtons({
        additionalButtons: <Custom />,
        expandedPathsLength: 1,
        collapseAll: vi.fn(),
      }),
    );

    const { getByText } = render(result.current.additionalButtons);

    expect(getByText('CustomButton')).toBeInTheDocument();
  });

  it('renders the collapse button', () => {
    const { result } = renderHook(() =>
      useTreeAdditionalButtons({
        expandedPathsLength: 1,
        collapseAll: vi.fn(),
      }),
    );

    const { container } = render(result.current.additionalButtons);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('disables the collapse button when expandedPathsLength is 0', () => {
    const { result } = renderHook(() =>
      useTreeAdditionalButtons({
        expandedPathsLength: 0,
        collapseAll: vi.fn(),
      }),
    );

    const { container } = render(result.current.additionalButtons);

    const button = container.querySelector('button')!;
    expect(button).toBeDisabled();
  });

  it('enables the collapse button when expandedPathsLength > 0', () => {
    const { result } = renderHook(() =>
      useTreeAdditionalButtons({
        expandedPathsLength: 3,
        collapseAll: vi.fn(),
      }),
    );

    const { container } = render(result.current.additionalButtons);

    const button = container.querySelector('button')!;
    expect(button).not.toBeDisabled();
  });

  it('calls collapseAll when clicking the collapse button', () => {
    const collapseAll = vi.fn();

    const { result } = renderHook(() =>
      useTreeAdditionalButtons({
        expandedPathsLength: 2,
        collapseAll,
      }),
    );

    const { container } = render(result.current.additionalButtons);

    const button = container.querySelector('button')!;
    fireEvent.click(button);

    expect(collapseAll).toHaveBeenCalledTimes(1);
  });
});
