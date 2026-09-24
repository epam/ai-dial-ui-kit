import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { SharedEntityIndicator } from './SharedEntityIndicator';

describe('Dial UI Kit :: SharedEntityIndicator', () => {
  test('is an image named "Shared" by default', () => {
    render(<SharedEntityIndicator />);

    expect(screen.getByRole('img', { name: 'Shared' })).toBeInTheDocument();
  });

  test('takes a custom accessible name', () => {
    render(<SharedEntityIndicator label="Спільний" />);

    expect(screen.getByRole('img', { name: 'Спільний' })).toBeInTheDocument();
  });

  test('shows the default tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<SharedEntityIndicator label="Shared entity" />);

    await user.hover(screen.getByRole('img', { name: 'Shared entity' }));

    expect(await screen.findByText('Shared')).toBeInTheDocument();
  });

  test('shows a custom tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<SharedEntityIndicator tooltip="Shared with 3 people" />);

    await user.hover(screen.getByRole('img', { name: 'Shared' }));

    expect(await screen.findByText('Shared with 3 people')).toBeInTheDocument();
  });

  test('draws the arrow at the given size and the 2.0 stroke, hidden from AT', () => {
    const { container } = render(<SharedEntityIndicator size={20} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('stroke-width', String(DIAL_KIT_ICON_STROKE));
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  test('merges className onto the badge', () => {
    render(<SharedEntityIndicator className="absolute" />);

    expect(screen.getByRole('img', { name: 'Shared' })).toHaveClass('absolute');
  });
});
