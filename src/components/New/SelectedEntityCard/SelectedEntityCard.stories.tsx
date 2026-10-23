import type { Meta, StoryObj } from '@storybook/react-vite';

import { EntityType } from '@/types/entity-type';
import {
  SelectedEntityCard,
  type SelectedEntityCardProps,
} from './SelectedEntityCard';

const meta = {
  title: 'Components_2_0/SelectedEntityCard',
  component: SelectedEntityCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The card of a form field that holds one selected entity: its identity, a skeleton while the catalog loads, its raw id when the catalog does not list it, or a placeholder when nothing is selected.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    iconSize: {
      control: { type: 'number', min: 24, max: 64, step: 4 },
      description: 'Icon size in px',
    },
    headingLevel: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      description: 'Heading level of the name',
    },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    showType: { control: 'boolean' },
    error: { control: { type: 'text' } },
  },
  args: {
    entityId: 'gemini-3.5-flash-lite',
    item: {
      type: EntityType.Model,
      name: 'Google Gemini 3.5 Flash Lite',
      version: '1.0.3',
    },
    labels: { type: 'Model', placeholder: 'Select model' },
  },
} satisfies Meta<SelectedEntityCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** What rides on the selection, as a line under the name. */
export const WithDetails: Story = {
  args: { details: 'Effort: high · 1M context', showType: false },
};

/** A skeleton while the catalog loads. */
export const Loading: Story = {
  args: { isLoading: true },
};

/** An id the catalog does not list still shows, as it is. */
export const NotInCatalog: Story = {
  args: { item: undefined, entityId: 'my-custom-deployment' },
};

/** Nothing selected yet, with the error that asks for one. */
export const NotSelected: Story = {
  args: {
    entityId: '',
    item: undefined,
    error: 'No model — this project cannot start a run.',
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};
