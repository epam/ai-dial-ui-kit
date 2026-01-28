import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialMarkdownEditorContainer,
  type DialMarkdownEditorContainerProps,
} from './MarkdownEditorContainer';
import { EDITOR_THEMES } from '@/types/editor';

const meta = {
  title: 'Data Display/MarkdownEditorContainer',
  component: DialMarkdownEditorContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A container component that combines Markdown and JSON editing capabilities with an optional switcher to toggle between modes. Note: If using this component in your application, you need to import the required CSS files globally: `@uiw/react-markdown-preview/markdown.css` and `@uiw/react-md-editor/markdown-editor.css`.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The current content value',
    },
    label: {
      control: { type: 'text' },
      description: 'Optional label for the field',
    },
    headerContent: {
      control: false,
      description: 'Optional content to display in the header',
    },
    switcherLabel: {
      control: { type: 'text' },
      description:
        'Optional label for the mode switcher (if not provided, switcher is hidden)',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the editor in pixels',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme for the editor',
    },
    preview: {
      control: { type: 'select' },
      options: ['edit', 'live', 'preview'],
      description: 'Preview mode for Markdown editor',
    },
    onChangeValue: {
      action: 'changed',
      description: 'Callback fired when the content changes',
    },
    onValidateJSON: {
      action: 'validated',
      description: 'Callback fired when JSON validation occurs',
    },
  },
  args: {
    value: '# Hello World\n\nThis is a **markdown** editor container.',
    height: 300,
    theme: EDITOR_THEMES.dark,
    preview: 'edit',
  },
} satisfies Meta<DialMarkdownEditorContainerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderContainerWithWrapper = (
  args: Partial<DialMarkdownEditorContainerProps>,
) => (
  <div className="w-[600px]">
    <DialMarkdownEditorContainer {...args} />
  </div>
);

export const Default: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: '# Hello World\n\nThis is a **markdown** editor container.',
    }),
};

export const WithLabelAndHeaderContent: Story = {
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

export const WithSwitcherAndLabel: Story = {
  render: () =>
    renderContainerWithWrapper({
      value:
        '# Hello World\n\nThis is a **markdown** editor with switcher and label.',
      label: 'Content Editor',
      switcherLabel: 'JSON Mode',
    }),
};

export const WithJSONMode: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: JSON.stringify({ name: 'John', age: 30 }, null, 2),
      switcherLabel: 'JSON Mode',
    }),
};

export const LightTheme: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: '# Hello World\n\nThis is a **markdown** editor with light theme.',
      theme: EDITOR_THEMES.light,
      switcherLabel: 'JSON Mode',
    }),
};

export const WithValidation: Story = {
  render: () =>
    renderContainerWithWrapper({
      value: JSON.stringify({ name: 'John', age: 30 }, null, 2),
      switcherLabel: 'JSON Mode',
      onValidateJSON: (errors) => {
        console.error('JSON validation errors:', errors);
      },
    }),
};
