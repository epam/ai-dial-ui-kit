import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialAccordion } from './Accordion';

const meta: Meta<typeof DialAccordion> = {
  title: 'Layout/Accordion',
  component: DialAccordion,
  tags: ['layout', 'accordion', 'disclosure'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A collapsible panel that toggles its content when the header is clicked. Works controlled (via `expanded`) or uncontrolled (via `defaultExpanded`). The header shows a rotating chevron, a title, and an optional description.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Header title.' },
    description: {
      control: 'text',
      description: 'Optional header description.',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Initial expanded state when uncontrolled.',
    },
    disabled: { control: 'boolean', description: 'Disables toggling.' },
    onToggle: { action: 'toggled' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const sampleContent = (
  <p className="dial-small-text text-secondary">
    This content is revealed when the accordion is expanded. It can hold any
    React nodes — form fields, lists, or nested components.
  </p>
);

export const Default: Story = {
  args: {
    title: 'Advanced settings',
    description: 'Optional configuration',
    children: sampleContent,
    className: 'w-[420px]',
  },
};

export const Expanded: Story = {
  args: {
    title: 'Advanced settings',
    description: 'Optional configuration',
    defaultExpanded: true,
    children: sampleContent,
    className: 'w-[420px]',
  },
};

export const WithoutDescription: Story = {
  args: {
    title: 'Advanced settings',
    children: sampleContent,
    className: 'w-[420px]',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Advanced settings',
    description: 'Cannot be expanded',
    disabled: true,
    children: sampleContent,
    className: 'w-[420px]',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <DialAccordion
        {...args}
        expanded={expanded}
        onToggle={setExpanded}
        className="w-[420px]"
      />
    );
  },
  args: {
    title: 'Controlled accordion',
    description: 'State is owned by the parent',
    children: sampleContent,
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-2 text-primary">
      <DialAccordion title="General" description="Basic options">
        {sampleContent}
      </DialAccordion>
      <DialAccordion title="Appearance" description="Theme and layout">
        {sampleContent}
      </DialAccordion>
      <DialAccordion title="Advanced" description="For power users">
        {sampleContent}
      </DialAccordion>
    </div>
  ),
};
