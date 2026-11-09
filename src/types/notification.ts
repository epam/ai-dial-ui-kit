export enum NotificationVariant {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Loading = 'loading',
  General = 'general',
}

export enum NotificationType {
  Toast = 'toast',
  SectionMessage = 'section-message',
}

/**
 * Which surface a `Notification` draws on.
 *
 * - `Variant` — the variant's own coloured surface (`bg-info`, `bg-warning` …).
 * - `Neutral` — the neutral sunken layer (`bg-layer-sunken`) with primary text;
 *   the variant still picks the icon, the icon colour and the live-region role.
 */
export enum NotificationSurface {
  Variant = 'variant',
  Neutral = 'neutral',
}
