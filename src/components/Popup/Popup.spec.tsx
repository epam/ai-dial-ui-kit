import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialPopup } from './Popup';

describe('Dial UI Kit :: DialPopup', () => {
  test('does not render when closed', () => {
    const { queryByRole } = render(<DialPopup open={false} />);
    expect(queryByRole('dialog')).toBeNull();
  });

  test('renders title and body when open', () => {
    render(
      <DialPopup open title="Title">
        <div>Body content</div>
      </DialPopup>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(
      <DialPopup open title="With footer" footer={<div>Footer here</div>}>
        <div>Body</div>
      </DialPopup>,
    );
    expect(screen.getByText('Footer here')).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <DialPopup open title="Closable" onClose={onClose}>
        <div>Body</div>
      </DialPopup>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders React component as title (non-string path) and omits aria-labelledby', () => {
    render(
      <DialPopup
        open
        title={
          <span>
            <strong>Node title</strong>
          </span>
        }
      >
        <div>Body</div>
      </DialPopup>,
    );

    expect(screen.getByText('Node title')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');

    expect(screen.queryByText('dial-popup-heading')).not.toBeInTheDocument();
  });
});
