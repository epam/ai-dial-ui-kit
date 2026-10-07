import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { StarterButton } from '../ButtonWrappers';
import { ButtonAppearance } from '@/types/button';
import { ElementSize } from '@/types/size';

describe('Dial UI Kit :: StarterButton', () => {
  test('Should render the starter outlined styles with an accessible name', () => {
    render(<StarterButton label="Summarize" />);
    const button = screen.getByRole('button', { name: 'Summarize' });
    expect(button).toHaveClass(
      'dial-kit-base-button',
      'dial-kit-starter-outlined-button',
      'dial-kit-enhanced-target',
    );
  });

  test('Should call onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<StarterButton label="Summarize" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Summarize' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('Should not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<StarterButton label="Summarize" disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Summarize' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should not apply the enhanced target at the small size', () => {
    render(<StarterButton label="Summarize" size={ElementSize.Small} />);
    expect(screen.getByRole('button', { name: 'Summarize' })).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });

  test('Should fall back to primary solid styles for an unsupported appearance', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <StarterButton label="Summarize" appearance={ButtonAppearance.Ghost} />,
    );
    expect(screen.getByRole('button', { name: 'Summarize' })).toHaveClass(
      'dial-kit-primary-solid-button',
    );
    warn.mockRestore();
  });
  describe('icon gradient', () => {
    const Icon = () => <svg data-testid="icon" />;

    test('Should point the icon stroke at its own gradient', () => {
      const { container } = render(
        <StarterButton label="Summarize" iconBefore={<Icon />} />,
      );
      const gradients = container.querySelectorAll('linearGradient');
      expect(gradients).toHaveLength(1);
      const stroke = screen
        .getByRole('button', { name: 'Summarize' })
        .style.getPropertyValue('--dial-kit-starter-icon-stroke');
      expect(stroke).toBe(`url(#${gradients[0].id})`);
      expect(gradients[0].id).toMatch(/^dial-kit-starter-gradient-[\w-]+$/);
    });

    test('Should give every instance a distinct gradient id', () => {
      const { container } = render(
        <>
          <StarterButton label="One" iconBefore={<Icon />} />
          <StarterButton label="Two" iconBefore={<Icon />} />
        </>,
      );
      const [first, second] = container.querySelectorAll('linearGradient');
      expect(first.id).not.toBe(second.id);
    });

    test('Should render one gradient when only iconAfter is set', () => {
      const { container } = render(
        <StarterButton
          label="Summarize"
          iconBefore={null}
          iconAfter={<Icon />}
        />,
      );
      expect(container.querySelectorAll('linearGradient')).toHaveLength(1);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    test('Should render one gradient when both icons are set', () => {
      const { container } = render(
        <StarterButton
          label="Summarize"
          iconBefore={<Icon />}
          iconAfter={<Icon />}
        />,
      );
      expect(container.querySelectorAll('linearGradient')).toHaveLength(1);
      expect(screen.getAllByTestId('icon')).toHaveLength(2);
    });

    test('Should render a default sparkles icon stroked with the gradient', () => {
      const { container } = render(<StarterButton label="Summarize" />);
      expect(container.querySelectorAll('linearGradient')).toHaveLength(1);
      const icon = container.querySelector('svg.tabler-icon-sparkles');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('stroke-width', '1.5');
    });

    test('Should replace the default icon with a caller-supplied one', () => {
      const { container } = render(
        <StarterButton label="Summarize" iconBefore={<Icon />} />,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(container.querySelector('.tabler-icon-sparkles')).toBeNull();
    });

    test('Should render no gradient and no icon slot when iconBefore is null', () => {
      const { container } = render(
        <StarterButton label="Summarize" iconBefore={null} />,
      );
      expect(container.querySelector('svg')).toBeNull();
    });

    test('Should keep a caller-supplied style', () => {
      render(<StarterButton label="Summarize" style={{ width: '200px' }} />);
      expect(screen.getByRole('button', { name: 'Summarize' })).toHaveStyle({
        width: '200px',
      });
    });
  });
});
