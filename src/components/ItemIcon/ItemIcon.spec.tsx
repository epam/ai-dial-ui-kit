import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialItemIcon } from './ItemIcon';
import { DialItemType } from '@/types/item';
import { BASE_ICON_PROPS } from '@/constants/icon';

describe('Dial UI Kit :: DialItemIcon', () => {
  test('renders file icon with proper accessible label', () => {
    render(<DialItemIcon name="document.pdf" type={DialItemType.File} />);
    const el = screen.getByRole('img', { name: /File type icon/i });
    expect(el).toBeInTheDocument();
  });

  test('renders folder icon with role="img"', () => {
    render(<DialItemIcon name="My Folder" type={DialItemType.Folder} />);
    const el = screen.getByRole('img');
    expect(el).toBeInTheDocument();
  });

  test('renders shared indicator for file', () => {
    render(<DialItemIcon name="shared.pdf" type={DialItemType.File} shared />);
    const indicators = screen.getAllByRole('img');
    expect(indicators.length).toBeGreaterThan(0);
  });

  test('renders shared indicator for folder', () => {
    render(<DialItemIcon name="My Folder" type={DialItemType.Folder} shared />);
    const el = screen.getByLabelText('Shared entity');
    expect(el).toBeInTheDocument();
  });

  test('renders loader when loading is true', () => {
    render(
      <DialItemIcon name="loading.docx" type={DialItemType.File} loading />,
    );
    const loader = screen.getByLabelText('Loading');
    expect(loader).toBeInTheDocument();
  });

  test('uses default size and stroke for folder icon if not provided', () => {
    const { container } = render(
      <DialItemIcon name="Default Folder" type={DialItemType.Folder} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('width')).toBe(String(BASE_ICON_PROPS.size));
    expect(svg!.getAttribute('height')).toBe(String(BASE_ICON_PROPS.size));
    expect(svg!.getAttribute('stroke-width')).toBe(
      String(BASE_ICON_PROPS.stroke),
    );
  });

  test('accepts custom size and stroke for folder icon', () => {
    const { container } = render(
      <DialItemIcon
        name="Custom Folder"
        type={DialItemType.Folder}
        size={32}
        stroke={2}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('width')).toBe('32');
    expect(svg!.getAttribute('stroke-width')).toBe('2');
  });

  test('returns null when unknown type is provided', () => {
    const { container } = render(
      // @ts-expect-error testing invalid type handling
      <DialItemIcon name="unknown" type="unknown" />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders file icon even when extension is missing', () => {
    render(<DialItemIcon name="noextension" type={DialItemType.File} />);
    const el = screen.getByRole('img', { name: /File type icon/i });
    expect(el).toBeInTheDocument();
  });
});
