import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { SideDrawer } from './SideDrawer';

/* The panel stays mounted while closed, so queries opt into inert content. */
const getDrawer = () => screen.getByRole('dialog', { hidden: true });

describe('Dial UI Kit :: SideDrawer', () => {
  test('is a modal dialog named by a string header', () => {
    render(
      <SideDrawer open header="Publish" onClose={vi.fn()}>
        Body
      </SideDrawer>,
    );

    const drawer = screen.getByRole('dialog', { name: 'Publish' });
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(
      screen.getByRole('heading', { name: 'Publish' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  test('takes its name from ariaLabel when the header is a node', () => {
    render(
      <SideDrawer
        open
        header={<span>Custom</span>}
        ariaLabel="Details"
        onClose={vi.fn()}
      >
        Body
      </SideDrawer>,
    );

    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  test('stays mounted but inert and off-screen while closed', () => {
    render(
      <SideDrawer open={false} header="Publish" onClose={vi.fn()}>
        Body
      </SideDrawer>,
    );

    expect(getDrawer()).toHaveAttribute('inert');
    expect(getDrawer()).toHaveClass('translate-x-full');
  });

  test('slides in when opened', () => {
    const { rerender } = render(
      <SideDrawer open={false} header="Publish" onClose={vi.fn()}>
        Body
      </SideDrawer>,
    );

    rerender(
      <SideDrawer open header="Publish" onClose={vi.fn()}>
        Body
      </SideDrawer>,
    );

    expect(getDrawer()).not.toHaveAttribute('inert');
    expect(getDrawer()).toHaveClass('translate-x-0');
  });

  test('moves focus to the panel when it opens, not to the close button', async () => {
    render(
      <SideDrawer open header="Publish" onClose={vi.fn()}>
        Body
      </SideDrawer>,
    );

    // The focus manager focuses inside a microtask queued from a layout effect.
    await waitFor(() => expect(getDrawer()).toHaveFocus());
    expect(screen.getByRole('button', { name: 'Close' })).not.toHaveFocus();
  });

  test('closes from the close button and from Escape', async () => {
    const onClose = vi.fn();
    render(
      <SideDrawer open header="Publish" onClose={onClose}>
        Body
      </SideDrawer>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('closes on a press outside the panel unless told not to', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <SideDrawer open header="Publish" onClose={onClose}>
        Body
      </SideDrawer>,
    );

    fireEvent.pointerDown(document.body);
    expect(onClose).toHaveBeenCalledOnce();

    onClose.mockClear();
    rerender(
      <SideDrawer
        open
        header="Publish"
        onClose={onClose}
        closeOnOutsideClick={false}
      >
        Body
      </SideDrawer>,
    );

    fireEvent.pointerDown(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('does not ask to close while closed', async () => {
    const onClose = vi.fn();
    render(
      <SideDrawer open={false} header="Publish" onClose={onClose}>
        Body
      </SideDrawer>,
    );

    await userEvent.keyboard('{Escape}');
    fireEvent.pointerDown(document.body);

    expect(onClose).not.toHaveBeenCalled();
  });

  test('can disable the close button, and leave it out', () => {
    const { rerender } = render(
      <SideDrawer open header="Publish" onClose={vi.fn()} closeDisabled>
        Body
      </SideDrawer>,
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();

    rerender(
      <SideDrawer open header="Publish" onClose={vi.fn()} hideClose>
        Body
      </SideDrawer>,
    );

    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  test('renders a back button with onBack, which can be disabled', async () => {
    const onBack = vi.fn();
    const { rerender } = render(
      <SideDrawer
        open
        header="Credentials"
        onClose={vi.fn()}
        onBack={onBack}
        backAriaLabel="Back to details"
      >
        Body
      </SideDrawer>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to details' }),
    );
    expect(onBack).toHaveBeenCalledOnce();

    rerender(
      <SideDrawer
        open
        header="Credentials"
        onClose={vi.fn()}
        onBack={onBack}
        backAriaLabel="Back to details"
        backDisabled
      >
        Body
      </SideDrawer>,
    );

    expect(
      screen.getByRole('button', { name: 'Back to details' }),
    ).toBeDisabled();
  });

  test('places headerActions before the close button', () => {
    render(
      <SideDrawer
        open
        header="Details"
        onClose={vi.fn()}
        headerActions={<button type="button">Star</button>}
      >
        Body
      </SideDrawer>,
    );

    const star = screen.getByRole('button', { name: 'Star' });
    const close = screen.getByRole('button', { name: 'Close' });
    expect(
      star.compareDocumentPosition(close) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test('carries the public class on the panel', () => {
    render(
      <SideDrawer open header="Publish" onClose={vi.fn()} className="w-96">
        Body
      </SideDrawer>,
    );

    expect(getDrawer()).toHaveClass('w-96', 'dial-kit-side-drawer');
  });
});
