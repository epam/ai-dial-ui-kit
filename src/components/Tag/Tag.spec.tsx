import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialTag } from './Tag';
import { IconEar } from '@tabler/icons-react';

describe('Dial UI Kit :: DialTag', () => {
  test('Should render correctly with label text', () => {
    render(<DialTag label="tag" />);
    expect(screen.getByText('tag')).toBeInTheDocument();
  });

  test('Should apply additional CSS classes if provided', () => {
    render(<DialTag label="tag" className="extra-class" />);
    const tagDiv = screen.getByText('tag').parentElement;
    expect(tagDiv).toHaveClass('extra-class');
  });

  test('Should render icon when provided', () => {
    const icon = <IconEar role="img" aria-label="Ear icon" />;
    render(<DialTag label="tag" icon={icon} />);

    expect(screen.getByRole('img', { name: 'Ear icon' })).toBeInTheDocument();
    expect(screen.getByText('tag')).toBeInTheDocument();
  });

  test('Should not render icon if not provided', () => {
    render(<DialTag label="tag" />);
    expect(
      screen.queryByRole('img', { name: 'Ear icon' }),
    ).not.toBeInTheDocument();
  });

  test('Should render remove button when closable and onRemove are provided', () => {
    const onRemove = vi.fn();
    render(<DialTag label="tag" closable onRemove={onRemove} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('Should NOT render remove button if onRemove is NOT provided', () => {
    render(<DialTag label="tag" closable />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  test('Should NOT render remove button if closable is false', () => {
    const onRemove = vi.fn();
    render(<DialTag label="tag" onRemove={onRemove} />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  test('Should call onClick when tag container is clicked', () => {
    const onClick = vi.fn();
    render(<DialTag label="tag" onClick={onClick} />);

    const tagDiv = screen.getByText('tag').parentElement;
    expect(tagDiv).not.toBeNull();

    fireEvent.click(tagDiv as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
