import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { BadgeColor, BadgeVariant } from '@/types/badge';
import { Badge } from './Badge';

const rootOf = (label: string) =>
  screen.getByText(label).parentElement as HTMLElement;

describe('Dial UI Kit :: Badge', () => {
  test('shows its label as plain text, not as a control', () => {
    render(<Badge label="Translation" />);

    expect(screen.getByText('Translation')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('is outlined by default, with the neutral type scale', () => {
    render(<Badge label="Translation" />);

    expect(rootOf('Translation')).toHaveClass(
      'border',
      'border-tertiary',
      'bg-layer-sunken',
      'text-secondary',
      'rounded-md',
    );
    expect(screen.getByText('Translation')).toHaveClass('dial-tiny-text');
  });

  test('draws a filled pill in the requested colour, with the lead type scale', () => {
    render(
      <Badge
        label="Featured"
        variant={BadgeVariant.Filled}
        color={BadgeColor.Green}
      />,
    );

    expect(rootOf('Featured')).toHaveClass(
      'rounded-full',
      'bg-green-2',
      'text-green-1',
    );
    expect(rootOf('Featured')).not.toHaveClass('border');
    expect(screen.getByText('Featured')).toHaveClass(
      'dial-caption-lead-semi-text',
    );
  });

  test('defaults a filled badge to blue', () => {
    render(<Badge label="Featured" variant={BadgeVariant.Filled} />);

    expect(rootOf('Featured')).toHaveClass('bg-blue', 'text-blue');
  });

  test('ignores color on an outlined badge', () => {
    render(<Badge label="Translation" color={BadgeColor.Red} />);

    expect(rootOf('Translation')).not.toHaveClass('bg-red');
    expect(rootOf('Translation')).toHaveClass('bg-layer-sunken');
  });

  test('replaces the type scale with textClassName', () => {
    render(<Badge label="Translation" textClassName="dial-small-text" />);

    expect(screen.getByText('Translation')).toHaveClass('dial-small-text');
    expect(screen.getByText('Translation')).not.toHaveClass('dial-tiny-text');
  });

  test('renders a decorative icon before the label', () => {
    render(<Badge label="Featured" icon={<svg data-icon />} />);

    const icon = rootOf('Featured').firstElementChild as HTMLElement;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.querySelector('svg')).not.toBeNull();
  });

  test('passes native attributes through and keeps the public class', () => {
    render(
      <Badge label="Translation" className="ms-2" title="Topic: Translation" />,
    );

    expect(rootOf('Translation')).toHaveAttribute(
      'title',
      'Topic: Translation',
    );
    expect(rootOf('Translation')).toHaveClass('ms-2', 'dial-kit-badge');
  });
});
