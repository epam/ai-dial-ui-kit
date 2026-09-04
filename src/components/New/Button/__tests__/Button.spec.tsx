import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Button } from '../Button';
import { LinkButton } from '../ButtonWrappers';
import { ButtonAppearance, ButtonVariant } from '@/index';
import { ElementSize } from '@/types/size';

describe('Dial UI Kit :: DialButton', () => {
  test('Should render with string label and be accessible by role', () => {
    render(<Button label="Click me" />);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('Should render with ReactNode label and aria-label', () => {
    render(
      <Button
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
    render(<Button label="Clickable Button" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clickable Button' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should be disabled when disabled prop is true', () => {
    render(<Button label="Disabled" disabled />);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  test('Should render iconBefore and iconAfter', () => {
    render(
      <Button
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
      <Button
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
    render(<Button label="Styled" className="custom-button-class" />);
    const button = screen.getByRole('button', { name: 'Styled' });
    expect(button).toHaveClass('custom-button-class');
  });

  test('Should apply custom CSS class to button text with textClassName prop', () => {
    render(
      <Button
        label="Custom Text"
        textClassName="custom-text-class font-bold"
      />,
    );
    const titleSpan = screen.getByText('Custom Text');
    expect(titleSpan).toHaveClass('custom-text-class', 'font-bold');
  });

  test('Should apply small size classes', () => {
    render(<Button label="Small button" size={ElementSize.Small} />);
    const button = screen.getByRole('button', { name: 'Small button' });
    expect(button).toHaveClass(
      'h-[24px]',
      'px-2',
      'dial-tiny-semi-text',
      'dial-kit-base-button-small',
    );
  });

  test('Should take the corner radius from the base class at standard size', () => {
    render(<Button label="Standard button" />);

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-base-button-small',
    );
  });

  test('Should not apply height/padding classes for link appearance', () => {
    render(
      <Button
        label="Link button"
        variant={ButtonVariant.Primary}
        appearance={ButtonAppearance.Link}
      />,
    );
    const button = screen.getByRole('button', { name: 'Link button' });
    expect(button).not.toHaveClass('size-[40px]', 'px-3');
  });

  test('Should show the tooltip on hover and describe the button itself', async () => {
    const user = userEvent.setup();

    render(<Button label="Tooltip button" tooltipProps={{ tooltip: 'Tip' }} />);
    const button = screen.getByRole('button', { name: 'Tooltip button' });

    await user.hover(button);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Tip');
    // The 2.0 tooltip is rendered with `asChild`, so `aria-describedby` lands
    // on the button rather than on a wrapper <span> a reader never reaches.
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
  });

  test('Should use aria-label when label is ReactNode', () => {
    render(
      <Button label={<span>Icon Label</span>} aria-label="Custom aria label" />,
    );
    expect(
      screen.getByRole('button', { name: 'Custom aria label' }),
    ).toBeInTheDocument();
  });

  test('Should prefer string label over native "aria-label" from properties for aria-label', () => {
    render(<Button label="Button label" aria-label="Aria label" />);
    const button = screen.getByRole('button', { name: 'Button label' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Button label');
  });

  test('Should use aria-label prop when label is ReactNode', () => {
    render(
      <Button
        label={<span>React Node Label</span>}
        aria-label="Accessible label"
      />,
    );
    const button = screen.getByRole('button', { name: 'Accessible label' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Accessible label');
    expect(screen.getByText('React Node Label')).toBeInTheDocument();
  });

  test('Should name an icon-only button from the tooltip text', () => {
    render(
      <Button
        iconBefore={<span>Icon</span>}
        tooltipProps={{ tooltip: 'Save' }}
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Save');
  });

  test('Should prefer aria-label over the tooltip text on an icon-only button', () => {
    render(
      <Button
        iconBefore={<span>Icon</span>}
        aria-label="Save draft"
        tooltipProps={{ tooltip: 'Save' }}
      />,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Save draft');
  });

  test('Should not let the tooltip override a ReactNode label', () => {
    render(
      <Button
        label={<span>Visible label</span>}
        tooltipProps={{ tooltip: 'Tooltip text' }}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).toHaveAccessibleName('Visible label');
  });

  test('Should enhance the pointer target at standard size', () => {
    render(<Button label="Save" />);

    expect(screen.getByRole('button')).toHaveClass('dial-kit-enhanced-target');
  });

  test('Should not enhance the pointer target at small size', () => {
    render(<Button label="Save" size={ElementSize.Small} />);

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });

  test('Should not enhance the pointer target for link appearance', () => {
    render(
      <Button
        label="Save"
        variant={ButtonVariant.Primary}
        appearance={ButtonAppearance.Link}
      />,
    );

    expect(screen.getByRole('button')).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });

  test('Should have correct button type', () => {
    render(<Button label="Type test" />);
    const button = screen.getByRole('button', { name: 'Type test' });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('Should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button label="Disabled click" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Disabled click' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('Should pass mouse event to onClick handler', () => {
    const onClick = vi.fn();
    render(<Button label="Event test" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Event test' }));
    expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  describe('href', () => {
    test('Should render a link, not a button, when href is given', () => {
      render(<LinkButton label="Read the docs" href="/docs" />);

      const link = screen.getByRole('link', { name: 'Read the docs' });
      expect(link).toHaveAttribute('href', '/docs');
      expect(link.tagName).toBe('A');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('Should keep the link appearance classes on the anchor', () => {
      render(<LinkButton label="Read the docs" href="/docs" />);

      const link = screen.getByRole('link', { name: 'Read the docs' });
      expect(link).toHaveClass('dial-kit-primary-link-button');
      // Exempt from 2.5.5 under the Inline exception, same as the button form.
      expect(link).not.toHaveClass('dial-kit-enhanced-target');
    });

    test('Should stay a button when href is absent', () => {
      render(<LinkButton label="Act" onClick={() => undefined} />);

      expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    test('Should not put button-only attributes on the anchor', () => {
      render(<LinkButton label="Read the docs" href="/docs" />);

      const link = screen.getByRole('link', { name: 'Read the docs' });
      expect(link).not.toHaveAttribute('type');
      expect(link).not.toHaveAttribute('disabled');
    });

    test('Should sever the opener for target="_blank"', () => {
      render(
        <LinkButton
          label="External"
          href="https://example.com"
          target="_blank"
        />,
      );

      const link = screen.getByRole('link', { name: 'External' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('Should let an explicit rel win over the _blank default', () => {
      render(
        <LinkButton
          label="External"
          href="https://example.com"
          target="_blank"
          rel="nofollow"
        />,
      );

      expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
        'rel',
        'nofollow',
      );
    });

    test('Should not set rel when there is no _blank target', () => {
      render(<LinkButton label="Internal" href="/docs" />);

      expect(
        screen.getByRole('link', { name: 'Internal' }),
      ).not.toHaveAttribute('rel');
    });

    test('Should make a disabled link unreachable and unfollowable', () => {
      const onClick = vi.fn();
      render(
        <LinkButton
          label="Unavailable"
          href="/docs"
          disabled
          onClick={onClick}
        />,
      );

      // An anchor has no disabled state, so `getByRole('link')` no longer
      // matches once the href is gone — query the element directly.
      const link = screen.getByText('Unavailable').closest('a');
      expect(link).not.toBeNull();
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');

      fireEvent.click(link as HTMLAnchorElement);
      expect(onClick).not.toHaveBeenCalled();
    });

    test('Should not mark an enabled link aria-disabled', () => {
      render(<LinkButton label="Available" href="/docs" />);

      expect(
        screen.getByRole('link', { name: 'Available' }),
      ).not.toHaveAttribute('aria-disabled');
    });

    test('Should name an icon-only link from aria-label', () => {
      render(
        <LinkButton
          href="/docs"
          iconBefore={<span aria-hidden="true">→</span>}
          aria-label="Read the docs"
        />,
      );

      expect(
        screen.getByRole('link', { name: 'Read the docs' }),
      ).toBeInTheDocument();
    });
  });

  test.each([
    [
      ButtonVariant.Primary,
      ButtonAppearance.Solid,
      'dial-kit-primary-solid-button',
    ],
    [
      ButtonVariant.Primary,
      ButtonAppearance.Ghost,
      'dial-kit-primary-ghost-button',
    ],
    [
      ButtonVariant.Primary,
      ButtonAppearance.Link,
      'dial-kit-primary-link-button',
    ],
    [
      ButtonVariant.Neutral,
      ButtonAppearance.Outlined,
      'dial-kit-neutral-outlined-button',
    ],
  ])(
    'applies mapped class for variant %s',
    (variant, appearance, expectedClass) => {
      render(
        <Button label="Click me" variant={variant} appearance={appearance} />,
      );

      const btn = screen.getByRole('button', { name: 'Click me' });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveClass(expectedClass);
    },
  );
});
