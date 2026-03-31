import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'DIAL/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface TypographyRowProps {
  className: string;
  label: string;
}

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog';

const TypographyRow = ({ className, label }: TypographyRowProps) => (
  <div className="grid grid-cols-[220px_1fr] items-baseline gap-4 border-b border-primary py-3 last:border-0">
    <code className="dial-tiny-text shrink-0 text-secondary">{label}</code>
    <span className={className}>{SAMPLE_TEXT}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h3 className="mb-3 border-b-2 border-accent-primary pb-1 text-sm font-semibold uppercase tracking-widest text-secondary">
      {title}
    </h3>
    {children}
  </div>
);

const TypographyShowcase = () => (
  <div className="min-h-screen bg-layer-0 p-8 text-primary">
    <h1 className="dial-h1-text mb-8">Typography</h1>

    <Section title="Design system compliant classes (dial-*-text)">
      <TypographyRow
        className="dial-display1-text"
        label="dial-display1-text"
      />
      <TypographyRow
        className="dial-display2-text"
        label="dial-display2-text"
      />
      <TypographyRow className="dial-h1-text" label="dial-h1-text" />
      <TypographyRow className="dial-h2-text" label="dial-h2-text" />
      <TypographyRow className="dial-h3-text" label="dial-h3-text" />
      <TypographyRow className="dial-body-text" label="dial-body-text" />
      <TypographyRow
        className="dial-body-semi-text"
        label="dial-body-semi-text"
      />
      <TypographyRow className="dial-small-text" label="dial-small-text" />
      <TypographyRow
        className="dial-small-semi-text"
        label="dial-small-semi-text"
      />
      <TypographyRow className="dial-tiny-text" label="dial-tiny-text" />
      <TypographyRow
        className="dial-tiny-semi-text"
        label="dial-tiny-semi-text"
      />
      <TypographyRow className="dial-caption-text" label="dial-caption-text" />
      <TypographyRow className="dial-code-text" label="dial-code-text" />
    </Section>

    <Section title="Legacy classes (dial-h*, dial-body, dial-small*, dial-tiny*, dial-caption)">
      <TypographyRow className="dial-h1" label="dial-h1" />
      <TypographyRow className="dial-h2" label="dial-h2" />
      <TypographyRow className="dial-h3" label="dial-h3" />
      <TypographyRow className="dial-body" label="dial-body" />
      <TypographyRow className="dial-small" label="dial-small" />
      <TypographyRow className="dial-small-semi" label="dial-small-semi" />
      <TypographyRow className="dial-small-medium" label="dial-small-medium" />
      <TypographyRow className="dial-small-150" label="dial-small-150" />
      <TypographyRow className="dial-tiny" label="dial-tiny" />
      <TypographyRow className="dial-tiny-150" label="dial-tiny-150" />
      <TypographyRow className="dial-tiny-semi" label="dial-tiny-semi" />
      <TypographyRow className="dial-caption" label="dial-caption" />
    </Section>
  </div>
);

export const AllVariants: Story = {
  render: () => <TypographyShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'All typography classes from `src/styles/typography.scss`.',
      },
    },
  },
};
