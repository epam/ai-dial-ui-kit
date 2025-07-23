import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExampleComponent } from './ExampleComponent';

const meta = {
  title: 'Example/Component',
  component: ExampleComponent,
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof ExampleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'Example Component',
    description: 'This is an example component for demonstration purposes.',
  },
};
