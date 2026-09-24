import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { FolderName } from './FolderName';

describe('Dial UI Kit :: FolderName', () => {
  test('renders the name', () => {
    render(<FolderName name="Organization" />);

    expect(screen.getByText('Organization')).toBeInTheDocument();
  });

  test('draws the folder glyph even for a dotted name', () => {
    const { container } = render(<FolderName name="v1.2.png" />);

    expect(
      container
        .querySelector('linearGradient')
        ?.id.startsWith('dial-kit-folder-gradient-'),
    ).toBe(true);
  });

  test('keeps the icon out of the accessibility tree', () => {
    render(<FolderName name="Organization" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('announces the shared state', () => {
    render(<FolderName name="Organization" shared />);

    expect(screen.getByText('Shared')).toHaveClass('sr-only');
  });

  test('announces a loading folder as a status', () => {
    render(<FolderName name="Uploads" loading loadingLabel="Opening" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Opening' })).toBeInTheDocument();
  });

  test('stamps both public classes, keeping the caller className', () => {
    const { container } = render(
      <FolderName name="Organization" className="custom" />,
    );

    expect(container.firstChild).toHaveClass(
      'custom',
      DIAL_KIT_CLASS.fileName,
      DIAL_KIT_CLASS.folderName,
    );
  });
});
