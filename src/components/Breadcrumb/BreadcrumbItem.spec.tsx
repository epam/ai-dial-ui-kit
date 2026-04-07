import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialBreadcrumbItem } from './BreadcrumbItem';

describe('Dial UI Kit :: DialBreadcrumbItem (final)', () => {
  test('renders as link when interactive (has href and not last/disabled)', () => {
    const onClick = vi.fn();
    render(<DialBreadcrumbItem label="Home" href="#home" onClick={onClick} />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    expect(link.className).toMatch(/hover:text-accent-primary/);
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('renders as non-interactive current page when isLast', () => {
    render(
      <ul>
        <DialBreadcrumbItem label="Current" isLast />
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
          label="Disabled"
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
          label="Styled"
          href="#s"
          className="dial-small-text"
        />
      </ul>,
    );
    const link = screen.getByRole('link', { name: 'Styled' });
    const li = link.closest('li');
    expect(li?.className).toContain('dial-small-text');
  });

  test('renders iconBefore before title', () => {
    render(
      <ul>
        <DialBreadcrumbItem
          label="Folder"
          href="#"
          iconBefore={<span aria-label="icon">📁</span>}
        />
      </ul>,
    );
    expect(screen.getByLabelText('icon')).toBeInTheDocument();
    expect(screen.getByText('Folder')).toBeInTheDocument();
  });

  test('renders non-string title as-is (no tooltip wrapper)', () => {
    render(
      <ul>
        <DialBreadcrumbItem
          label={<strong role="test">Custom</strong>}
          href="#"
        />
      </ul>,
    );

    const title = screen.getByRole('test');
    expect(title).toBeInTheDocument();
    expect(title).not.toHaveAttribute('aria-label');
  });

  test('calls onClick handler when clicked', () => {
    const onClick = vi.fn();
    render(
      <ul>
        <DialBreadcrumbItem label="Clickable" href="#click" onClick={onClick} />
      </ul>,
    );
    const link = screen.getByRole('link', { name: 'Clickable' });
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('applies rest props to container li element', () => {
    render(
      <ul>
        <DialBreadcrumbItem
          label="With Props"
          href="#"
          aria-label="custom-breadcrumb-item"
          role="listitem"
        />
      </ul>,
    );
    const li = screen.getByRole('listitem', { name: 'custom-breadcrumb-item' });
    expect(li).toBeInTheDocument();
    expect(li).toHaveAttribute('aria-label', 'custom-breadcrumb-item');
  });

  test('navigation guard allows navigation when returning true', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(true);
    const onClick = vi.fn();

    render(
      <ul>
        <DialBreadcrumbItem
          label="Guarded"
          href="#test"
          onClick={onClick}
          onBeforeNavigate={onBeforeNavigate}
        />
      </ul>,
    );

    const link = screen.getByRole('link', { name: 'Guarded' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('navigation guard prevents navigation when returning false', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(false);
    const onClick = vi.fn();

    render(
      <ul>
        <DialBreadcrumbItem
          label="Guarded"
          href="#test"
          onClick={onClick}
          onBeforeNavigate={onBeforeNavigate}
        />
      </ul>,
    );

    const link = screen.getByRole('link', { name: 'Guarded' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('navigation guard supports async checks with Promise', async () => {
    const onBeforeNavigate = vi.fn().mockResolvedValue(true);
    const onClick = vi.fn();

    render(
      <ul>
        <DialBreadcrumbItem
          label="Async Guard"
          href="#test"
          onClick={onClick}
          onBeforeNavigate={onBeforeNavigate}
        />
      </ul>,
    );

    const link = screen.getByRole('link', { name: 'Async Guard' });
    await fireEvent.click(link);

    expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    // Wait for async guard to complete
    await vi.waitFor(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  test('navigation guard is not called for last item', async () => {
    const onBeforeNavigate = vi.fn();

    render(
      <ul>
        <DialBreadcrumbItem
          label="Current"
          isLast
          onBeforeNavigate={onBeforeNavigate}
        />
      </ul>,
    );

    const text = screen.getByText('Current');
    await fireEvent.click(text);

    expect(onBeforeNavigate).not.toHaveBeenCalled();
  });

  test('navigation guard is not called for disabled item', async () => {
    const onBeforeNavigate = vi.fn();
    const onClick = vi.fn();

    render(
      <ul>
        <DialBreadcrumbItem
          label="Disabled"
          href="#test"
          onClick={onClick}
          disabled
          onBeforeNavigate={onBeforeNavigate}
        />
      </ul>,
    );

    const text = screen.getByText('Disabled');
    await fireEvent.click(text);

    expect(onBeforeNavigate).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  test('navigation guard prevents default when returning false', async () => {
    const onBeforeNavigate = vi.fn().mockReturnValue(false);

    render(
      <ul>
        <DialBreadcrumbItem
          label="Link"
          href="#test"
          onBeforeNavigate={onBeforeNavigate}
        />
      </ul>,
    );

    const link = screen.getByRole('link', { name: 'Link' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(event, 'preventDefault');

    link.dispatchEvent(event);

    await vi.waitFor(() => {
      expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(preventDefault).toHaveBeenCalled();
    });
  });
});
