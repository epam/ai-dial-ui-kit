import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Slider, type SliderProps } from './Slider';

const InteractiveSlider = (args: SliderProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-[420px]">
      <Slider
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

const meta = {
  title: 'Components_2_0/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A range slider from the 2.0 design system, built on a native `<input type="range">` so the browser owns the drag, the keyboard steps and touch. Only the thumb is restyled; the track and its fill are drawn by the component.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Current slider value',
    },
    min: { control: 'number', description: 'Minimum value' },
    max: { control: 'number', description: 'Maximum value' },
    step: { control: 'number', description: 'Step increment' },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    labelProps: {
      control: 'object',
      description: 'Props of the `Label` rendered above the track',
    },
    labels: {
      control: false,
      description: '2 or 3 strings rendered below the track',
    },
    formatValue: {
      control: false,
      description:
        'Custom formatter for the displayed value; also becomes the announced `aria-valuetext`',
    },
    showValue: {
      control: 'boolean',
      description: 'Renders the current value at the end of the label row',
    },
    caption: {
      control: 'text',
      description: 'Helper text rendered below the track',
    },
    error: {
      control: 'text',
      description:
        'Error message rendered below the track; replaces the caption',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback fired with the new value',
    },
  },
  args: {
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveSlider,
  args: {
    'aria-label': 'Temperature',
  },
};

export const WithLabelAndValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The label names the slider and the value echoes it at the end of the same row.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'temperature',
    labelProps: { label: 'Temperature' },
    showValue: true,
  },
};

export const WithLabels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Three labels under the track, the standard AI temperature control.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'temperature-labels',
    labelProps: { label: 'Temperature' },
    labels: ['Precise', 'Neutral', 'Creative'],
    showValue: true,
  },
};

export const TwoLabels: Story = {
  parameters: {
    docs: {
      description: { story: 'Only a start and an end label.' },
    },
  },
  render: InteractiveSlider,
  args: {
    'aria-label': 'Temperature',
    labels: ['Min', 'Max'],
  },
};

export const IntegerRange: Story = {
  parameters: {
    docs: {
      description: { story: 'An integer range from 0 to 100.' },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'volume',
    labelProps: { label: 'Volume' },
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    labels: ['0', '50', '100'],
  },
};

export const CustomFormat: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`formatValue` drives both the visible value and the announced `aria-valuetext`, so a screen reader hears "70%" rather than "0.7".',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'creativity',
    labelProps: { label: 'Creativity' },
    showValue: true,
    formatValue: (v: number) => `${Math.round(v * 100)}%`,
    labels: ['0%', '50%', '100%'],
  },
};

export const WithCaption: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A caption below the track, wired up as the slider description.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'temperature-caption',
    labelProps: {
      label: 'Temperature',
      caption: 'Controls response creativity',
    },
    caption: 'Higher values produce more varied answers',
    showValue: true,
  },
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The error replaces the caption and describes the slider.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'temperature-error',
    labelProps: { label: 'Temperature', required: true },
    caption: 'Higher values produce more varied answers',
    error: 'This model only accepts values below 0.4',
    showValue: true,
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled — the browser blocks drag and keyboard.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    id: 'temperature-disabled',
    labelProps: { label: 'Temperature' },
    labels: ['Precise', 'Neutral', 'Creative'],
    showValue: true,
    disabled: true,
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Every value position and the disabled state side by side.',
      },
    },
  },
  render: (args: SliderProps) => (
    <div className="flex w-[420px] flex-col gap-6">
      {[0, 0.3, 1].map((v) => (
        <Slider
          {...args}
          key={v}
          id={`state-${v}`}
          value={v}
          labelProps={{ label: `Value ${v}` }}
          showValue
        />
      ))}
      <Slider
        {...args}
        id="state-disabled"
        value={0.6}
        labelProps={{ label: 'Disabled' }}
        showValue
        disabled
      />
    </div>
  ),
};
