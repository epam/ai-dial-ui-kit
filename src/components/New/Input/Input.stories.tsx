import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { Input, type InputProps } from './Input';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { inputBaseArgTypes } from '@/constants/storybook/input';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';

const InteractiveInput = (args: InputProps) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <Input
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue ?? '')}
      // eslint-disable-next-line no-console
      onBlur={({ target }) => console.log(target.value)}
    />
  );
};

const meta = {
  title: 'Components_2_0/Input',
  component: Input,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An input component with various states and icon support.',
      },
    },
  },
  argTypes: {
    ...inputBaseArgTypes,
    size: {
      control: { type: 'inline-radio' },
      options: [ElementSize.Standard, ElementSize.Small, ElementSize.Large],
      description:
        'Field height: standard is 40px, small is 24px, large is 48px',
    },
  },
  args: {
    id: 'story-input',
    type: 'text',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
    size: ElementSize.Standard,
  },
  render: InteractiveInput,
} satisfies Meta<InputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Filled: Story = {
  args: {
    placeholder: 'Enter text...',
    value: 'Sample text',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Search...',
    size: ElementSize.Small,
    iconBefore: (
      <IconSearch size={DIAL_ICON_SIZE.SM} stroke={DIAL_KIT_ICON_STROKE} />
    ),
  },
};

export const Sizes: Story = {
  render: () => {
    const sizes = [
      { size: ElementSize.Large, label: 'Large (48px)' },
      { size: ElementSize.Standard, label: 'Standard (40px)' },
      { size: ElementSize.Small, label: 'Small (24px)' },
    ];

    return (
      <div className="flex flex-col size-full items-center">
        <h2 className="text-primary font-semibold mb-8">Input sizes</h2>

        <div className="flex flex-col gap-y-8">
          {sizes.map(({ size, label }) => {
            const iconSize = {
              [ElementSize.Small]: DIAL_ICON_SIZE.SM,
              [ElementSize.Standard]: DIAL_ICON_SIZE.MD,
              [ElementSize.Large]: DIAL_ICON_SIZE.LG,
            }[size];

            return (
              <div key={size} className="flex flex-col gap-y-3">
                <div className="text-primary font-semibold">{label}</div>

                <div className="flex flex-row items-start gap-x-6">
                  <InteractiveInput
                    id={`${size}-plain`}
                    size={size}
                    placeholder="Placeholder"
                  />

                  <InteractiveInput
                    id={`${size}-icons`}
                    size={size}
                    placeholder="Search..."
                    iconBefore={
                      <IconSearch
                        size={iconSize}
                        stroke={DIAL_KIT_ICON_STROKE}
                      />
                    }
                    iconAfter={
                      <IconEye size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />
                    }
                  />

                  <InteractiveInput
                    id={`${size}-max`}
                    size={size}
                    value="Text"
                    prefix="prefix"
                    postfix="postfix"
                    caption="Caption text"
                    inputButtonProps={{
                      icon: (
                        <IconSearch
                          size={iconSize}
                          stroke={DIAL_KIT_ICON_STROKE}
                        />
                      ),
                      onClick: () => alert('Input button clicked'),
                    }}
                  />

                  <InteractiveInput
                    id={`${size}-disabled`}
                    size={size}
                    value="Text"
                    disabled
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

export const MaxView: Story = {
  render: () => {
    const props: InputProps = {
      placeholder: 'Placeholder',
      iconBefore: (
        <IconSearch size={DIAL_ICON_SIZE.MD} stroke={DIAL_KIT_ICON_STROKE} />
      ),
      postfix: 'postfix',
      prefix: 'prefix',
      caption: 'Caption text',
      iconAfter: (
        <IconEye size={DIAL_ICON_SIZE.MD} stroke={DIAL_KIT_ICON_STROKE} />
      ),
      inputButtonProps: {
        icon: (
          <IconSearch size={DIAL_ICON_SIZE.MD} stroke={DIAL_KIT_ICON_STROKE} />
        ),
        onClick: () => alert('Input button clicked'),
      },
    };

    return (
      <div className="flex flex-col size-full items-center">
        <h2 className="text-primary font-semibold mb-8">Inputs</h2>

        <div className="flex-1 min-h-0 flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Default
            </div>
            <InteractiveInput id="default-input" {...props} />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Filled
            </div>
            <InteractiveInput id="field-input" value="Text" {...props} />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Error
            </div>
            <InteractiveInput
              id="error-input"
              invalid={true}
              value="Text"
              error="Error message"
              {...props}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled filled
            </div>
            <InteractiveInput
              id="disable-input"
              disabled={true}
              value="Text"
              {...props}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled empty
            </div>
            <InteractiveInput id="disable-input" disabled={true} {...props} />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    pseudo: {
      hover: ['.dial-input-for-hover'],
      focus: ['.dial-input-for-focus'],
    },
  },
};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col size-full items-center">
        <h2 className="text-primary font-semibold mb-8">Inputs</h2>

        <div className="flex-1 min-h-0 flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Default
            </div>
            <InteractiveInput
              id="default-input"
              placeholder="Placeholder"
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Filled
            </div>
            <InteractiveInput
              id="field-input"
              placeholder="Placeholder"
              value="Text"
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Hover
            </div>
            <InteractiveInput
              id="hover-input"
              containerClassName="dial-input-for-hover"
              placeholder="Placeholder"
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Focus/Active
            </div>
            <InteractiveInput
              id="focus-input"
              containerClassName="dial-input-for-focus"
              placeholder="Placeholder"
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Error
            </div>
            <InteractiveInput
              id="error-input"
              placeholder="Placeholder"
              invalid={true}
              value="Text"
              error="Error message"
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled filled
            </div>
            <InteractiveInput
              id="disable-input"
              placeholder="Placeholder"
              disabled={true}
              value="Text"
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled empty
            </div>
            <InteractiveInput
              id="disable-input"
              placeholder="Placeholder"
              disabled={true}
              iconBefore={
                <IconSearch
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
              iconAfter={
                <IconEye
                  size={DIAL_ICON_SIZE.MD}
                  stroke={DIAL_KIT_ICON_STROKE}
                />
              }
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    pseudo: {
      hover: ['.dial-input-for-hover'],
      focus: ['.dial-input-for-focus'],
    },
  },
};
