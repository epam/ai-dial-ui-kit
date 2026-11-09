import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { EntityType } from '@/types/entity-type';
import { SelectedEntityCard } from './SelectedEntityCard';

const model = {
  type: EntityType.Model,
  name: 'Google Gemini Flash',
  version: '1.0.3',
};

describe('Dial UI Kit :: SelectedEntityCard', () => {
  test('shows the selected entity as a level-4 heading', () => {
    render(<SelectedEntityCard entityId="gemini-flash" item={model} />);

    expect(
      screen.getByRole('heading', { level: 4, name: 'Google Gemini Flash' }),
    ).toBeInTheDocument();
  });

  test('shows the type label unless showType is false', () => {
    const { rerender } = render(
      <SelectedEntityCard
        entityId="gemini-flash"
        item={model}
        labels={{ type: 'Model' }}
      />,
    );
    expect(screen.getByText('Model')).toBeVisible();

    rerender(
      <SelectedEntityCard
        entityId="gemini-flash"
        item={model}
        labels={{ type: 'Model' }}
        showType={false}
      />,
    );
    expect(screen.queryByText('Model')).toBeNull();
  });

  test('shows the details under the name', () => {
    render(
      <SelectedEntityCard
        entityId="gemini-flash"
        item={model}
        details="Effort: high"
      />,
    );

    expect(screen.getByText('Effort: high')).toBeInTheDocument();
  });

  test('shows the raw id, with its details, when the catalog does not list it', () => {
    render(
      <SelectedEntityCard entityId="my-deployment" details="Effort: high" />,
    );

    expect(screen.getByText('my-deployment')).toBeInTheDocument();
    expect(screen.getByText('Effort: high')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  test('shows a skeleton instead of the entity while loading', () => {
    render(
      <SelectedEntityCard entityId="gemini-flash" item={model} isLoading />,
    );

    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByText('gemini-flash')).toBeNull();
  });

  test('shows the placeholder when nothing is selected, even while loading', () => {
    render(
      <SelectedEntityCard
        entityId=""
        isLoading
        labels={{ placeholder: 'Select model' }}
      />,
    );

    expect(screen.getByText('Select model')).toBeInTheDocument();
  });

  test('falls back to an English placeholder', () => {
    render(<SelectedEntityCard entityId="" />);

    expect(screen.getByText('Not selected')).toBeInTheDocument();
  });

  test('shows the error under the card and turns its border red', () => {
    const { container } = render(
      <SelectedEntityCard entityId="" error="No model" />,
    );

    expect(screen.getByText('No model')).toBeInTheDocument();
    expect(
      container.querySelector('.dial-kit-selected-entity-card'),
    ).toHaveClass('border-error');
  });

  test('dims the card when disabled', () => {
    const { container } = render(
      <SelectedEntityCard entityId="gemini-flash" item={model} isDisabled />,
    );

    expect(
      container.querySelector('.dial-kit-selected-entity-card'),
    ).toHaveClass('opacity-50');
  });
});
