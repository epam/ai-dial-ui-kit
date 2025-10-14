import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialTitle, type DialTitleProps } from './Title';
import { TextColor, TextAlign } from '@/types/typography';

const meta = {
  title: 'Components/Typography/Title',
  component: DialTitle,
  parameters: { layout: 'centered' },
  argTypes: {
    level: { control: { type: 'radio' }, options: [1, 2, 3] },
    color: { control: { type: 'select' }, options: Object.values(TextColor) },
    align: { control: { type: 'select' }, options: Object.values(TextAlign) },
    cssClass: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },
  args: {
    level: 1,
    color: TextColor.Primary,
    children: 'Heading',
  },
} satisfies Meta<DialTitleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Level1: Story = {
  args: { level: 1, children: 'Level 1 — 20/24 semibold' },
};

export const Level2: Story = {
  args: { level: 2, children: 'Level 2 — 20/24 normal' },
};

export const Level3: Story = {
  args: { level: 3, children: 'Level 3 — 16/18 semibold' },
};

export const CenteredError: Story = {
  name: 'Centered • Error',
  args: {
    level: 2,
    align: TextAlign.Center,
    color: TextColor.Error,
    children: 'Important notice',
  },
};

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <DialTitle>Level 1 — default</DialTitle>
      <DialTitle level={2} color={TextColor.Secondary}>
        Level 2 — secondary
      </DialTitle>
      <DialTitle level={3} color={TextColor.AccentPrimary}>
        Level 3 — accent primary
      </DialTitle>
      <DialTitle level={2} align={TextAlign.Right}>
        Right aligned
      </DialTitle>
      <DialTitle level={1} cssClass="underline decoration-dotted">
        Custom class (underline dotted)
      </DialTitle>
    </div>
  ),
};

export const TitleLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((level) => (
        <DialTitle key={level} level={level as 1 | 2 | 3}>
          Level {level}
        </DialTitle>
      ))}
    </div>
  ),
};

export const TitleColors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {Object.values(TextColor).map((color) => (
        <DialTitle key={color} level={2} color={color}>
          Color: {color}
        </DialTitle>
      ))}
    </div>
  ),
};

export const TitleAlignments: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[360px]">
      {Object.values(TextAlign).map((align) => (
        <DialTitle key={align} level={2} align={align}>
          {align} aligned title
        </DialTitle>
      ))}
    </div>
  ),
};

export const CustomClass: Story = {
  name: 'With custom cssClass',
  args: {
    cssClass: 'underline decoration-dotted',
    children: 'Underlined with dotted decoration',
  },
};
