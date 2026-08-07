import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { IconChevronDown } from '@tabler/icons-react';

export const getButtonChevron = (isOpen: boolean) => (
  <IconChevronDown
    size={DIAL_ICON_SIZE.SM}
    aria-hidden
    className={mergeClasses('transition-transform', isOpen && 'rotate-180')}
  />
);
