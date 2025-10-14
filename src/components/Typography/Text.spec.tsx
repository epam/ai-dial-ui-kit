import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialText } from './Text';
import { TextAlign, TextColor, TextVariant } from '@/types/typography';

describe('Dial UI Kit :: DialText', () => {
  test('renders as <span> by default with Small variant and default leading', () => {
    render(<DialText>Hello</DialText>);
    const el = screen.getByText('Hello');
    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.className).toContain('text-[14px]');
    expect(el.className).toContain('leading-[16px]');
    expect(el.className).toContain('font-normal');
    expect(el.className).toContain('text-primary');
  });

  test('applies Body variant size and leading', () => {
    render(<DialText variant={TextVariant.Body}>Body</DialText>);
    const el = screen.getByText('Body');
    expect(el.className).toContain('text-[16px]');
    expect(el.className).toContain('leading-[28px]');
  });

  test('applies 150% line-height when lineHeight150 is true', () => {
    render(
      <DialText variant={TextVariant.Small} lineHeight150>
        Small 150
      </DialText>,
    );
    const el = screen.getByText('Small 150');
    expect(el.className).toContain('leading-[150%]');
  });

  test('respects component override to <p>', () => {
    render(<DialText component="p">Paragraph</DialText>);
    const el = screen.getByText('Paragraph');
    expect(el.tagName.toLowerCase()).toBe('p');
  });

  test('adds alignment utility class', () => {
    render(
      <DialText align={TextAlign.Center} variant={TextVariant.Tiny}>
        Centered
      </DialText>,
    );
    const el = screen.getByText('Centered');
    expect(el.className).toContain('text-center');
  });

  test('applies color class from enum', () => {
    render(<DialText color={TextColor.Error}>Danger</DialText>);
    const el = screen.getByText('Danger');
    expect(el.className).toContain('text-error');
  });

  test('merges custom cssClass', () => {
    render(<DialText cssClass="underline">Decorated</DialText>);
    const el = screen.getByText('Decorated');
    expect(el.className).toContain('underline');
  });

  test('applies bold font weight when bold is true', () => {
    render(<DialText bold>Bold Text</DialText>);
    const el = screen.getByText('Bold Text');
    expect(el.className).toContain('font-semibold');
  });
});
