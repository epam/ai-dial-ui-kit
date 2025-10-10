import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialTag } from './Tag';
import { IconEar } from '@tabler/icons-react';

describe('Dial UI Kit :: DialTag', () => {
  test('Should render correctly with tag text', () => {
    render(<DialTag tag="tag" />);
    expect(screen.getByText('tag')).toBeInTheDocument();
  });

  test('Should apply additional CSS classes if provided', () => {
    render(<DialTag tag="tag" cssClass="extra-class" />);
    const tagDiv = screen.getByText('tag').parentElement;
    expect(tagDiv).toHaveClass('extra-class');
  });

  test('Should render iconBefore when provided', () => {
    const IconBefore = <IconEar data-testid="before-icon" />;
    render(<DialTag tag="tag" iconBefore={IconBefore} />);

    expect(screen.getByTestId('before-icon')).toBeInTheDocument();
    expect(screen.getByText('tag')).toBeInTheDocument();
  });

  test('Should not render iconBefore if not provided', () => {
    render(<DialTag tag="tag" />);
    expect(screen.queryByTestId('before-icon')).not.toBeInTheDocument();
  });

  test('Should render remove button if remove callback is provided', () => {
    const removeMock = vi.fn();
    render(<DialTag tag="tag" remove={removeMock} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(removeMock).toHaveBeenCalledTimes(1);
  });

  test('Should NOT render remove button if remove callback is NOT provided', () => {
    render(<DialTag tag="tag" />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  test('Should handle click on remove button correctly', () => {
    const removeMock = vi.fn();
    render(<DialTag tag="tag" remove={removeMock} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(removeMock).toHaveBeenCalled();
  });
});
