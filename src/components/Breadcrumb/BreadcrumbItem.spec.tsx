import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialBreadcrumbItem } from './BreadcrumbItem';

describe('Dial UI Kit :: DialBreadcrumbItem (final)', () => {
  test('renders as link when interactive (has href and not last/disabled)', () => {
    const onClick = vi.fn();
    render(<DialBreadcrumbItem title="Home" href="#home" onClick={onClick} />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    expect(link.className).toMatch(/hover:text-accent-primary/);
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('renders as non-interactive current page when isLast', () => {
    render(
      <ul>
        <DialBreadcrumbItem title="Current" isLast />
      </ul>,
    );
    const text = screen.getByText('Current');
    const li = text.closest('li') as HTMLElement;
    const wrapper = li.querySelector('[aria-current="page"]') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.className).toMatch(/text-primary/);
  });

  test('disabled item renders as non-interactive and has disabled styles', () => {
    const onClick = vi.fn();
    render(
      <ul>
        <DialBreadcrumbItem
          title="Disabled"
          href="#x"
          disabled
          onClick={onClick}
        />
      </ul>,
    );
    const text = screen.getByText('Disabled');
    expect(text.closest('a')).toBeNull();
    const li = text.closest('li') as HTMLElement;
    const wrapper = li.querySelector('[aria-disabled="true"]') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.className).toMatch(/opacity-75/);
    fireEvent.click(text);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('adds custom classes to container and title element', () => {
    render(
      <ul>
        <DialBreadcrumbItem
          title="Styled"
          href="#s"
          cssClass="dial-small"
          titleCssClass="underline"
        />
      </ul>,
    );
    const link = screen.getByRole('link', { name: 'Styled' });
    expect(link.className).toContain('underline');
    const li = link.closest('li');
    expect(li?.className).toContain('dial-small');
  });

  test('renders iconBefore before title', () => {
    render(
      <ul>
        <DialBreadcrumbItem
          title="Folder"
          href="#"
          iconBefore={<span aria-label="icon">📁</span>}
        />
      </ul>,
    );
    expect(screen.getByLabelText('icon')).toBeInTheDocument();
    expect(screen.getByText('Folder')).toBeInTheDocument();
  });
});
