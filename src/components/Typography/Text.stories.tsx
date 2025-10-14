import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialText, type DialTextProps } from './Text';
import { TextVariant, TextColor, TextAlign } from '@/types/typography';

const meta = {
  title: 'Components/Typography/Text',
  component: DialText,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(TextVariant),
    },
    color: { control: { type: 'select' }, options: Object.values(TextColor) },
    align: { control: { type: 'select' }, options: Object.values(TextAlign) },
    component: {
      control: { type: 'select' },
      options: [
        'span',
        'p',
        'div',
        'label',
        'strong',
        'em',
        'code',
        'blockquote',
        'li',
      ],
    },
    cssClass: { control: { type: 'text' } },
    lineHeight150: { control: { type: 'boolean' } },
    bold: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
  },
  args: {
    variant: TextVariant.Small,
    color: TextColor.Primary,
    component: 'span',
    lineHeight150: false,
    children: 'Sample text',
  },
} satisfies Meta<DialTextProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Body: Story = {
  args: { variant: TextVariant.Body, children: 'Body — 16/28' },
};

export const Tiny150: Story = {
  name: 'Tiny • 150% line-height',
  args: {
    variant: TextVariant.Tiny,
    lineHeight150: true,
    children: 'Tiny with 150% LH (was 12/18)',
  },
};

export const CaptionErrorCentered: Story = {
  name: 'Caption • Error • Centered',
  args: {
    variant: TextVariant.Caption,
    color: TextColor.Error,
    align: TextAlign.Center,
    children: 'Caption in error color and centered',
  },
};

export const AsParagraph: Story = {
  name: 'Rendered as <p>',
  args: { component: 'p', children: 'Paragraph text' },
};

export const Showcase: Story = {
  render: () => (
    <div className="gap-2 flex flex-col">
      <DialText variant={TextVariant.Body}>
        Body — 16/28 (default leading)
      </DialText>
      <DialText variant={TextVariant.Body} lineHeight150>
        Body — 150% leading
      </DialText>
      <DialText variant={TextVariant.Small}>Small — 14/16</DialText>
      <DialText variant={TextVariant.Small} lineHeight150>
        Small — 150% leading (≈14/21)
      </DialText>
      <DialText variant={TextVariant.Tiny}>Tiny — 12/14</DialText>
      <DialText variant={TextVariant.Tiny} lineHeight150>
        Tiny — 150% leading (≈12/18)
      </DialText>
      <DialText variant={TextVariant.Caption} color={TextColor.Secondary}>
        Caption — 10/12 secondary
      </DialText>
      <DialText component="label">Rendered as &lt;label&gt;</DialText>
      <DialText variant={TextVariant.Body} bold>
        Body bold
      </DialText>
    </div>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <div className="gap-4 flex flex-col">
      {Object.values(TextVariant).map((variant) => (
        <DialText key={variant} variant={variant}>
          Variant: {variant}
        </DialText>
      ))}
    </div>
  ),
};

export const TextColors: Story = {
  render: () => (
    <div className="gap-4 flex flex-col">
      {Object.values(TextColor).map((color) => (
        <DialText key={color} color={color}>
          Color: {color}
        </DialText>
      ))}
    </div>
  ),
};

export const TextAlignments: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      {Object.values(TextAlign).map((align) => (
        <DialText key={align} align={align} variant={TextVariant.Body}>
          {align} aligned text
        </DialText>
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
