import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { DialSlider, type DialSliderProps } from './Slider';

const meta = {
  title: 'Form/Slider',
  component: DialSlider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A range slider with a custom thumb showing the current value and optional start/center/end labels below the track.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Current slider value',
      table: { type: { summary: 'number' } },
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    step: {
      control: { type: 'number' },
      description: 'Step increment',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0.1' } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    labels: {
      control: false,
      description:
        'Optional 2- or 3-element label tuple rendered below the track',
      table: {
        type: { summary: '[string, string] | [string, string, string]' },
        defaultValue: { summary: 'undefined' },
      },
    },
    formatValue: {
      control: false,
      description: 'Custom formatter for the thumb value display',
      table: {
        type: { summary: '(value: number) => string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onChange: {
      control: false,
      description: 'Callback fired with the new value',
      table: { type: { summary: '(value: number) => void' } },
    },
  },
  args: {
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    disabled: false,
    onChange: () => undefined,
  },
} satisfies Meta<DialSliderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledExample = (args: DialSliderProps) => {
  const [value, setValue] = useState(args.value);
  return (
    <div className="w-[422px]">
      <DialSlider
        {...args}
        value={value}
        onChange={(v) => {
          setValue(v);
          args.onChange?.(v);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default slider with Precise / Neutral / Creative labels, matching the standard AI temperature control UI.',
      },
    },
  },
  render: ControlledExample,
  args: {
    labels: ['Precise', 'Neutral', 'Creative'],
  },
};

export const WithoutLabels: Story = {
  parameters: {
    docs: {
      description: { story: 'Slider with no labels below the track.' },
    },
  },
  render: ControlledExample,
};

export const TwoLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Slider with only a start and end label.',
      },
    },
  },
  render: ControlledExample,
  args: {
    labels: ['Min', 'Max'],
  },
};

export const IntegerRange: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Slider over an integer range (0–100).',
      },
    },
  },
  render: (args: DialSliderProps) => {
    const [value, setValue] = useState(50);
    return (
      <div className="w-[422px]">
        <DialSlider
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    labels: ['0', '50', '100'],
  },
};

export const CustomFormat: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Uses a custom formatValue to show the value as a percentage.',
      },
    },
  },
  render: ControlledExample,
  args: {
    labels: ['0%', '50%', '100%'],
    formatValue: (v) => `${Math.round(v * 100)}%`,
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: 'Disabled state — interaction and focus are blocked.' },
    },
  },
  render: ControlledExample,
  args: {
    disabled: true,
    labels: ['Precise', 'Neutral', 'Creative'],
  },
};
