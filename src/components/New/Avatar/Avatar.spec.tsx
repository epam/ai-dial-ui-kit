import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { AvatarColor, AvatarShape } from '@/types/avatar';
import { AVATAR_PALETTE, pickAvatarColor } from '@/utils/avatar';
import { Avatar } from './Avatar';

describe('Dial UI Kit :: Avatar', () => {
  test('shows the initials derived from the name', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  test('shows the initials it is given instead of deriving them', () => {
    render(<Avatar name="Ada Lovelace" initials="A" />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('AL')).toBeNull();
  });

  test('shows "?" for a name with no letters', () => {
    render(<Avatar name="" />);

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  test('is decorative without alt, and a named image with it', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('AL').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    rerender(<Avatar name="Ada Lovelace" alt="Ada Lovelace" />);

    expect(
      screen.getByRole('img', { name: 'Ada Lovelace' }),
    ).toBeInTheDocument();
  });

  test('paints the initials in the colour pair picked for the name', () => {
    render(<Avatar name="Ada Lovelace" />);
    const { background, foreground } = pickAvatarColor('Ada Lovelace');
    const root = screen.getByText('AL').parentElement;

    expect(root).toHaveClass(background);
    expect(root).toHaveClass(foreground);
  });

  test('paints the initials in a given colour pair instead of the picked one', () => {
    const picked = pickAvatarColor('Ada Lovelace');
    const entries = Object.values(AVATAR_PALETTE);
    /* The entry after the picked one, so the override is proven. */
    const color = entries[(entries.indexOf(picked) + 1) % entries.length];
    render(<Avatar name="Ada Lovelace" color={color} />);
    const root = screen.getByText('AL').parentElement;

    expect(root).toHaveClass(color.background);
    expect(root).toHaveClass(color.foreground);
    expect(root).not.toHaveClass(picked.background);
  });

  test('falls back to the initials on the given colour pair when the image fails', () => {
    const color = AVATAR_PALETTE[AvatarColor.Violet1];
    render(
      <Avatar name="Ada Lovelace" src="/broken.png" alt="Ada" color={color} />,
    );

    fireEvent.error(screen.getByRole('img', { name: 'Ada' }));

    const root = screen.getByText('AL').parentElement;
    expect(root).toHaveClass(color.background);
    expect(root).toHaveClass(color.foreground);
  });

  test('sizes itself and its initials from size', () => {
    render(<Avatar name="Ada Lovelace" size={40} />);
    const root = screen.getByText('AL').parentElement as HTMLElement;

    expect(root.style.width).toBe('40px');
    expect(root.style.height).toBe('40px');
    expect(root.style.fontSize).toBe('16px');
  });

  test('leaves the font size to textClassName when one is given', () => {
    render(<Avatar name="Ada Lovelace" textClassName="dial-tiny-text" />);

    expect(screen.getByText('AL')).toHaveClass('dial-tiny-text');
    expect(
      (screen.getByText('AL').parentElement as HTMLElement).style.fontSize,
    ).toBe('');
  });

  test('is a circle by default and a rounded square on request', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText('AL').parentElement).toHaveClass('rounded-full');

    rerender(<Avatar name="Summarizer" shape={AvatarShape.Square} />);

    expect(screen.getByText('SU').parentElement).toHaveClass('rounded-md');
  });

  test('shows the image when src is given, named by alt', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" alt="Ada Lovelace" />);

    const image = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(image.tagName).toBe('IMG');
    expect(image).toHaveAttribute('src', '/ada.png');
    expect(screen.queryByText('AL')).toBeNull();
  });

  test('falls back to the initials when the image fails, and reports it', () => {
    const onImageError = vi.fn();
    render(
      <Avatar
        name="Ada Lovelace"
        src="/broken.png"
        alt="Ada Lovelace"
        onImageError={onImageError}
      />,
    );

    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }));

    expect(onImageError).toHaveBeenCalledOnce();
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).tagName).not.toBe(
      'IMG',
    );
  });

  test('tries a new src again after an earlier one failed', () => {
    const { rerender } = render(
      <Avatar name="Ada Lovelace" src="/broken.png" alt="Ada" />,
    );
    fireEvent.error(screen.getByRole('img', { name: 'Ada' }));

    rerender(<Avatar name="Ada Lovelace" src="/ada.png" alt="Ada" />);

    expect(screen.getByRole('img', { name: 'Ada' })).toHaveAttribute(
      'src',
      '/ada.png',
    );
  });

  test('carries the public class on the image and on the initials', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText('AL').parentElement).toHaveClass('dial-kit-avatar');

    rerender(<Avatar name="Ada Lovelace" src="/ada.png" alt="Ada" />);

    expect(screen.getByRole('img', { name: 'Ada' })).toHaveClass(
      'dial-kit-avatar',
    );
  });
});
