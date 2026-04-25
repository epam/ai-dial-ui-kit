import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialSchemeRenderer } from './SchemeRenderer';
import type { JsonSchema } from './types';
import { SCHEME_JSON } from './scheme';

const simpleSchema: JsonSchema = {
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the configuration.',
    },
    count: {
      title: 'Count',
      type: 'integer',
      description: 'How many items.',
      default: 5,
    },
    enabled: {
      title: 'Enabled',
      type: 'boolean',
      default: true,
    },
    mode: {
      title: 'Mode',
      type: 'string',
      enum: ['fast', 'balanced', 'accurate'],
      default: 'balanced',
    },
  },
  required: ['name'],
};

const oneOfSchema: JsonSchema = {
  $defs: {
    EmailNotification: {
      title: 'Email Notification',
      type: 'object',
      properties: {
        type: {
          const: 'email',
          default: 'email',
          title: 'Type',
          type: 'string',
        },
        address: { title: 'Email Address', type: 'string' },
        subject: { title: 'Subject', type: 'string', default: 'Notification' },
      },
      required: ['address'],
    },
    WebhookNotification: {
      title: 'Webhook Notification',
      type: 'object',
      properties: {
        type: {
          const: 'webhook',
          default: 'webhook',
          title: 'Type',
          type: 'string',
        },
        url: { title: 'Webhook URL', type: 'string' },
        retries: { title: 'Retries', type: 'integer', default: 3 },
      },
      required: ['url'],
    },
  },
  properties: {
    notification: {
      title: 'Notification',
      description: 'How to send notifications.',
      discriminator: {
        propertyName: 'type',
        mapping: {
          email: '#/$defs/EmailNotification',
          webhook: '#/$defs/WebhookNotification',
        },
      },
      oneOf: [
        { $ref: '#/$defs/EmailNotification' },
        { $ref: '#/$defs/WebhookNotification' },
      ],
    },
    tags: {
      title: 'Tags',
      description: 'Optional list of tags.',
      anyOf: [{ type: 'array', items: { type: 'string' } }, { type: 'null' }],
      default: null,
    },
  },
  required: ['notification'],
};

const arraySchema: JsonSchema = {
  $defs: {
    RestApiTool: {
      title: 'REST API Tool',
      type: 'object',
      properties: {
        type: {
          const: 'rest-api',
          default: 'rest-api',
          title: 'Type',
          type: 'string',
        },
        name: { title: 'Name', type: 'string' },
        url: { title: 'URL', type: 'string' },
      },
      required: ['name', 'url'],
    },
    InternalTool: {
      title: 'Internal Tool',
      type: 'object',
      properties: {
        type: {
          const: 'internal',
          default: 'internal',
          title: 'Type',
          type: 'string',
        },
        name: { title: 'Name', type: 'string' },
        enabled: { title: 'Enabled', type: 'boolean', default: true },
      },
      required: ['name'],
    },
  },
  properties: {
    tools: {
      title: 'Tools',
      description: 'The list of tools.',
      type: 'array',
      items: {
        discriminator: {
          propertyName: 'type',
          mapping: {
            'rest-api': '#/$defs/RestApiTool',
            internal: '#/$defs/InternalTool',
          },
        },
        oneOf: [
          { $ref: '#/$defs/RestApiTool' },
          { $ref: '#/$defs/InternalTool' },
        ],
      },
    },
  },
};

const meta: Meta<typeof DialSchemeRenderer> = {
  title: 'Components/SchemeRenderer',
  component: DialSchemeRenderer,
  parameters: { layout: 'padded' },
  argTypes: {
    onChange: { action: 'onChange' },
    onPropertyChange: { action: 'onPropertyChange' },
    onDefaultValues: { action: 'onDefaultValues' },
  },
};

export default meta;
type Story = StoryObj<typeof DialSchemeRenderer>;

export const SimpleFields: Story = {
  args: { schema: simpleSchema },
};

export const WithDefaultValue: Story = {
  args: {
    schema: simpleSchema,
    defaultValue: {
      name: 'My Config',
      count: 10,
      enabled: false,
      mode: 'fast',
    },
  },
};

export const OneOfDiscriminator: Story = {
  args: { schema: oneOfSchema },
};

export const ArrayWithDiscriminator: Story = {
  args: {
    schema: arraySchema,
    defaultValue: {
      tools: [{ type: 'rest-api', name: 'My API', url: 'https://example.com' }],
    },
  },
};

export const QuickAppScheme: Story = {
  args: {
    schema: SCHEME_JSON,
  },
};
