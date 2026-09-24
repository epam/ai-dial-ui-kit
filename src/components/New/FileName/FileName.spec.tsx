import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DialItemType } from '@/types/item';
import { FileName } from './FileName';

describe('Dial UI Kit :: FileName', () => {
  test('renders the name', () => {
    render(<FileName name="notes.txt" />);

    expect(screen.getByText('notes.txt')).toBeInTheDocument();
  });

  test('keeps the icon out of the accessibility tree, since the name says it all', () => {
    const { container } = render(<FileName name="report.pdf" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('draws a folder glyph for a folder', () => {
    const folder = render(<FileName name="v1.2" type={DialItemType.Folder} />);
    const folderPath = folder.container
      .querySelector('path')
      ?.getAttribute('d');
    folder.unmount();
    const file = render(<FileName name="v1.2" />);

    expect(file.container.querySelector('path')?.getAttribute('d')).not.toBe(
      folderPath,
    );
  });

  test('announces the shared state with a visually hidden label', () => {
    render(<FileName name="a.pdf" shared sharedLabel="Спільний" />);

    expect(screen.getByText('Спільний')).toHaveClass('sr-only');
  });

  test('does not announce a shared state it does not have', () => {
    render(<FileName name="a.pdf" />);

    expect(screen.queryByText('Shared')).not.toBeInTheDocument();
  });

  test('renders details under the name', () => {
    render(<FileName name="a.pdf" details={<span>24 KB</span>} />);

    expect(screen.getByText('24 KB').parentElement).toHaveClass('flex-col');
  });

  test('mutes an invalid name', () => {
    render(<FileName name="bad?.txt" isInvalidName />);

    expect(screen.getByText('bad?.txt')).toHaveClass('text-secondary');
    expect(screen.getByText('bad?.txt')).not.toHaveClass('text-primary');
  });

  test('passes iconSize to the icon', () => {
    const { container } = render(<FileName name="a.txt" iconSize={32} />);

    expect(container.querySelector('svg')).toHaveAttribute('width', '32');
  });

  test('uses the 2.0 icon size by default', () => {
    const { container } = render(<FileName name="a.txt" />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'width',
      String(DIAL_ICON_SIZE.MD),
    );
  });

  test('merges className onto the root and nameClassName onto the text', () => {
    const { container } = render(
      <FileName name="a.txt" className="custom" nameClassName="font-bold" />,
    );

    expect(container.firstChild).toHaveClass('custom');
    expect(screen.getByText('a.txt')).toHaveClass('font-bold');
  });
});
