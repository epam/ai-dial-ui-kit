import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialMarkdownEditor,
  type DialMarkdownEditorProps,
} from './MarkdownEditor';
import {
  DialMarkdownEditorContainer,
  type DialMarkdownEditorContainerProps,
} from './MarkdownEditorContainer';

const meta = {
  title: 'Data Display/MarkdownEditor',
  component: DialMarkdownEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Markdown editor component built on top of @uiw/react-md-editor with preview capabilities and theme support.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The current markdown content',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the editor in pixels',
    },
    preview: {
      control: { type: 'select' },
      options: ['edit', 'live', 'preview'],
      description: 'Preview mode',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme for the editor',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the editor content changes',
    },
  },
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor.',
    height: 300,
    preview: 'edit',
    theme: 'dark',
  },
} satisfies Meta<DialMarkdownEditorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderWithContainer = (args: Story['args']) => (
  <div className="w-[600px]">
    <DialMarkdownEditor {...args} value={args?.value ?? ''} />
  </div>
);

// Stories for DialMarkdownEditor
export const Default: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor.',
  },
  render: renderWithContainer,
};

export const LightTheme: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor with light theme.',
    theme: 'light',
  },
  render: renderWithContainer,
};

export const LivePreview: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor with live preview.',
    preview: 'live',
  },
  render: renderWithContainer,
};

export const PreviewOnly: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor in preview mode.',
    preview: 'preview',
  },
  render: renderWithContainer,
};

export const CustomHeight: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor with custom height.',
    height: 500,
  },
  render: renderWithContainer,
};

export const ComplexMarkdown: Story = {
  args: {
    value: `# Markdown Editor

This is a comprehensive markdown editor example.

## Features

- **Bold text**
- *Italic text*
- \`Code blocks\`

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote

[Link](https://example.com)

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`,
  },
  render: renderWithContainer,
};

// Stories for DialMarkdownEditorContainer
const renderContainerWithWrapper = (
  args: Partial<DialMarkdownEditorContainerProps>,
) => (
  <div className="w-[600px]">
    <DialMarkdownEditorContainer {...args} />
  </div>
);

export const ContainerDefault: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: '# Hello World\n\nThis is a **markdown** editor container.',
    }),
};

export const ContainerWithLabelAndHeaderContent: Story = {
  render: () =>
    renderContainerWithWrapper({
      value:
        '# Hello World\n\nThis is a **markdown** editor with label and header.',
      label: 'Content Editor',
      headerContent: (
        <div className="text-secondary dial-small">Additional info</div>
      ),
    }),
};

export const ContainerWithSwitcherAndLabel: Story = {
  render: () =>
    renderContainerWithWrapper({
      value:
        '# Hello World\n\nThis is a **markdown** editor with switcher and label.',
      label: 'Content Editor',
      switcherLabel: 'JSON Mode',
    }),
};

export const ContainerWithJSONMode: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: JSON.stringify({ name: 'John', age: 30 }, null, 2),
      switcherLabel: 'JSON Mode',
    }),
};

export const ContainerLightTheme: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: '# Hello World\n\nThis is a **markdown** editor with light theme.',
      theme: 'light',
      switcherLabel: 'JSON Mode',
    }),
};

export const ContainerWithValidation: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: JSON.stringify({ name: 'John', age: 30 }, null, 2),
      switcherLabel: 'JSON Mode',
      onValidateJSON: (errors) => {
        console.error('JSON validation errors:', errors);
      },
    }),
};
