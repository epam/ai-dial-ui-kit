import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DialItemType } from '@/types/item';
import { FileIcon } from './FileIcon';

describe('Dial UI Kit :: FileIcon', () => {
  test('names a file by its extension', () => {
    render(<FileIcon name="report.pdf" type={DialItemType.File} />);

    expect(screen.getByRole('img', { name: 'PDF file' })).toBeInTheDocument();
  });

  test('names a file without an extension "File"', () => {
    render(<FileIcon name="README" type={DialItemType.File} />);

    expect(screen.getByRole('img', { name: 'File' })).toBeInTheDocument();
  });

  test('prefers fileExtension over the name, with or without a dot', () => {
    render(
      <FileIcon
        name="archive.pdf"
        fileExtension=".ZIP"
        type={DialItemType.File}
      />,
    );

    expect(screen.getByRole('img', { name: 'ZIP file' })).toBeInTheDocument();
  });

  test('ignores dots in a folder name', () => {
    render(<FileIcon name="v1.2" type={DialItemType.Folder} />);

    expect(screen.getByRole('img', { name: 'Folder' })).toBeInTheDocument();
  });

  test('gives every folder glyph its own gradient id', () => {
    const { container } = render(
      <>
        <FileIcon name="A" type={DialItemType.Folder} />
        <FileIcon name="B" type={DialItemType.Folder} />
      </>,
    );
    const ids = [...container.querySelectorAll('linearGradient')].map(
      (gradient) => gradient.id,
    );

    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(container.querySelector(`[fill="url(#${ids[0]})"]`)).not.toBeNull();
  });

  const glyphOf = (name: string) => {
    const { container, unmount } = render(
      <FileIcon name={name} type={DialItemType.File} />,
    );
    const d = container.querySelectorAll('path')[1].getAttribute('d');
    unmount();

    return d;
  };

  // Two extensions per kind; `Other` pairs an unknown extension with none.
  const KIND_SAMPLES: Array<[string, string, string]> = [
    ['images', 'a.png', 'b.JPEG'],
    ['video', 'a.mp4', 'b.MOV'],
    ['audio', 'a.mp3', 'b.wav'],
    ['code', 'a.ts', 'b.PY'],
    ['text', 'a.txt', 'b.docx'],
    ['pdf', 'a.pdf', 'b.PDF'],
    ['spreadsheet', 'a.xlsx', 'b.csv'],
    ['presentation', 'a.pptx', 'b.PPT'],
    ['archive', 'a.zip', 'b.tar'],
    ['dial', 'a.dial', 'b.DIAL'],
    ['other', 'a.bin', 'README'],
  ];

  test.each(KIND_SAMPLES)(
    'draws %s files with one glyph',
    (_kind, first, second) => {
      expect(glyphOf(first)).toBe(glyphOf(second));
    },
  );

  test('draws a different glyph for every kind', () => {
    const glyphs = KIND_SAMPLES.map(([, sample]) => glyphOf(sample));

    expect(new Set(glyphs).size).toBe(KIND_SAMPLES.length);
  });

  test('fills the pdf mark and strokes the others', () => {
    const markOf = (name: string) => {
      const { container, unmount } = render(
        <FileIcon name={name} type={DialItemType.File} />,
      );
      const mark = container.querySelectorAll('path')[1];
      const attrs = {
        fill: mark.getAttribute('fill'),
        stroke: mark.getAttribute('stroke'),
      };
      unmount();

      return attrs;
    };

    expect(markOf('a.pdf').stroke).toBeNull();
    expect(markOf('a.pdf').fill).not.toBeNull();
    expect(markOf('a.txt').stroke).not.toBeNull();
  });

  test('draws the DIAL sheet flat, with no gradient to reference', () => {
    const { container } = render(
      <FileIcon name="a.dial" type={DialItemType.File} />,
    );

    expect(container.querySelector('linearGradient')).toBeNull();
    expect(container.querySelector('path')?.getAttribute('fill')).not.toMatch(
      /^url\(/,
    );
  });

  test('draws the glyph at the given size, hidden from assistive technology', () => {
    const { container } = render(
      <FileIcon name="a.txt" type={DialItemType.File} size={32} />,
    );
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  test('uses DIAL_ICON_SIZE.MD by default', () => {
    const { container } = render(
      <FileIcon name="a.txt" type={DialItemType.File} />,
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'width',
      String(DIAL_ICON_SIZE.MD),
    );
  });

  test('adds the shared state to the name and shows the badge tooltip on hover', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FileIcon
        name="Team"
        type={DialItemType.Folder}
        shared
        sharedIndicatorTooltip="Shared with 3 people"
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Folder, shared' }),
    ).toBeInTheDocument();

    const badge = container.querySelectorAll('svg')[1].parentElement!;
    await user.hover(badge);

    expect(await screen.findByText('Shared with 3 people')).toBeInTheDocument();
  });

  test('uses a custom label verbatim', () => {
    render(
      <FileIcon
        name="a.pdf"
        type={DialItemType.File}
        shared
        label="Документ"
      />,
    );

    expect(screen.getByRole('img', { name: 'Документ' })).toBeInTheDocument();
  });

  test('replaces the glyph with a status spinner while loading', () => {
    render(
      <FileIcon
        name="a.pdf"
        type={DialItemType.File}
        loading
        loadingLabel="Uploading"
      />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Uploading' })).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: 'PDF file' }),
    ).not.toBeInTheDocument();
  });

  test('hides a decorative icon from assistive technology', () => {
    render(<FileIcon name="a.pdf" type={DialItemType.File} decorative />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('merges className onto the root', () => {
    render(
      <FileIcon
        name="a.pdf"
        type={DialItemType.File}
        className="text-accent"
      />,
    );

    expect(screen.getByRole('img', { name: 'PDF file' })).toHaveClass(
      'text-accent',
    );
  });

  test('renders nothing for an unknown type', () => {
    const { container } = render(
      // @ts-expect-error testing invalid type handling
      <FileIcon name="x" type="unknown" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
