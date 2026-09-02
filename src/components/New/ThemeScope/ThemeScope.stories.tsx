import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from '@/components/New/Dropdown/Dropdown';
import { ThemeScope, type ThemeScopeProps } from './ThemeScope';

/**
 * A host-owned scope, the kind a consumer defines in its own stylesheet. Only
 * the tokens the panel actually paints with need redefining.
 */
const scopeStyles = `
  .sb-dark-panel {
    --bg-layer-raised: #201e1e;
    --bg-control-accent-alpha: #483f38;
    --bg-control-accent-alpha-hover: #564b43;
    --stroke-tertiary: #3b3b38;
    --text-primary: #f4f4f4;
    --text-secondary: #a29f9f;
  }
`;

const Panel = ({ label }: { label: string }) => (
  <div className="dial-surface flex w-[260px] flex-col gap-3 rounded border border-tertiary p-4">
    <div className="dial-small-semi-text">{label}</div>
    <div className="dial-small-paragraph-text text-secondary">
      The panel repaints from the scope&apos;s tokens.
    </div>
    <Dropdown
      defaultOpen
      items={[
        { key: 'rename', label: 'Rename' },
        { key: 'duplicate', label: 'Duplicate' },
      ]}
      listClassName="w-[180px]"
    >
      <button type="button" className="dial-small-text text-start">
        Open the row actions
      </button>
    </Dropdown>
  </div>
);

const meta = {
  title: 'Components_2_0/ThemeScope',
  component: ThemeScope,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Marks a subtree as living under a host-defined token scope, so overlays this subtree opens in a portal are painted with the same tokens. Redefining tokens on a panel root re-themes everything the panel renders — until a `Dropdown`, `Popup`, `Tooltip` or `Calendar` escapes into a portal at the end of `<body>`, where the scope no longer reaches it. The wrapper is `display: contents`, so it generates no box and leaves the surrounding layout untouched.',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Class name redefining the design tokens for this subtree',
    },
    children: {
      control: false,
      description: 'The subtree painted with those tokens',
    },
  },
} satisfies Meta<ThemeScopeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The panel and its portalled dropdown both read the scope's tokens. Compare
 * with `WithoutScope`, where the same dropdown stays on the app palette.
 */
export const Default: Story = {
  args: {
    className: 'sb-dark-panel',
    children: <Panel label="Inside a ThemeScope" />,
  },
  render: (args) => (
    <>
      <style>{scopeStyles}</style>
      <ThemeScope {...args} />
    </>
  ),
};

/**
 * The same markup with the class applied directly instead of through a
 * `ThemeScope`: the panel repaints, but the dropdown — portalled out of the
 * subtree — does not.
 */
export const WithoutScope: Story = {
  args: {
    className: 'sb-dark-panel',
    children: <Panel label="Class applied directly" />,
  },
  render: (args) => (
    <>
      <style>{scopeStyles}</style>
      <div className={args.className}>{args.children}</div>
    </>
  ),
};
