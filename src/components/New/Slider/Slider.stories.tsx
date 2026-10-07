import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { IconMicrophone, IconSpeakerphone } from '@tabler/icons-react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { NumberInput } from '../NumberInput/NumberInput';
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
    showTooltip: {
      control: 'boolean',
      description:
        'Renders the current value in a bubble above the thumb; hidden while disabled',
    },
    showTicks: {
      control: 'boolean',
      description:
        'Renders a tick mark at every value the thumb can snap to; hidden while disabled',
    },
    leftContent: {
      control: false,
      description: 'Content before the track, e.g. an icon',
    },
    rightContent: {
      control: false,
      description:
        'Content after the track, e.g. a `NumberInput` or the formatted value',
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

const percent = (v: number) => `${Math.round(v * 100)}%`;

export const Continuous: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The continuous slider of the design: the value rides above the thumb in a bubble. The bubble is a visual echo — the input announces the value itself.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    'aria-label': 'Creativity',
    step: 0.01,
    showTooltip: true,
    formatValue: percent,
  },
};

export const Discrete: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`showTicks` marks every value the thumb snaps to on the unfilled track. Keep the step coarse enough that the marks stay apart.',
      },
    },
  },
  render: InteractiveSlider,
  args: {
    'aria-label': 'Creativity',
    step: 0.025,
    showTooltip: true,
    showTicks: true,
    formatValue: percent,
  },
};

const SliderWithNumberInput = (args: SliderProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-[320px]">
      <Slider
        {...args}
        value={value}
        onChange={setValue}
        rightContent={
          <div className="w-16">
            <NumberInput
              aria-label="Volume value"
              integer
              min={args.min}
              max={args.max}
              value={value}
              onChange={(v) => {
                const next = Number(v);
                if (!Number.isNaN(next)) {
                  setValue(
                    Math.min(
                      args.max ?? next,
                      Math.max(args.min ?? next, next),
                    ),
                  );
                }
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export const SliderContainer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The slider container: a label, an icon in `leftContent` and a `NumberInput` in `rightContent`, both centred on the track. The kit does not sync the field — the story passes both the same `value` and setter.',
      },
    },
  },
  render: SliderWithNumberInput,
  args: {
    id: 'volume-container',
    labelProps: { label: 'Volume' },
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showTooltip: true,
    formatValue: (v: number) => `${v}%`,
    leftContent: (
      <IconMicrophone
        size={DIAL_ICON_SIZE.MD}
        aria-hidden="true"
        className="text-secondary"
      />
    ),
  },
};

const SliderWithText = (args: SliderProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-[320px]">
      <Slider
        {...args}
        value={value}
        onChange={setValue}
        rightContent={
          // A visual echo: the slider already announces its value.
          <span aria-hidden="true" className="dial-small-text text-primary">
            {percent(value)}
          </span>
        }
      />
    </div>
  );
};

export const IconAndText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An icon on the left and the value as text on the right, over a discrete track.',
      },
    },
  },
  render: SliderWithText,
  args: {
    id: 'announcements',
    labelProps: { label: 'Announcements' },
    value: 0.25,
    step: 0.025,
    showTooltip: true,
    showTicks: true,
    formatValue: percent,
    leftContent: (
      <IconSpeakerphone
        size={DIAL_ICON_SIZE.MD}
        aria-hidden="true"
        className="text-secondary"
      />
    ),
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
        story:
          'The design matrix: continuous and discrete, at 0–100%, enabled and disabled. Hover, focus and drag show the halo around the thumb; a disabled slider drops the bubble and the ticks.',
      },
    },
  },
  render: (args: SliderProps) => (
    <div className="grid w-[640px] grid-cols-2 gap-x-8 gap-y-2">
      {[false, true].map((showTicks) =>
        [0, 0.25, 0.5, 0.75, 1].flatMap((v) =>
          [false, true].map((disabled) => (
            <Slider
              {...args}
              key={`${showTicks}-${v}-${disabled}`}
              aria-label={`${showTicks ? 'Discrete' : 'Continuous'} ${percent(v)}${disabled ? ', disabled' : ''}`}
              value={v}
              step={showTicks ? 0.025 : 0.01}
              showTicks={showTicks}
              showTooltip
              formatValue={percent}
              disabled={disabled}
            />
          )),
        ),
      )}
    </div>
  ),
};
