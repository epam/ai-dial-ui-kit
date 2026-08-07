import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialButton } from '../Button';
import { ButtonAppearance, ButtonVariant } from '@/index';
import { ElementSize } from '@/types/size';

describe('Dial UI Kit :: DialButton', () => {
  test('Should render with string label and be accessible by role', () => {
    render(<DialButton label="Click me" />);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('Should render with ReactNode label and aria-label', () => {
    render(
      <DialButton
        label={
          <span>
            Custom <strong>Label</strong>
          </span>
        }
        aria-label="Custom button"
      />,
    );
    const button = screen.getByRole('button', { name: 'Custom button' });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Custom', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  test('Should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DialButton label="Clickable Button" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clickable Button' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<DialButton label="Disabled" disabled hideTitleOnMobile />);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  test('Should render iconBefore and iconAfter', () => {
    render(
      <DialButton
        label="With Icons"
        iconBefore={<span>Before</span>}
        iconAfter={<span>After</span>}
      />,
    );
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  test('Should render without label when only icons are provided', () => {
    render(
      <DialButton
        iconBefore={
          <span role="img" aria-label="icon">
            Icon
          </span>
        }
        aria-label="Icon button"
      />,
    );
    const button = screen.getByRole('button', { name: 'Icon button' });
    expect(button).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'icon' })).toBeInTheDocument();
    expect(screen.queryByText('Icon button')).not.toBeInTheDocument();
  });

  test('Should apply custom CSS class', () => {
    render(<DialButton label="Styled" className="custom-button-class" />);
    const button = screen.getByRole('button', { name: 'Styled' });
    expect(button).toHaveClass('custom-button-class');
  });

  test('Should apply custom CSS class to button text with textClassName prop', () => {
    render(
      <DialButton
        label="Custom Text"
        textClassName="custom-text-class font-bold"
      />,
    );
    const titleSpan = screen.getByText('Custom Text');
    expect(titleSpan).toHaveClass('custom-text-class', 'font-bold');
  });

  test('Should apply focus-visible outline classes', () => {
    render(<DialButton label="Focus test" />);
    const button = screen.getByRole('button', { name: 'Focus test' });
    expect(button).toHaveClass(
      'focus-visible:outline',
      'focus-visible:outline-focus-black',
      'outline-offset-0',
    );
  });

  test('Should hide label on mobile when hideTitleOnMobile is true', () => {
    render(<DialButton label="Mobile test" hideTitleOnMobile />);
    const titleSpan = screen.getByText('Mobile test');
    expect(titleSpan).toHaveClass('hidden', 'sm:inline');
  });

  test('Should show label on all devices when hideTitleOnMobile is false', () => {
    render(<DialButton label="Desktop test" hideTitleOnMobile={false} />);
    const titleSpan = screen.getByText('Desktop test');
    expect(titleSpan).toHaveClass('inline');
    expect(titleSpan).not.toHaveClass('hidden');
  });

  test('Should use aria-label when label is ReactNode', () => {
    render(
      <DialButton
        label={<span>Icon Label</span>}
        aria-label="Custom aria label"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Custom aria label' }),
    ).toBeInTheDocument();
  });

  test('Should prefer string label over native "aria-label" from properties for aria-label', () => {
    render(<DialButton label="Button label" aria-label="Aria label" />);
    const button = screen.getByRole('button', { name: 'Button label' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Button label');
  });

  test('Should use aria-label prop when label is ReactNode', () => {
    render(
      <DialButton
        label={<span>React Node Label</span>}
        aria-label="Accessible label"
      />,
    );
    const button = screen.getByRole('button', { name: 'Accessible label' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Accessible label');
    expect(screen.getByText('React Node Label')).toBeInTheDocument();
  });

  test('Should have correct button type', () => {
    render(<DialButton label="Type test" />);
    const button = screen.getByRole('button', { name: 'Type test' });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('Should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<DialButton label="Disabled click" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Disabled click' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should pass mouse event to onClick handler', () => {
    const onClick = vi.fn();
    render(<DialButton label="Event test" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Event test' }));
    expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  test.each([
    [
      ButtonVariant.Primary,
      ButtonAppearance.Solid,
      'dial-primary-solid-button',
    ],
    [
      ButtonVariant.Primary,
      ButtonAppearance.Ghost,
      'dial-primary-ghost-button',
    ],
    [ButtonVariant.Primary, ButtonAppearance.Link, 'dial-primary-link-button'],
    [
      ButtonVariant.Neutral,
      ButtonAppearance.Outlined,
      'dial-neutral-outlined-button',
    ],
  ])(
    'applies mapped class for variant %s',
    (variant, appearance, expectedClass) => {
      render(
        <DialButton
          label="Click me"
          variant={variant}
          appearance={appearance}
        />,
      );

      const btn = screen.getByRole('button', { name: 'Click me' });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveClass(expectedClass);
    },
  );

  test('Should enhance the pointer target at standard size', () => {
    render(<DialButton label="Save" />);

    expect(screen.getByRole('button')).toHaveClass('dial-kit-enhanced-target');
  });

  test('Should not enhance the pointer target at small size', () => {
    render(<DialButton label="Save" size={ElementSize.Small} />);

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });

  test('Should not enhance the pointer target for link appearance', () => {
    render(
      <DialButton
        label="Save"
        variant={ButtonVariant.Primary}
        appearance={ButtonAppearance.Link}
      />,
    );

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });
});
