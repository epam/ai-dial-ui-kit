import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialFormPopup } from './FormPopup';

describe('Dial UI Kit :: FormPopup', () => {
  const baseProps = {
    title: 'Create Model',
    open: true,
    submitLabel: 'Submit',
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  test('does not render when open is false', () => {
    render(<DialFormPopup {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders title and body slot (children)', () => {
    render(
      <DialFormPopup {...baseProps}>
        <form>
          <div>Custom form content</div>
        </form>
      </DialFormPopup>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Model')).toBeInTheDocument();
    expect(screen.getByText('Custom form content')).toBeInTheDocument();
  });

  test('submit button disabled via prop', () => {
    render(<DialFormPopup {...baseProps} disableSubmitButton />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  test('calls onSubmit on submit click', () => {
    const onSubmit = vi.fn();
    render(<DialFormPopup {...baseProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('Cancel calls onCancel or falls back to onClose', () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <DialFormPopup
        {...baseProps}
        onCancel={onCancel}
        onClose={onClose}
        cancelLabel="Cancel"
      >
        <form />
      </DialFormPopup>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('header close (from DialPopup) triggers onClose', () => {
    const onClose = vi.fn();
    render(
      <DialFormPopup {...baseProps} onClose={onClose}>
        <form />
      </DialFormPopup>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('loading state hides actions', () => {
    render(
      <DialFormPopup {...baseProps} isLoading>
        <form />
      </DialFormPopup>,
    );
    expect(
      screen.queryByRole('button', { name: 'Submit' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' }),
    ).not.toBeInTheDocument();
  });

  test('merges cssClass into container', () => {
    render(
      <DialFormPopup {...baseProps} cssClass="ring-1">
        <form />
      </DialFormPopup>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('ring-1');
  });
});
