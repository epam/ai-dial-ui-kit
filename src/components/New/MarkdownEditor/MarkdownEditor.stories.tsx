import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { EditorThemes } from '@/types/editor';
import { MarkdownEditor, type MarkdownEditorProps } from './MarkdownEditor';

const meta = {
  title: 'Components_2_0/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Markdown editor with a formatting toolbar (bold, italic, strikethrough, text style, lists, quote, link, code, table), an edit/live/preview mode switcher and fullscreen, built on top of `@uiw/react-md-editor`. Note: consumers need to import `@uiw/react-markdown-preview/markdown.css` and `@uiw/react-md-editor/markdown-editor.css` globally.',
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
    theme: {
      control: { type: 'select' },
      options: Object.values(EditorThemes),
      description: 'Theme for the editor',
    },
    defaultPreview: {
      control: { type: 'select' },
      options: ['edit', 'live', 'preview'],
      description: 'Initial edit/live/preview mode',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the editor content changes',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when the editor is empty',
    },
  },
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor.',
    height: 300,
    theme: EditorThemes.light,
  },
} satisfies Meta<MarkdownEditorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderWithContainer = (args: Story['args']) => {
  const [value, setValue] = useState(args?.value ?? '');
  return (
    <div className="w-[720px]">
      <MarkdownEditor
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

export const Default: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor.',
  },
  render: renderWithContainer,
};

export const LivePreview: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor with live preview.',
    defaultPreview: 'live',
  },
  render: renderWithContainer,
};

export const PreviewOnly: Story = {
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor in preview mode.',
    defaultPreview: 'preview',
  },
  render: renderWithContainer,
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'Write instructions',
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

> This is a blockquote

[Link](https://example.com)

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`,
  },
  render: renderWithContainer,
};
