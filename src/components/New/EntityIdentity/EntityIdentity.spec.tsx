import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { EntityType } from '@/types/entity-type';
import { EntityIdentity } from './EntityIdentity';

const model = {
  type: EntityType.Model,
  name: 'Google Gemini Flash',
  version: '1.0.3',
};

describe('Dial UI Kit :: EntityIdentity', () => {
  test('shows the name as a level-3 heading by default', () => {
    render(<EntityIdentity item={model} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Google Gemini Flash' }),
    ).toBeInTheDocument();
  });

  test('renders the name at the requested heading level', () => {
    render(<EntityIdentity item={model} headingLevel={4} />);

    expect(
      screen.getByRole('heading', { level: 4, name: 'Google Gemini Flash' }),
    ).toBeInTheDocument();
  });

  test('shows the version next to the name', () => {
    render(<EntityIdentity item={model} />);

    expect(screen.getByText('1.0.3')).toBeInTheDocument();
  });

  test('hides the version when showVersion is false', () => {
    render(<EntityIdentity item={model} showVersion={false} />);

    expect(screen.queryByText('1.0.3')).toBeNull();
  });

  test('labels the type in English by default, uppercased and coloured by type', () => {
    render(<EntityIdentity item={{ ...model, type: EntityType.Agent }} />);

    const label = screen.getByText('Agent');
    expect(label).toHaveClass('uppercase', 'text-green-1');
  });

  test('uses the type label it is given', () => {
    render(<EntityIdentity item={model} labels={{ type: 'Modèle' }} />);

    expect(screen.getByText('Modèle')).toHaveClass('text-blue');
    expect(screen.queryByText('Model')).toBeNull();
  });

  test('falls back to the initials of the name without an icon', () => {
    render(<EntityIdentity item={model} />);

    expect(screen.getByText('GG')).toBeInTheDocument();
  });

  test('shows the featured chip only for a featured entity with the tag enabled', () => {
    const { rerender } = render(<EntityIdentity item={model} />);
    expect(screen.queryByText('Featured')).toBeNull();

    rerender(<EntityIdentity item={{ ...model, isFeatured: true }} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();

    rerender(
      <EntityIdentity
        item={{ ...model, isFeatured: true }}
        hasFeaturedTag={false}
      />,
    );
    expect(screen.queryByText('Featured')).toBeNull();
  });

  test('uses the featured label it is given', () => {
    render(
      <EntityIdentity
        item={{ ...model, isFeatured: true }}
        labels={{ featured: 'Recommandé' }}
      />,
    );

    expect(screen.getByText('Recommandé')).toBeInTheDocument();
  });

  test('highlights the query in the name', () => {
    render(<EntityIdentity item={model} query="gemini" />);

    expect(screen.getByText('Gemini').tagName).toBe('MARK');
  });

  test('renders the footer and the status badge', () => {
    render(
      <EntityIdentity
        item={model}
        footer={<span>Personal</span>}
        statusBadge={<span>New</span>}
      />,
    );

    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });
});
