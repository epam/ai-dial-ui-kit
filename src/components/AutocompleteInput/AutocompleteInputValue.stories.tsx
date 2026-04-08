import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAutocompleteInputValue } from './AutocompleteInputValue';

/**
 * `DialAutocompleteInputValue` is a read-only display component, typically embedded inside a
 * `dial-input` container (e.g. a select trigger). It renders selected items as tags and
 * falls back to a placeholder when the list is empty.
 */
const meta: Meta<typeof DialAutocompleteInputValue> = {
  title: 'Form/AutocompleteInputValue',
  component: DialAutocompleteInputValue,
  tags: ['form', 'input', 'tags', 'autocomplete'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Read-only tag display used inside select/autocomplete triggers. Renders selected items as tags with an optional `+N` overflow chip when `collapseTagOverflow` is enabled.',
      },
    },
  },
  argTypes: {
    selectedItems: {
      control: { type: 'object' },
      description: 'Array of selected item strings to display as tags',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Text shown when no items are selected',
    },
    collapseTagOverflow: {
      control: 'boolean',
      description:
        'Keeps items on one line and shows a `+N` chip with a tooltip for overflow items',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <div className="dial-input px-3 py-2 flex flex-row items-center w-full justify-between cursor-pointer">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

const MANY_ITEMS = [
  'React',
  'TypeScript',
  'Storybook',
  'Tailwind',
  'Vite',
  'Vitest',
  'React1',
  'TypeScript2',
  'Storybook3',
  'Tailwind4',
  'Vite5',
  'Vitest6',
];

export const Default: Story = {
  args: {
    selectedItems: ['React', 'TypeScript', 'Storybook'],
  },
};

export const Empty: Story = {
  args: {
    selectedItems: [],
    placeholder: 'Select items…',
  },
};

export const SingleItem: Story = {
  args: {
    selectedItems: ['React'],
  },
};

export const ManyItems: Story = {
  args: {
    selectedItems: MANY_ITEMS,
  },
};

export const CollapsedOverflow: Story = {
  args: {
    selectedItems: MANY_ITEMS,
    collapseTagOverflow: true,
  },
};
