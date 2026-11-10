import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { LinkVariant } from '@/types/link';
import { ElementSize } from '@/types/size';
import { Link } from './Link';

describe('Dial UI Kit :: Link', () => {
  test('Should render a named link with its href and the base class', () => {
    render(<Link href="/docs">Read the docs</Link>);

    const link = screen.getByRole('link', { name: 'Read the docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass('dial-kit-base-link');
  });

  test('Should default to the primary variant at standard size', () => {
    render(<Link href="/docs">Docs</Link>);

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass(
      'dial-kit-link-primary',
      'dial-small-paragraph-semi-text',
    );
  });

  test.each([
    [
      LinkVariant.Primary,
      'dial-kit-link-primary',
      'dial-small-paragraph-semi-text',
      'dial-tiny-semi-text',
    ],
    [
      LinkVariant.Neutral,
      'dial-kit-link-neutral',
      'dial-small-paragraph-text',
      'dial-tiny-text',
    ],
    [
      LinkVariant.Inverted,
      'dial-kit-link-inverted',
      'dial-small-paragraph-semi-text',
      'dial-tiny-semi-text',
    ],
  ])(
    'Should apply the %s variant and its typography at both sizes',
    (variant, variantClass, standardClass, smallClass) => {
      const { rerender } = render(
        <Link href="/docs" variant={variant}>
          Docs
        </Link>,
      );
      const link = screen.getByRole('link', { name: 'Docs' });
      expect(link).toHaveClass(variantClass, standardClass);
      expect(link).not.toHaveClass(smallClass);

      rerender(
        <Link href="/docs" variant={variant} size={ElementSize.Small}>
          Docs
        </Link>,
      );
      expect(link).toHaveClass(variantClass, smallClass);
      expect(link).not.toHaveClass(standardClass);
    },
  );

  test('Should render an undesigned Large size as Standard', () => {
    render(
      <Link href="/docs" size={ElementSize.Large}>
        Docs
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass(
      'dial-small-paragraph-semi-text',
    );
  });

  test('Should sever the opener for target="_blank"', () => {
    render(
      <Link href="https://example.com" target="_blank">
        External
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Should let an explicit rel win over the _blank default', () => {
    render(
      <Link href="https://example.com" target="_blank" rel="noopener">
        External
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'rel',
      'noopener',
    );
  });

  test('Should not set rel without a _blank target', () => {
    render(<Link href="/docs">Internal</Link>);

    expect(screen.getByRole('link', { name: 'Internal' })).not.toHaveAttribute(
      'rel',
    );
  });

  test('Should call onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event) => event.preventDefault());
    render(
      <Link href="#docs" onClick={onClick}>
        Docs
      </Link>,
    );

    await user.click(screen.getByRole('link', { name: 'Docs' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  describe('disabled', () => {
    test('Should keep the link role and be marked unavailable', () => {
      render(
        <Link href="/docs" disabled>
          Unavailable
        </Link>,
      );

      const link = screen.getByRole('link', { name: 'Unavailable' });
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
    });

    test('Should not call onClick', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Link href="/docs" disabled onClick={onClick}>
          Unavailable
        </Link>,
      );

      await user.click(screen.getByRole('link', { name: 'Unavailable' }));
      expect(onClick).not.toHaveBeenCalled();
    });

    test('Should leave the tab order', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Link href="/disabled" disabled>
            Unavailable
          </Link>
          <Link href="/next">Next</Link>
        </>,
      );

      await user.tab();
      expect(screen.getByRole('link', { name: 'Next' })).toHaveFocus();
    });
  });

  test('Should not mark an enabled link aria-disabled or override its role', () => {
    render(<Link href="/docs">Available</Link>);

    const link = screen.getByRole('link', { name: 'Available' });
    expect(link).not.toHaveAttribute('aria-disabled');
    expect(link).not.toHaveAttribute('role');
  });

  test('Should keep a caller tabIndex when enabled', () => {
    render(
      <Link href="/docs" tabIndex={-1}>
        Docs
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  test('Should merge a custom className', () => {
    render(
      <Link href="/docs" className="custom-link">
        Docs
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass(
      'dial-kit-base-link',
      'custom-link',
    );
  });

  test('Should not enhance the pointer target of an inline link', () => {
    render(<Link href="/docs">Docs</Link>);

    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveClass(
      'dial-kit-enhanced-target',
    );
  });
});
