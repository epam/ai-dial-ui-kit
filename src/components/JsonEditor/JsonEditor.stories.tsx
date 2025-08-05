import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialJsonEditor } from './JsonEditor';
import { EDITOR_THEMES } from '@/types/editor';

const meta = {
  title: 'Components/JsonEditor',
  component: DialJsonEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A JSON editor component built on top of Monaco Editor with syntax highlighting, validation, and theme support.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The JSON string value to edit',
    },
    currentTheme: {
      control: { type: 'select' },
      options: Object.values(EDITOR_THEMES),
      description: 'The theme to apply to the editor',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the editor content changes',
    },
    onValidateJSON: {
      action: 'validated',
      description: 'Callback fired when JSON validation occurs',
    },
  },
} satisfies Meta<typeof DialJsonEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderWithContainer = (args: Story['args']) => (
  <div className="h-[300px] w-[500px]">
    <DialJsonEditor {...args} />
  </div>
);

const sampleJsonValue = JSON.stringify(
  {
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      country: 'USA',
    },
    hobbies: ['reading', 'swimming', 'coding'],
    isActive: true,
  },
  null,
  2,
);

export const Default: Story = {
  args: {
    value: sampleJsonValue,
    currentTheme: EDITOR_THEMES.dark,
    onChange: () => {
      // Handle change
    },
  },
  render: renderWithContainer,
};

export const Empty: Story = {
  args: {
    value: '',
    currentTheme: EDITOR_THEMES.dark,
    onChange: () => {
      // Handle change
    },
  },
  render: renderWithContainer,
};

export const LightTheme: Story = {
  args: {
    value: sampleJsonValue,
    currentTheme: EDITOR_THEMES.light,
    onChange: () => {
      // Handle change
    },
  },
  render: renderWithContainer,
};

export const ComplexJson: Story = {
  args: {
    value: JSON.stringify(
      {
        users: [
          {
            id: 1,
            profile: {
              firstName: 'Alice',
              lastName: 'Smith',
              settings: {
                theme: 'dark',
                notifications: {
                  email: true,
                  push: false,
                  sms: true,
                },
                preferences: {
                  language: 'en',
                  timezone: 'UTC',
                  dateFormat: 'YYYY-MM-DD',
                },
              },
            },
            roles: ['admin', 'editor'],
            lastLogin: '2024-01-15T10:30:00Z',
          },
          {
            id: 2,
            profile: {
              firstName: 'Bob',
              lastName: 'Johnson',
              settings: {
                theme: 'light',
                notifications: {
                  email: false,
                  push: true,
                  sms: false,
                },
                preferences: {
                  language: 'es',
                  timezone: 'EST',
                  dateFormat: 'DD/MM/YYYY',
                },
              },
            },
            roles: ['viewer'],
            lastLogin: '2024-01-14T08:15:00Z',
          },
        ],
        metadata: {
          version: '1.0.0',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T12:00:00Z',
        },
      },
      null,
      2,
    ),
    currentTheme: EDITOR_THEMES.dark,
    onChange: () => {
      // Handle change
    },
  },
  render: renderWithContainer,
};

export const WithCustomOptions: Story = {
  args: {
    value: sampleJsonValue,
    currentTheme: EDITOR_THEMES.dark,
    onChange: () => {
      // Handle change
    },
    options: {
      fontSize: 16,
      lineNumbers: 'off',
      minimap: { enabled: true },
      wordWrap: 'off',
    },
  },
  render: renderWithContainer,
};
