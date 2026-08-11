import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Popup } from './Popup';
import { PopupSize } from '@/types/popup';
import { popupSizeClassMap } from './constants';

describe('Dial UI Kit :: Popup', () => {
  test('does not render when closed', () => {
    const { queryByRole } = render(<Popup open={false} />);
    expect(queryByRole('dialog')).toBeNull();
  });

  test('renders title and body when open', () => {
    render(
      <Popup open header="Title">
        <div>Body content</div>
      </Popup>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(
      <Popup open header="With footer" footer={<div>Footer here</div>}>
        <div>Body</div>
      </Popup>,
    );
    expect(screen.getByText('Footer here')).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <Popup open header="Closable" onClose={onClose}>
        <div>Body</div>
      </Popup>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders React component as title (non-string path) and omits aria-labelledby', () => {
    render(
      <Popup
        open
        header={
          <span>
            <strong>Node title</strong>
          </span>
        }
      >
        <div>Body</div>
      </Popup>,
    );

    expect(screen.getByText('Node title')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  test('names the dialog from a string header', () => {
    render(
      <Popup open header="Title">
        <div>Body</div>
      </Popup>,
    );

    expect(screen.getByRole('dialog', { name: 'Title' })).toBeInTheDocument();
  });

  test('names the dialog from ariaLabel when the header is a node', () => {
    render(
      <Popup open header={<strong>Node title</strong>} ariaLabel="Move items">
        <div>Body</div>
      </Popup>,
    );

    expect(
      screen.getByRole('dialog', { name: 'Move items' }),
    ).toBeInTheDocument();
  });

  test('a string header wins over ariaLabel, so the visible title is announced', () => {
    render(
      <Popup open header="Title" ariaLabel="Ignored">
        <div>Body</div>
      </Popup>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Title' });
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  test('gives each open popup its own heading id', () => {
    render(
      <>
        <Popup open header="First">
          <div>Body</div>
        </Popup>
        <Popup open header="Second">
          <div>Body</div>
        </Popup>
      </>,
    );

    // Queried by attribute rather than by role: each modal focus manager
    // aria-hides the other dialog, so a role query would not see both.
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
    expect(dialogs).toHaveLength(2);

    const headingIds = dialogs.map((dialog) =>
      dialog.getAttribute('aria-labelledby'),
    );
    expect(new Set(headingIds).size).toBe(2);
    headingIds.forEach((headingId) =>
      expect(document.getElementById(headingId!)).toBeInTheDocument(),
    );
  });

  test('applies size class correctly', () => {
    render(
      <Popup open header="Size Test" size={PopupSize.Lg}>
        <div>Body</div>
      </Popup>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(popupSizeClassMap[PopupSize.Lg]);
  });

  test('applies headerClassName to the popup header', () => {
    render(
      <Popup
        open
        header="Header class test"
        headerClassName="custom-header-class"
      >
        <div>Body</div>
      </Popup>,
    );

    const header = screen
      .getByRole('button', { name: 'Close dialog' })
      .closest('div');

    expect(header).toHaveClass('custom-header-class');
  });

  test('applies bodyClassName to the scrollable body wrapper', () => {
    render(
      <Popup open header="Body class test" bodyClassName="custom-body-class">
        <div>Body</div>
      </Popup>,
    );

    const body = screen.getByText('Body').parentElement;
    expect(body).toHaveClass('custom-body-class');
  });

  test('does not close on outside click when closeOnOutsideClick is false', () => {
    const onClose = vi.fn();

    render(
      <Popup
        open
        header="Outside click disabled"
        onClose={onClose}
        closeOnOutsideClick={false}
      >
        <div>Body</div>
      </Popup>,
    );

    fireEvent.mouseDown(document.body);

    expect(onClose).not.toHaveBeenCalled();
  });

  test('does not render close button when hideClose is true', () => {
    render(
      <Popup open header="No Close" hideClose>
        <div>Body</div>
      </Popup>,
    );

    expect(
      screen.queryByRole('button', { name: 'Close dialog' }),
    ).not.toBeInTheDocument();
  });
});
