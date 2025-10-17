import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialFileIcon } from './FileIcon';
import { fileIconFactories, supportedExtensions } from './constants';
import { IconArrowUpRight } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';

describe('Dial UI Kit :: DialFileIcon', () => {
  test('renders as role="img" by default with computed label', () => {
    render(<DialFileIcon extension=".pdf" />);
    const el = screen.getByRole('img', { name: /PDF file icon/i });
    expect(el).toBeInTheDocument();
  });

  test('normalizes extension without leading dot', () => {
    render(<DialFileIcon extension="json" />);
    expect(
      screen.getByRole('img', { name: /JSON file icon/i }),
    ).toBeInTheDocument();
  });

  test('falls back to default icon for unknown extension', () => {
    render(<DialFileIcon extension=".unknown" />);
    expect(
      screen.getByRole('img', { name: /UNKNOWN file icon/i }),
    ).toBeInTheDocument();
  });

  test('supports decorative mode (aria-hidden)', () => {
    render(<DialFileIcon extension="tsx" decorative />);
    const imgs = screen.queryAllByRole('img');
    expect(imgs.length).toBe(0);
  });

  test('applies indicator element when provided', () => {
    render(
      <DialFileIcon
        extension=".pdf"
        indicator={
          <IconArrowUpRight role="img" aria-label="Upload indicator" />
        }
      />,
    );
    expect(
      screen.getByRole('img', { name: /Upload indicator/i }),
    ).toBeInTheDocument();
  });

  test.each(supportedExtensions)(
    'renders label for supported extension %s',
    (ext) => {
      render(<DialFileIcon extension={ext} />);
      const expected = new RegExp(
        `${ext.slice(1).toUpperCase()} file icon`,
        'i',
      );
      expect(screen.getByRole('img', { name: expected })).toBeInTheDocument();
    },
  );

  test('tabler icon renders with correct default props if not provided', () => {
    const node = fileIconFactories['.pdf']({});
    const { container } = render(<>{node}</>);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('width')).toBe(String(BASE_ICON_PROPS.size));
    expect(svg!.getAttribute('height')).toBe(String(BASE_ICON_PROPS.size));
    expect(svg!.getAttribute('stroke-width')).toBe(
      String(BASE_ICON_PROPS.stroke),
    );
  });

  test('svgr icon renders with correct default props if not provided', () => {
    const node = fileIconFactories['.cpp']({});
    const { container } = render(<>{node}</>);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('width')).toBe(String(BASE_ICON_PROPS.size));
    expect(svg!.getAttribute('height')).toBe(String(BASE_ICON_PROPS.size));
  });
});
