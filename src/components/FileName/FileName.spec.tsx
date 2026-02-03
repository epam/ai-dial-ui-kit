import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialFileName } from './FileName';

describe('Dial UI Kit :: DialFileName', () => {
  test('renders filename text', () => {
    render(<DialFileName name="notes.txt" />);
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
  });

  test('renders file icon when extension is present', () => {
    render(<DialFileName name="report.pdf" />);
    expect(
      screen.getByRole('img', { name: 'File type icon' }),
    ).toBeInTheDocument();
  });

  test('renders file icon when no extension', () => {
    render(<DialFileName name="README" />);
    expect(
      screen.queryByRole('img', { name: 'File type icon' }),
    ).toBeInTheDocument();
  });

  test('root container spans full width and keeps spacing', () => {
    render(<DialFileName name="image.png" className="custom-class" />);
    const root = screen.getByRole('img', {
      name: 'File type icon',
    }).parentElement;
    expect(root).toHaveClass('flex');
    expect(root).toHaveClass('items-center');
    expect(root).toHaveClass('gap-2');
    expect(root).toHaveClass('custom-class');
  });

  test('text wrapper takes remaining space (flex-1) with min-w-0', () => {
    render(
      <DialFileName name="very-long-file-name-to-trigger-ellipsis-and-take-space.txt" />,
    );
    const textWrap = screen.getByText(
      'very-long-file-name-to-trigger-ellipsis-and-take-space.txt',
    );
    expect(textWrap).toHaveClass('flex-1');
    expect(textWrap).toHaveClass('min-w-0');
  });

  test('renders shared indicator when shared=true', () => {
    render(<DialFileName name="design.sketch" shared />);
    expect(
      screen.getByRole('img', { name: 'Shared entity' }),
    ).toBeInTheDocument();
  });
});
