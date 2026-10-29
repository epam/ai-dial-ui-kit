import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  NotificationSurface,
  NotificationType,
  NotificationVariant,
} from '@/types/notification';
import { Notification } from './Notification';
import {
  ErrorToastNotification,
  InfoMessageNotification,
  WarningMessageNotification,
} from './NotificationWrapper';

describe('Dial UI Kit :: Notification', () => {
  test('Should render with message text', () => {
    render(<Notification message="Hello notification" />);
    expect(screen.getByRole('status', { name: '' })).toBeInTheDocument();
    expect(screen.getByText('Hello notification')).toBeInTheDocument();
  });

  test('Should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<Notification message="Closable" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('Should not render close button when closable is false', () => {
    render(<Notification message="No close" closable={false} />);
    expect(
      screen.queryByRole('button', { name: 'Close notification' }),
    ).not.toBeInTheDocument();
  });

  test('Should apply custom className', () => {
    render(<Notification message="Styled" className="custom-alert-class" />);
    const alert = screen.getByRole('status');
    expect(alert).toHaveClass('custom-alert-class');
  });

  test.each([
    [NotificationVariant.Error, 'alert'],
    [NotificationVariant.Warning, 'alert'],
    [NotificationVariant.Info, 'status'],
    [NotificationVariant.Success, 'status'],
    [NotificationVariant.Loading, 'status'],
    [NotificationVariant.General, 'status'],
  ])(
    'Should expose the %s variant as a %s live region',
    (variant, expectedRole) => {
      render(<Notification variant={variant} message="Accessible" />);

      expect(screen.getByRole(expectedRole)).toBeInTheDocument();
    },
  );

  test('Should let the caller override the live-region role', () => {
    // Static page content should not announce itself as an update.
    render(<Notification message="Static" role="note" />);

    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('Should pass mouse event to onClose handler', () => {
    const onClose = vi.fn();
    render(<Notification message="Event test" onClose={onClose} closable />);
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledWith(expect.any(Object));
    expect(onClose.mock.calls[0][0]).toHaveProperty('type', 'click');
  });

  test('Should render title above message when title is provided', () => {
    render(<Notification title="Alert title" message="Alert message" />);
    const title = screen.getByText('Alert title');
    const message = screen.getByText('Alert message');
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(title).toHaveClass('dial-small-paragraph-semi-text');
    expect(title.compareDocumentPosition(message)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  test('Should render spinner for Loading variant', () => {
    const { container } = render(
      <Notification variant={NotificationVariant.Loading} message="Loading…" />,
    );

    expect(container.querySelector('.animate-spin-steps')).toBeInTheDocument();
  });

  test('Should render the General variant as a neutral notification', () => {
    render(
      <Notification
        variant={NotificationVariant.General}
        title="Title"
        message="Description text example"
      />,
    );

    const notification = screen.getByRole('status');
    expect(notification).toHaveClass('bg-layer-sunken', 'text-primary');
    expect(screen.getByText('Description text example')).toBeInTheDocument();
  });

  test('Should not nest the spinner live region inside the notification', () => {
    render(
      <Notification variant={NotificationVariant.Loading} message="Loading…" />,
    );

    // Spinner brings its own role="status"; nested live regions announce
    // their content twice.
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  test('Should keep the close button in the flow, on the first line', () => {
    render(
      <Notification
        title="File downloaded successfully"
        message="dial-report-2026-09.csv is in your Downloads folder"
        onClose={vi.fn()}
        closable
      />,
    );

    const notification = screen.getByRole('status');
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });

    // jsdom lays nothing out, so the alignment can only be asserted through
    // the classes: absolutely positioning the button inside a fixed 40px
    // spacer detached it from the content, and it drifted out of alignment as
    // soon as the message outgrew the spacer.
    expect(closeBtn.parentElement).toBe(notification);
    expect(closeBtn).toHaveClass('self-start');
    expect(closeBtn).not.toHaveClass('absolute');
  });

  test('Should give the close button its full small footprint', () => {
    render(<Notification message="Closable" onClose={vi.fn()} closable />);

    // `size-auto` used to win over the control's own size and collapse the
    // 24px box down to its 18px icon.
    expect(
      screen.getByRole('button', { name: 'Close notification' }),
    ).toHaveClass('size-[24px]');
  });

  test('Should render the action inside the live region and fire its handler', () => {
    const onRetry = vi.fn();
    render(
      <Notification
        variant={NotificationVariant.Error}
        title="Couldn't finish this response"
        message="Try again in a moment."
        action={
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        }
      />,
    );

    const alert = screen.getByRole('alert');
    const action = screen.getByRole('button', { name: 'Try again' });
    expect(alert).toContainElement(action);

    fireEvent.click(action);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  test('Should place the action after the text and before the close button', () => {
    render(
      <Notification
        message="Something went wrong"
        action={<button type="button">Try again</button>}
        onClose={vi.fn()}
        closable
      />,
    );

    const message = screen.getByText('Something went wrong');
    const action = screen.getByRole('button', { name: 'Try again' });
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });

    expect(message.compareDocumentPosition(action)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(action.compareDocumentPosition(closeBtn)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    // The wrapper must not shrink, or a wrapping message squeezes the control.
    expect(action.parentElement).toHaveClass('shrink-0');
  });

  test('Should render no action wrapper when action is omitted', () => {
    render(<Notification message="Plain" />);

    const notification = screen.getByRole('status');
    expect(notification.querySelector('.shrink-0.items-center')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  describe('surface', () => {
    const getIconWrapper = (notification: HTMLElement) =>
      notification.querySelector('[aria-hidden="true"]');

    test('Should draw the variant surface by default', () => {
      render(
        <Notification variant={NotificationVariant.Warning} message="Warn" />,
      );

      const notification = screen.getByRole('alert');
      expect(notification).toHaveClass('bg-warning', 'text-warning');
      expect(notification).not.toHaveClass('bg-layer-sunken');
      // The icon inherits the surface's text colour; no colour of its own.
      expect(getIconWrapper(notification)).not.toHaveClass('text-warning-icon');
    });

    test('Should render the same as the default for an explicit Variant surface', () => {
      render(
        <Notification
          variant={NotificationVariant.Error}
          surface={NotificationSurface.Variant}
          message="Error"
        />,
      );

      expect(screen.getByRole('alert')).toHaveClass('bg-error', 'text-error');
    });

    test.each([
      [NotificationVariant.Info, 'status', 'text-info'],
      [NotificationVariant.Success, 'status', 'text-success'],
      [NotificationVariant.Warning, 'alert', 'text-warning-icon'],
      [NotificationVariant.Error, 'alert', 'text-error'],
      [NotificationVariant.Loading, 'status', 'text-info'],
      [NotificationVariant.General, 'status', 'text-primary'],
    ])(
      'Should keep the %s role (%s) and colour its icon %s on the neutral surface',
      (variant, expectedRole, iconClassName) => {
        render(
          <Notification
            variant={variant}
            surface={NotificationSurface.Neutral}
            message="Neutral"
          />,
        );

        // Loading's spinner brings its own status region; take the outer one.
        const notification = screen.getAllByRole(expectedRole)[0];
        expect(notification).toHaveClass('bg-layer-sunken', 'text-primary');
        expect(notification).not.toHaveClass(
          `bg-${variant}`,
          `text-${variant}`,
        );
        expect(getIconWrapper(notification)).toHaveClass(iconClassName);
      },
    );

    test('Should keep the variant icon on the neutral surface', () => {
      const { container: variantContainer } = render(
        <Notification variant={NotificationVariant.Warning} message="A" />,
      );
      const { container: neutralContainer } = render(
        <Notification
          variant={NotificationVariant.Warning}
          surface={NotificationSurface.Neutral}
          message="B"
        />,
      );

      const iconOf = (root: HTMLElement) =>
        root.querySelector('[aria-hidden="true"] svg')?.getAttribute('class');
      expect(iconOf(neutralContainer)).toBe(iconOf(variantContainer));
      expect(iconOf(neutralContainer)).toContain(
        'tabler-icon-alert-triangle-filled',
      );
    });

    test('Should still let the caller override the role on the neutral surface', () => {
      render(
        <Notification
          variant={NotificationVariant.Warning}
          surface={NotificationSurface.Neutral}
          message="Static"
          role="note"
        />,
      );

      expect(screen.getByRole('note')).toHaveClass('bg-layer-sunken');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('Should let a caller className win over the neutral surface', () => {
      render(
        <Notification
          surface={NotificationSurface.Neutral}
          message="Custom"
          className="bg-layer-raised"
        />,
      );

      const notification = screen.getByRole('status');
      expect(notification).toHaveClass('bg-layer-raised');
      expect(notification).not.toHaveClass('bg-layer-sunken');
    });

    test('Should render title, message and action on the neutral surface', () => {
      render(
        <Notification
          variant={NotificationVariant.Warning}
          type={NotificationType.SectionMessage}
          surface={NotificationSurface.Neutral}
          title="Log in required"
          message="Scheduled tasks run while you are offline."
          action={<button type="button">Log in</button>}
        />,
      );

      const alert = screen.getByRole('alert');
      expect(alert).toContainElement(screen.getByText('Log in required'));
      expect(alert).toContainElement(
        screen.getByRole('button', { name: 'Log in' }),
      );
    });

    test.each([
      [
        'WarningMessageNotification',
        WarningMessageNotification,
        'alert',
        'text-warning-icon',
      ],
      [
        'InfoMessageNotification',
        InfoMessageNotification,
        'status',
        'text-info',
      ],
      ['ErrorToastNotification', ErrorToastNotification, 'alert', 'text-error'],
    ])(
      'Should forward surface through %s',
      (_name, Wrapper, expectedRole, iconClassName) => {
        render(
          <Wrapper surface={NotificationSurface.Neutral} message="Wrapped" />,
        );

        const notification = screen.getByRole(expectedRole);
        expect(notification).toHaveClass('bg-layer-sunken');
        expect(getIconWrapper(notification)).toHaveClass(iconClassName);
      },
    );
  });
});
