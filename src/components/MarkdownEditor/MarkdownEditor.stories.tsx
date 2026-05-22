import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import {
  DialMarkdownEditor,
  type DialMarkdownEditorProps,
} from './MarkdownEditor';
import { EditorThemes } from '@/types/editor';

const meta = {
  title: 'Data Display/MarkdownEditor',
  component: DialMarkdownEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Markdown editor component built on top of @uiw/react-md-editor with preview capabilities and theme support. Note: If using this component in your application, you need to import the required CSS files globally: `@uiw/react-markdown-preview/markdown.css` and `@uiw/react-md-editor/markdown-editor.css`.',
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
    placeholder: {
      control: false,
      description: 'Content to display when the editor value is empty',
    },
  },
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor.',
    height: 300,
    preview: 'edit',
    theme: EditorThemes.dark,
  },
} satisfies Meta<DialMarkdownEditorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderWithContainer = (args: Story['args']) => {
  const [value, setValue] = useState(args?.value ?? '');
  return (
    <div className="w-[600px]">
      <DialMarkdownEditor
        {...args}
        value={value}
        onChange={(val) => {
          setValue(val);
          args?.onChange?.(val);
        }}
      />
    </div>
  );
};

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
    theme: EditorThemes.light,
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

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: (
      <span className="italic">Start typing your markdown here…</span>
    ),
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
