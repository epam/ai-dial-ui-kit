import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { InfoButton } from './InfoButton';

describe('Dial UI Kit :: InfoButton', () => {
  test('Should render nothing without a caption', () => {
    const { container } = render(<InfoButton />);
    expect(container.firstChild).toBeNull();
  });

  test('Should use the caption as the accessible name', () => {
    render(<InfoButton caption="Digits only" />);

    expect(screen.getByRole('button')).toHaveAccessibleName('Digits only');
  });

  test('Should let aria-label override the caption', () => {
    render(
      <InfoButton
        caption="Only digits, no spaces or country prefix"
        aria-label="Phone number help"
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName(
      'Phone number help',
    );
  });

  test('Should hide the decorative icon from assistive tech', () => {
    const { container } = render(<InfoButton caption="Digits only" />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  test('Should show the caption in a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<InfoButton caption="Digits only" />);

    await user.hover(screen.getByRole('button'));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Digits only');
  });

  test('Should not enhance the pointer target of the small affordance', () => {
    render(<InfoButton caption="Digits only" />);

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });

  test('Should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<InfoButton caption="Digits only" onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
