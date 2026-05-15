import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DialPagination } from '../Pagination';

describe('Dial UI Kit :: DialPagination', () => {
  test('renders navigation landmark', () => {
    render(<DialPagination totalPages={6} page={1} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });

  test('renders prev and next buttons', () => {
    render(<DialPagination totalPages={6} page={5} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).toBeInTheDocument();
  });

  test('prev button is disabled on first page', () => {
    render(<DialPagination totalPages={6} page={1} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  test('prev button is enabled when not on first page', () => {
    render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).not.toBeDisabled();
  });

  test('next button is disabled on last page', () => {
    render(<DialPagination totalPages={6} page={6} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).toBeDisabled();
  });

  test('next button is enabled when not on last page', () => {
    render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).not.toBeDisabled();
  });

  test('calls onPageChange with previous page on prev click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination totalPages={6} page={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Previous page' }),
    );
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  test('calls onPageChange with next page on next click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination totalPages={6} page={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  test('calls onPageChange with correct page on dot click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination totalPages={6} page={3} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  test('applies custom className to nav', () => {
    render(
      <DialPagination
        totalPages={6}
        page={1}
        onPageChange={vi.fn()}
        className="custom-class"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass(
      'custom-class',
    );
  });

  test('active page has wide dot style', () => {
    render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveClass(
      'w-[32px]',
    );
  });

  test('active page has aria-current="page"', () => {
    render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  describe('6 pages and fewer — all dots shown at regular size', () => {
    test('non-active dots use regular size', () => {
      render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveClass(
        'size-[8px]',
      );
      expect(screen.getByRole('button', { name: 'Page 6' })).toHaveClass(
        'size-[8px]',
      );
    });

    test('no small dots are rendered', () => {
      render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
      const dots = screen.getAllByRole('button', { name: /^Page/ });
      dots.forEach((dot) => {
        expect(dot).not.toHaveClass('size-[4px]');
      });
    });
  });

  describe('7 pages and more — far pages shrink to small dots', () => {
    test('adjacent pages within window use regular size', () => {
      render(
        <DialPagination totalPages={10} page={5} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: 'Page 3' })).toHaveClass(
        'size-[8px]',
      );
      expect(screen.getByRole('button', { name: 'Page 7' })).toHaveClass(
        'size-[8px]',
      );
    });

    test('pages beyond adjacent window use small size', () => {
      render(
        <DialPagination totalPages={10} page={5} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveClass(
        'size-[4px]',
      );
      expect(screen.getByRole('button', { name: 'Page 10' })).toHaveClass(
        'size-[4px]',
      );
    });

    test('active page remains wide regardless of total pages', () => {
      render(
        <DialPagination totalPages={10} page={5} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: 'Page 5' })).toHaveClass(
        'w-[32px]',
      );
    });
  });
});
