import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Popup } from './Popup';
import { PopupSize } from '@/types/popup';
import { ButtonVariant } from '@/types/button';
import {
  popupFooterClassName,
  popupFooterDividerClassName,
  popupHeaderDividerClassName,
  popupSizeClassMap,
} from './constants';

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

  test('moves initial focus to the dialog itself, not the close button', async () => {
    render(
      <Popup open header="Edit prompt">
        <input aria-label="Name" />
      </Popup>,
    );

    const dialog = screen.getByRole('dialog');

    // The focus manager focuses inside a microtask queued from a layout effect.
    await waitFor(() => expect(dialog).toHaveFocus());
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).not.toHaveFocus();
  });

  test('leaves the dialog a programmatic focus target rather than a tab stop', async () => {
    render(
      <Popup open header="Edit prompt">
        <input aria-label="Name" />
      </Popup>,
    );

    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog).toHaveFocus());

    expect(dialog).toHaveAttribute('tabindex', '-1');
  });

  test('focuses the guard instead of the dialog when preventKeyboardOnOpen is set', async () => {
    render(
      <Popup open header="Edit prompt" preventKeyboardOnOpen>
        <input aria-label="Name" />
      </Popup>,
    );

    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog).not.toHaveFocus());

    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).not.toHaveFocus();
    expect(screen.getByLabelText('Name')).not.toHaveFocus();
  });

  test('reveals a clipped title in the 2.0 tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<Popup open header="A title too long for its header" />);

    await user.hover(screen.getByText('A title too long for its header'));

    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveTextContent(
        'A title too long for its header',
      ),
    );
  });

  test('keeps the title clipping itself, since the trigger has its own box', () => {
    render(<Popup open header="A title too long for its header" />);

    expect(screen.getByText('A title too long for its header')).toHaveClass(
      'truncate',
    );
  });

  describe('header', () => {
    test('renders no back button until onBack is given', () => {
      render(<Popup open header="Title" />);

      expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
    });

    test('calls onBack when the back button is clicked', async () => {
      const user = userEvent.setup();
      const onBack = vi.fn();
      const onClose = vi.fn();
      render(
        <Popup open header="Title" onBack={onBack} onClose={onClose} />,
      );

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(onBack).toHaveBeenCalledTimes(1);
      // The back control must not double as a dismiss.
      expect(onClose).not.toHaveBeenCalled();
    });

    test('names the back button from backAriaLabel', () => {
      render(
        <Popup
          open
          header="Title"
          onBack={vi.fn()}
          backAriaLabel="Back to templates"
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Back to templates' }),
      ).toBeInTheDocument();
    });

    test('renders headerActions alongside the close button', () => {
      render(
        <Popup
          open
          header="Title"
          headerActions={<button type="button">Details</button>}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Details' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Close dialog' }),
      ).toBeInTheDocument();
    });

    test('keeps headerActions when the close button is hidden', () => {
      render(
        <Popup
          open
          header="Title"
          hideClose
          headerActions={<button type="button">Details</button>}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Details' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close dialog' })).toBeNull();
    });

    test('draws no rule under the header by default', () => {
      const { container } = render(<Popup open header="Title" />);

      expect(
        container.querySelector(`.${popupHeaderDividerClassName.split(' ')[0]}`),
      ).toBeNull();
    });

    test('draws a rule under the header when headerDivider is set', () => {
      render(<Popup open header="Title" headerDivider />);

      const header = screen.getByRole('heading', { name: 'Title' })
        .parentElement as HTMLElement;
      popupHeaderDividerClassName
        .split(' ')
        .forEach((cls) => expect(header).toHaveClass(cls));
    });
  });

  describe('footer', () => {
    test('renders no footer when neither buttons nor footer are given', () => {
      render(<Popup open header="Title" />);

      expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull();
    });

    test('renders no footer for empty button lists', () => {
      const { container } = render(
        <Popup open header="Title" mainButtons={[]} additionalButtons={[]} />,
      );

      expect(
        container.querySelector(`.${popupFooterClassName.split(' ')[0]}.px-6`),
      ).toBeNull();
    });

    test('renders mainButtons and additionalButtons', () => {
      render(
        <Popup
          open
          header="Title"
          additionalButtons={[{ label: 'Learn more' }]}
          mainButtons={[{ label: 'Cancel' }, { label: 'Confirm' }]}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Learn more' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirm' }),
      ).toBeInTheDocument();
    });

    test('renders the buttons in the order they are declared', () => {
      render(
        <Popup
          open
          header="Title"
          mainButtons={[{ label: 'Cancel' }, { label: 'Confirm' }]}
        />,
      );

      const cancel = screen.getByRole('button', { name: 'Cancel' });
      const confirm = screen.getByRole('button', { name: 'Confirm' });

      expect(
        cancel.compareDocumentPosition(confirm) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    test('wires each button up to its own handler', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      const onConfirm = vi.fn();
      render(
        <Popup
          open
          header="Title"
          mainButtons={[
            { label: 'Cancel', onClick: onCancel },
            { label: 'Confirm', onClick: onConfirm },
          ]}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onCancel).not.toHaveBeenCalled();
    });

    test('defaults a button to the neutral variant', () => {
      render(<Popup open header="Title" mainButtons={[{ label: 'Cancel' }]} />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
        'dial-kit-neutral-solid-button',
      );
    });

    test('lets a button override the default variant', () => {
      render(
        <Popup
          open
          header="Title"
          mainButtons={[{ label: 'Confirm', variant: ButtonVariant.Primary }]}
        />,
      );

      expect(screen.getByRole('button', { name: 'Confirm' })).toHaveClass(
        'dial-kit-primary-solid-button',
      );
    });

    test('groups additionalButtons with mainButtons by default', () => {
      render(
        <Popup
          open
          header="Title"
          additionalButtons={[{ label: 'Learn more' }]}
          mainButtons={[{ label: 'Confirm' }]}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Learn more' }).parentElement,
      ).toBe(screen.getByRole('button', { name: 'Confirm' }).parentElement);
    });

    test('splits additionalButtons into their own group when placed left', () => {
      render(
        <Popup
          open
          header="Title"
          additionalButtonsOnLeft
          additionalButtons={[{ label: 'Learn more' }]}
          mainButtons={[{ label: 'Confirm' }]}
        />,
      );

      const additional = screen.getByRole('button', { name: 'Learn more' })
        .parentElement as HTMLElement;
      const main = screen.getByRole('button', { name: 'Confirm' })
        .parentElement as HTMLElement;

      expect(additional).not.toBe(main);
      // Only the trailing group is pushed over, so the leading one stays put.
      expect(additional).not.toHaveClass('ml-auto');
      expect(main).toHaveClass('ml-auto');
    });

    test('draws a rule above the footer when footerDivider is set', () => {
      render(
        <Popup
          open
          header="Title"
          footerDivider
          mainButtons={[{ label: 'Confirm' }]}
        />,
      );

      const footer = screen.getByRole('button', { name: 'Confirm' })
        .parentElement?.parentElement as HTMLElement;
      popupFooterDividerClassName
        .split(' ')
        .forEach((cls) => expect(footer).toHaveClass(cls));
    });

    test('lets a footer node win over the structured buttons', () => {
      render(
        <Popup
          open
          header="Title"
          footer={<div>Custom footer</div>}
          mainButtons={[{ label: 'Confirm' }]}
        />,
      );

      expect(screen.getByText('Custom footer')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull();
    });
  });
});
