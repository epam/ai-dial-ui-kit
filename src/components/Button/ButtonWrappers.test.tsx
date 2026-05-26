import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import {
  DialPrimaryButton,
  DialNeutralButton,
  DialDangerButton,
  DialLinkButton,
  DialGhostButton,
} from './ButtonWrappers';
import { ButtonVariant, ButtonAppearance } from '@/types/button';

describe('Dial UI Kit :: ButtonWrappers', () => {
  describe('DialPrimaryButton', () => {
    it('renders with label', () => {
      const { getByRole } = render(<DialPrimaryButton label="Primary" />);
      const button = getByRole('button', { name: 'Primary' });
      expect(button).toBeTruthy();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialPrimaryButton label="Click me" onClick={handleClick} />,
      );
      const button = getByRole('button', { name: 'Click me' });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialPrimaryButton label="Disabled" onClick={handleClick} disabled />,
      );
      const button = getByRole('button', { name: 'Disabled' });
      expect(button).toHaveProperty('disabled', true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('accepts custom className', () => {
      const { getByRole } = render(
        <DialPrimaryButton label="Custom" className="custom-class" />,
      );
      const button = getByRole('button', { name: 'Custom' });
      expect(button.className).toContain('custom-class');
    });

    it('allows appearance override', () => {
      const { getByRole } = render(
        <DialPrimaryButton
          label="Outlined Primary"
          appearance={ButtonAppearance.Outlined}
        />,
      );
      const button = getByRole('button', { name: 'Outlined Primary' });
      expect(button).toBeTruthy();
    });
  });

  describe('DialNeutralButton', () => {
    it('renders with label', () => {
      const { getByRole } = render(<DialNeutralButton label="Neutral" />);
      const button = getByRole('button', { name: 'Neutral' });
      expect(button).toBeTruthy();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialNeutralButton label="Click me" onClick={handleClick} />,
      );
      const button = getByRole('button', { name: 'Click me' });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialNeutralButton label="Disabled" onClick={handleClick} disabled />,
      );
      const button = getByRole('button', { name: 'Disabled' });
      expect(button).toHaveProperty('disabled', true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('allows appearance override', () => {
      const { getByRole } = render(
        <DialNeutralButton
          label="Solid Neutral"
          appearance={ButtonAppearance.Solid}
        />,
      );
      const button = getByRole('button', { name: 'Solid Neutral' });
      expect(button).toBeTruthy();
    });
  });

  describe('DialDangerButton', () => {
    it('renders with label', () => {
      const { getByRole } = render(<DialDangerButton label="Error" />);
      const button = getByRole('button', { name: 'Error' });
      expect(button).toBeTruthy();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialDangerButton label="Delete" onClick={handleClick} />,
      );
      const button = getByRole('button', { name: 'Delete' });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialDangerButton label="Disabled" onClick={handleClick} disabled />,
      );
      const button = getByRole('button', { name: 'Disabled' });
      expect(button).toHaveProperty('disabled', true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('allows appearance override', () => {
      const { getByRole } = render(
        <DialDangerButton
          label="Solid Error"
          appearance={ButtonAppearance.Solid}
        />,
      );
      const button = getByRole('button', { name: 'Solid Error' });
      expect(button).toBeTruthy();
    });
  });

  describe('DialLinkButton', () => {
    it('renders with label', () => {
      const { getByRole } = render(<DialLinkButton label="Link" />);
      const button = getByRole('button', { name: 'Link' });
      expect(button).toBeTruthy();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialLinkButton label="Link" onClick={handleClick} />,
      );
      const button = getByRole('button', { name: 'Link' });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialLinkButton label="Disabled" onClick={handleClick} disabled />,
      );
      const button = getByRole('button', { name: 'Disabled' });
      expect(button).toHaveProperty('disabled', true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('allows variant override', () => {
      const { getByRole } = render(
        <DialLinkButton label="Neutral Link" variant={ButtonVariant.Neutral} />,
      );
      const button = getByRole('button', { name: 'Neutral Link' });
      expect(button).toBeTruthy();
    });
  });

  describe('DialGhostButton', () => {
    it('renders with label', () => {
      const { getByRole } = render(<DialGhostButton label="Ghost" />);
      const button = getByRole('button', { name: 'Ghost' });
      expect(button).toBeTruthy();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialGhostButton label="Ghost" onClick={handleClick} />,
      );
      const button = getByRole('button', { name: 'Ghost' });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <DialGhostButton label="Disabled" onClick={handleClick} disabled />,
      );
      const button = getByRole('button', { name: 'Disabled' });
      expect(button).toHaveProperty('disabled', true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('allows variant override', () => {
      const { getByRole } = render(
        <DialGhostButton label="Error Ghost" variant={ButtonVariant.Danger} />,
      );
      const button = getByRole('button', { name: 'Error Ghost' });
      expect(button).toBeTruthy();
    });
  });

  describe('Button wrappers with icons', () => {
    it('renders DialPrimaryButton with icon', () => {
      const { getByRole } = render(
        <DialPrimaryButton label="With Icon" iconBefore={<span>🔍</span>} />,
      );
      const button = getByRole('button', { name: /With Icon/i });
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('🔍');
    });

    it('renders button with aria-label when label is complex', () => {
      const { getByRole } = render(
        <DialPrimaryButton
          label={
            <span>
              Complex <strong>Label</strong>
            </span>
          }
          aria-label="Complex Label"
        />,
      );
      const button = getByRole('button', { name: 'Complex Label' });
      expect(button).toBeTruthy();
    });
  });
});
