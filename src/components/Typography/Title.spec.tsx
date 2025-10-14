import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialTitle } from './Title';
import { TextAlign, TextColor } from '@/types/typography';

describe('Dial UI Kit :: Title', () => {
  test('renders level 1 as <h1> with base classes and default leading', () => {
    render(<DialTitle>Level 1</DialTitle>);
    const h = screen.getByRole('heading', { level: 1 });
    expect(h).toBeInTheDocument();
    expect(h.tagName.toLowerCase()).toBe('h1');
    expect(h.className).toContain('text-[20px]');
    expect(h.className).toContain('font-semibold');
    expect(h.className).toContain('leading-[24px]');
  });

  test('renders level 2 as <h2> with correct weight and leading', () => {
    render(<DialTitle level={2}>Level 2</DialTitle>);
    const h = screen.getByRole('heading', { level: 2 });
    expect(h.tagName.toLowerCase()).toBe('h2');
    expect(h.className).toContain('text-[20px]');
    expect(h.className).toContain('font-normal');
    expect(h.className).toContain('leading-[24px]');
  });

  test('renders level 3 as <h3> with correct size/leading', () => {
    render(<DialTitle level={3}>Level 3</DialTitle>);
    const h = screen.getByRole('heading', { level: 3 });
    expect(h.tagName.toLowerCase()).toBe('h3');
    expect(h.className).toContain('text-[16px]');
    expect(h.className).toContain('font-semibold');
    expect(h.className).toContain('leading-[18px]');
  });

  test('applies color utility class from enum', () => {
    render(<DialTitle color={TextColor.Error}>Danger</DialTitle>);
    const el = screen.getByText('Danger');
    expect(el.className).toContain('text-error');
  });

  test('applies alignment utility class', () => {
    render(
      <DialTitle level={2} align={TextAlign.Center}>
        Centered Heading
      </DialTitle>,
    );
    const el = screen.getByText('Centered Heading');
    expect(el.className).toContain('text-center');
  });

  test('merges custom cssClass', () => {
    render(
      <DialTitle cssClass="underline decoration-dotted">Decorated</DialTitle>,
    );
    const el = screen.getByText('Decorated');
    expect(el.className).toContain('underline');
    expect(el.className).toContain('decoration-dotted');
  });

  test('sets id attribute when provided', () => {
    render(<DialTitle id="title-id">With ID</DialTitle>);
    const el = screen.getByText('With ID');
    expect(el).toHaveAttribute('id', 'title-id');
  });
});
