import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { CardShell } from './CardShell';

describe('Dial UI Kit :: CardShell', () => {
  test('Should render its children', () => {
    render(<CardShell>Card content</CardShell>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('Should forward role and aria-label', () => {
    render(
      <CardShell role="button" aria-label="Open card">
        Content
      </CardShell>,
    );
    expect(
      screen.getByRole('button', { name: 'Open card' }),
    ).toBeInTheDocument();
  });

  test('Should forward onClick', () => {
    const onClick = vi.fn();
    render(
      <CardShell role="button" aria-label="Clickable card" onClick={onClick}>
        Content
      </CardShell>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clickable card' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('Should forward onKeyDown', () => {
    const onKeyDown = vi.fn();
    render(
      <CardShell role="button" aria-label="Keyboard card" onKeyDown={onKeyDown}>
        Content
      </CardShell>,
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'Keyboard card' }), {
      key: 'Enter',
    });
    expect(onKeyDown).toHaveBeenCalled();
  });

  test('Should merge caller className with the shell defaults', () => {
    render(
      <CardShell role="button" aria-label="Sized card" className="h-[232px]">
        Content
      </CardShell>,
    );
    const card = screen.getByRole('button', { name: 'Sized card' });
    expect(card).toHaveClass('h-[232px]');
    expect(card).toHaveClass('rounded-[20px]');
  });

  test('Should forward style', () => {
    render(
      <CardShell
        role="button"
        aria-label="Tinted card"
        style={{ backgroundColor: 'rgb(255, 0, 0)' }}
      >
        Content
      </CardShell>,
    );
    expect(screen.getByRole('button', { name: 'Tinted card' })).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });
});
