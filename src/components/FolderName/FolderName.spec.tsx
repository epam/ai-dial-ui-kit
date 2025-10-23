import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialFolderName } from './FolderName';

describe('Dial UI Kit :: DialFolderName', () => {
  test('renders folder name text', () => {
    render(<DialFolderName name="Organization" />);
    expect(screen.getByText('Organization')).toBeInTheDocument();
  });

  test('renders folder icon', () => {
    render(<DialFolderName name="Organization" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders shared indicator when shared=true', () => {
    render(<DialFolderName name="Organization" shared />);
    expect(
      screen.getByRole('img', { name: 'Shared entity' }),
    ).toBeInTheDocument();
  });
});
