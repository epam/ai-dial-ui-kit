import type { ReactNode } from 'react';

export interface RadioButtonWithContent {
  id: string;
  name: string;
  content?: ReactNode;
}
