import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import type { JsonSchema } from '@/models/json-schema';
import {
  SchemaDisplayMode,
  SchemaOrientation,
  SchemaRendererVariant,
} from '@/types/json-schema';
import { SchemaRenderer } from './SchemaRenderer';
import type { SchemaRendererProps } from './types';

const primitivesSchema: JsonSchema = {
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the configuration.',
    },
    token: {
      title: 'API token',
      type: 'string',
      isProtected: true,
    },
    count: { title: 'Count', type: 'integer', default: 5 },
    temperature: { title: 'Temperature', type: 'number', default: 0.7 },
    enabled: { title: 'Enabled', type: 'boolean', default: true },
    mode: {
      title: 'Mode',
      type: 'string',
      enum: ['fast', 'balanced', 'accurate'],
      default: 'balanced',
    },
    region: {
      title: 'Region',
      type: 'string',
      enum: ['eu', 'us', 'apac'],
      enumDisplay: SchemaDisplayMode.Radio,
      enumOrientation: SchemaOrientation.Row,
      default: 'eu',
    },
    version: { title: 'Schema version', type: 'string', const: 'v2' },
  },
  required: ['name'],
};

const nestedSchema: JsonSchema = {
  $defs: {
    Connection: {
      title: 'Connection',
      type: 'object',
      description: 'Where the service is reached.',
      properties: {
        host: { title: 'Host', type: 'string' },
        port: { title: 'Port', type: 'integer', default: 443 },
        secure: { title: 'Use TLS', type: 'boolean', default: true },
      },
      required: ['host'],
    },
  },
  properties: {
    service: {
      title: 'Service',
      type: 'object',
      properties: {
        name: { title: 'Name', type: 'string' },
        connection: { $ref: '#/$defs/Connection' },
      },
      required: ['name'],
    },
    tags: {
      title: 'Tags',
      type: 'array',
      items: { type: 'string' },
      default: ['internal'],
    },
  },
};

const notificationDefs: JsonSchema['$defs'] = {
  EmailNotification: {
    title: 'Email',
    type: 'object',
    properties: {
      type: { const: 'email', default: 'email', type: 'string' },
      address: { title: 'Email address', type: 'string' },
      subject: { title: 'Subject', type: 'string', default: 'Notification' },
    },
    required: ['address'],
  },
  WebhookNotification: {
    title: 'Webhook',
    type: 'object',
    properties: {
      type: { const: 'webhook', default: 'webhook', type: 'string' },
      url: { title: 'Webhook URL', type: 'string' },
      retries: { title: 'Retries', type: 'integer', default: 3 },
    },
    required: ['url'],
  },
};

const notificationMapping = {
  propertyName: 'type',
  mapping: {
    email: '#/$defs/EmailNotification',
    webhook: '#/$defs/WebhookNotification',
  },
};

const notificationVariants = [
  { $ref: '#/$defs/EmailNotification' },
  { $ref: '#/$defs/WebhookNotification' },
];

const unionsSchema: JsonSchema = {
  $defs: notificationDefs,
  properties: {
    notification: {
      title: 'Notification',
      description: 'How to send notifications.',
      discriminator: notificationMapping,
      oneOf: notificationVariants,
    },
    fallback: {
      title: 'Fallback',
      description: 'Shown as radios, each revealing its own fields.',
      discriminator: notificationMapping,
      discriminatorDisplay: SchemaDisplayMode.Radio,
      oneOf: notificationVariants,
    },
    alias: {
      title: 'Alias',
      description: 'Optional: switch from null to a string.',
      anyOf: [{ type: 'null' }, { type: 'string' }],
      default: null,
    },
  },
  required: ['notification'],
};

const toolsSchema: JsonSchema = {
  $defs: {
    RestApiTool: {
      title: 'REST API tool',
      type: 'object',
      properties: {
        type: { const: 'rest-api', default: 'rest-api', type: 'string' },
        name: { title: 'Name', type: 'string' },
        url: { title: 'URL', type: 'string' },
      },
      required: ['name', 'url'],
    },
    InternalTool: {
      title: 'Internal tool',
      type: 'object',
      properties: {
        type: { const: 'internal', default: 'internal', type: 'string' },
        name: { title: 'Name', type: 'string' },
      },
      required: ['name'],
    },
  },
  properties: {
    tools: {
      title: 'Tools',
      type: 'array',
      items: {
        oneOf: [
          { $ref: '#/$defs/RestApiTool' },
          { $ref: '#/$defs/InternalTool' },
        ],
        discriminator: {
          propertyName: 'type',
          mapping: {
            'rest-api': '#/$defs/RestApiTool',
            internal: '#/$defs/InternalTool',
          },
        },
      },
    },
  },
};

const mapsSchema: JsonSchema = {
  properties: {
    headers: {
      title: 'Headers',
      description: 'A string-to-string map.',
      type: 'object',
      additionalProperties: { type: 'string' },
      default: { 'x-team': 'platform' },
    },
    metadata: {
      title: 'Metadata',
      description:
        'Free-form values: pick a type per entry. Objects and arrays are edited as JSON.',
      type: 'object',
      additionalProperties: true,
      default: { owner: 'ops', replicas: 2, labels: { tier: 'gold' } },
    },
  },
};

const resourceSchema: JsonSchema = {
  properties: {
    external_service: {
      title: 'External service',
      type: 'string',
      description: 'Options come from `acceptableResourceTypes`.',
      'dial:resource': true,
      acceptableResourceTypes: ['external_services'],
    },
  },
  required: ['external_service'],
};

const LiveSchemaRenderer = (args: SchemaRendererProps) => {
  const [value, setValue] = useState<Record<string, unknown>>({});

  return (
    <div className="flex w-[640px] max-w-full flex-col gap-4">
      <SchemaRenderer
        {...args}
        onDefaultValues={setValue}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
      <pre className="dial-code-text overflow-auto rounded-lg border border-tertiary bg-layer-sunken p-3 text-secondary">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
};

const meta = {
  title: 'Components_2_0/SchemaRenderer',
  component: SchemaRenderer,
  render: (args) => <LiveSchemaRenderer {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Renders a JSON Schema as a form, built only from 2.0 controls. Objects and arrays become collapsible section cards; primitives become `Input`, `NumberInput`, `PasswordInput`, `Select`, `Switch` or `RadioGroup`; values the schema does not describe are edited as JSON in a monospace `Textarea`. The panel under each story shows the live form value.',
      },
    },
  },
  argTypes: {
    schema: { control: 'object', description: 'The root JSON Schema' },
    variant: {
      control: 'select',
      options: Object.values(SchemaRendererVariant),
      description: 'How top-level properties are laid out',
    },
    readonly: { control: 'boolean', description: 'Disables every input' },
    defaultExpanded: {
      control: 'boolean',
      description: 'Initial expanded state of every section',
    },
    skipUntouched: {
      control: 'boolean',
      description: 'Show required errors only after interaction',
    },
    defaultValue: { control: 'object', description: 'Initial form value' },
    texts: { control: 'object', description: 'Overrides for visible strings' },
  },
  args: {
    schema: primitivesSchema,
    variant: SchemaRendererVariant.Sections,
    readonly: false,
    defaultExpanded: true,
    skipUntouched: false,
  },
} satisfies Meta<typeof SchemaRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sections: Story = {};

export const Flat: Story = {
  args: { variant: SchemaRendererVariant.Flat },
};

export const FlatSections: Story = {
  args: { variant: SchemaRendererVariant.FlatSections, schema: nestedSchema },
};

export const NestedObjectsAndArrays: Story = {
  args: { schema: nestedSchema, variant: SchemaRendererVariant.Flat },
};

export const OneOfAndAnyOf: Story = {
  args: { schema: unionsSchema, variant: SchemaRendererVariant.Flat },
};

export const ArrayOfVariants: Story = {
  args: {
    schema: toolsSchema,
    defaultValue: {
      tools: [{ type: 'rest-api', name: 'Weather', url: '' }],
    },
  },
};

export const KeyValueMaps: Story = {
  args: { schema: mapsSchema },
};

export const ValuesOutsideTheSchema: Story = {
  args: {
    schema: { properties: { name: { title: 'Name', type: 'string' } } },
    defaultValue: { name: 'Legacy app', legacy_options: { retries: 2 } },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A key in the value that the schema does not declare is kept and edited as JSON. Invalid text shows an error and is not propagated until it parses.',
      },
    },
  },
};

export const ResourceOptions: Story = {
  args: {
    schema: resourceSchema,
    variant: SchemaRendererVariant.Flat,
    acceptableResourceTypes: {
      external_services: ['github', 'jira', 'confluence'],
    },
  },
};

export const SkipUntouched: Story = {
  args: { skipUntouched: true, variant: SchemaRendererVariant.Flat },
};

export const ReadOnly: Story = {
  args: {
    readonly: true,
    schema: nestedSchema,
    defaultValue: {
      service: { name: 'Billing', connection: { host: 'billing.internal' } },
      tags: ['internal', 'pci'],
    },
  },
};

export const CustomRenderField: Story = {
  args: {
    variant: SchemaRendererVariant.Flat,
    renderField: (path, _schema, defaultElement) =>
      path.join('.') === 'name' ? (
        <div className="flex flex-col gap-1">
          {defaultElement}
          <span className="dial-tiny-text text-secondary">
            Rendered through `renderField`: the label and error stay, the
            control can be wrapped or replaced.
          </span>
        </div>
      ) : (
        defaultElement
      ),
  },
};
