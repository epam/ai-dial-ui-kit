// Cache configuration defaults
export const DEFAULT_TTL_MS = 20 * 60 * 1000; // TTL (Time To Live) 20 minutes
export const DEFAULT_MAX_ENTRIES = 20; // LRU (Least Recently Used) cap

export const AUTO_ZOOM_ID = 'auto';
export const AUTO_ZOOM_VALUE = '1.25';

export const ZOOM_OPTIONS = [
  { value: AUTO_ZOOM_ID, label: 'Auto' },
  { value: '0.5', label: '50%' },
  { value: '0.75', label: '75%' },
  { value: '1', label: '100%' },
  { value: '1.25', label: '125%' },
  { value: '1.5', label: '150%' },
  { value: '2', label: '200%' },
  { value: '3', label: '300%' },
];
