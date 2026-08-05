import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialSchemaRenderer } from './SchemaRenderer';
import {
  SchemaRendererVariant,
  SchemaDisplayMode,
  SchemaOrientation,
  type JsonSchema,
  type DialSchemaRendererProps,
} from './types';

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

const resourceSchema: JsonSchema = {
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the connection.',
    },
    external_service: {
      title: 'External Service',
      type: 'string',
      description:
        "Name of an entry in this application's external_services registry to source live auth credentials from",
      'dial:resource': true,
      acceptableResourceTypes: ['external_services'],
    },
  },
  required: ['external_service'],
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

const flatMixedSchema: JsonSchema = {
  properties: {
    title: {
      title: 'Title',
      type: 'string',
      description: 'Display name for this configuration.',
    },
    credentials: {
      title: 'Credentials',
      type: 'object',
      description: 'Authentication settings.',
      properties: {
        username: { title: 'Username', type: 'string' },
        password: {
          title: 'Password',
          type: 'string',
          isProtected: true,
        },
      },
      required: ['username', 'password'],
    },
    data: {
      title: 'Data',
      type: 'object',
      description: 'Data source settings.',
      properties: {
        namespace: { title: 'Namespace', type: 'string' },
        workspace: { title: 'Workspace', type: 'string' },
      },
      required: ['namespace'],
    },
  },
  required: ['title'],
};

const credentialsSchema: JsonSchema = {
  properties: {
    url: {
      title: 'URL',
      type: 'string',
      description: 'Base URL of the service.',
    },
    username: {
      title: 'Username',
      type: 'string',
    },
    token: {
      title: 'API Token',
      type: 'string',
      description: 'Personal access token for authentication.',
      isProtected: true,
    },
  },
  required: ['url', 'token'],
};

const hiddenFieldsSchema: JsonSchema = {
  properties: {
    name: {
      title: 'Name',
      type: 'string',
    },
    internalId: {
      title: 'Internal ID',
      type: 'string',
      isHidden: true,
      default: 'system-generated',
    },
    secret: {
      title: 'Secret',
      type: 'string',
      isHidden: true,
    },
  },
  required: ['name', 'internalId'],
};

const allOfDefaultsSchema: JsonSchema = {
  $defs: {
    DeIdentificationConfig: {
      additionalProperties: true,
      properties: {
        info_types: {
          default: ['PHONE_NUMBER', 'FIRST_NAME', 'LAST_NAME'],
          items: { type: 'string' },
          title: 'Info Types',
          type: 'array',
        },
      },
      title: 'DeIdentificationConfig',
      type: 'object',
    },
  },
  additionalProperties: true,
  properties: {
    deidentification_config: {
      allOf: [{ $ref: '#/$defs/DeIdentificationConfig' }],
      default: {
        info_types: ['PHONE_NUMBER', 'FIRST_NAME', 'LAST_NAME'],
      },
    },
  },
  title: 'GoogleDLPAnonymizerConfig',
  type: 'object',
};

const SchemaRendererWithPreview = (props: DialSchemaRendererProps) => {
  const [formValue, setFormValue] = useState<Record<string, unknown>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <details open>
        <summary
          style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '8px' }}
        >
          Form Value (JSON)
        </summary>
        <pre
          style={{
            padding: '12px',
            borderRadius: '6px',
            fontSize: '12px',
            maxHeight: '240px',
            overflow: 'auto',
            background: '#1e1e1e',
            color: '#d4d4d4',
          }}
        >
          {JSON.stringify(formValue, null, 2)}
        </pre>
      </details>
      <DialSchemaRenderer
        {...props}
        onChange={(v) => {
          setFormValue(v);
          props.onChange?.(v);
        }}
        onDefaultValues={(v) => {
          setFormValue(v);
          props.onDefaultValues?.(v);
        }}
      />
    </div>
  );
};

const meta: Meta<typeof DialSchemaRenderer> = {
  title: 'Components/SchemaRenderer',
  component: DialSchemaRenderer,
  render: (args) => <SchemaRendererWithPreview {...args} />,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        SchemaRendererVariant.Sections,
        SchemaRendererVariant.Flat,
        SchemaRendererVariant.FlatSections,
      ],
      description:
        "'sections' wraps each top-level property in a collapsible card; 'flat' renders primitives as plain form fields; 'flat-sections' renders an h2 heading above each section's fields",
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'When true, all inputs are disabled',
    },
    defaultExpanded: {
      control: { type: 'boolean' },
      description: 'Initial expanded state for all collapsible sections',
    },
    texts: {
      control: { type: 'object' },
      description:
        'Override any user-visible strings (placeholders, labels, etc.)',
    },
    renderField: {
      control: false,
      description:
        'Override the rendered element for any field by path; return defaultElement to fall back',
    },
    onChange: { action: 'onChange' },
    onPropertyChange: { action: 'onPropertyChange' },
    onDefaultValues: { action: 'onDefaultValues' },
  },
};

export default meta;
type Story = StoryObj<typeof DialSchemaRenderer>;

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

export const AdditionalProperties: Story = {
  args: {
    schema: simpleSchema,
    defaultValue: {
      name: 'My Config',
      count: 10,
      metadata: { owner: 'team-ai', tags: ['prod', 'eu'] },
      customFlag: true,
    },
  },
};

const indexesSchema: JsonSchema = {
  $defs: {
    TextEmbeddingsIndexerConfig: {
      title: 'Text Embeddings',
      type: 'object',
      properties: {
        type: {
          const: 'text_embeddings',
          default: 'text_embeddings',
          title: 'Type',
          type: 'string',
        },
        model: {
          title: 'Model',
          type: 'string',
          default: 'text-embedding-3-small',
        },
      },
    },
    Bm25IndexerConfig: {
      title: 'BM25',
      type: 'object',
      properties: {
        type: { const: 'bm25', default: 'bm25', title: 'Type', type: 'string' },
        k1: { title: 'K1', type: 'number', default: 1.2 },
      },
    },
    ChunkIndexConfig: {
      title: 'Chunk Index',
      type: 'object',
      properties: {
        type: {
          const: 'chunk',
          default: 'chunk',
          title: 'Type',
          type: 'string',
        },
        display_name: { title: 'Display Name', type: 'string' },
        indexer: {
          title: 'Indexer',
          discriminator: {
            propertyName: 'type',
            mapping: {
              text_embeddings: '#/$defs/TextEmbeddingsIndexerConfig',
              bm25: '#/$defs/Bm25IndexerConfig',
            },
          },
          oneOf: [
            { $ref: '#/$defs/TextEmbeddingsIndexerConfig' },
            { $ref: '#/$defs/Bm25IndexerConfig' },
          ],
        },
        default_limit: { title: 'Default Limit', type: 'integer', default: 7 },
      },
      required: ['display_name', 'indexer'],
    },
  },
  properties: {
    indexes: {
      title: 'Indexes',
      description: 'Map of index name to its configuration.',
      type: 'object',
      additionalProperties: {
        discriminator: {
          propertyName: 'type',
          mapping: { chunk: '#/$defs/ChunkIndexConfig' },
        },
        oneOf: [{ $ref: '#/$defs/ChunkIndexConfig' }],
      },
    },
  },
};

export const AdditionalPropertiesWithDiscriminator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Map values are discriminated objects with a nested discriminator field (indexer), ' +
          'mirroring the real `indexes`/`ChunkIndexConfig` schema. Click "Add field" to add a ' +
          "third entry and see it pre-seeded with the first variant's defaults at both levels " +
          '(chunk → text_embeddings), rather than starting as a bare type-selector.',
      },
    },
  },
  args: {
    schema: indexesSchema,
    defaultValue: {
      indexes: {
        primary: {
          type: 'chunk',
          display_name: 'Primary Index',
          indexer: { type: 'text_embeddings', model: 'text-embedding-3-small' },
          default_limit: 7,
        },
        'keyword-search': {
          type: 'chunk',
          display_name: 'Keyword Search Index',
          indexer: { type: 'bm25', k1: 1.2 },
          default_limit: 20,
        },
      },
    },
  },
};

export const ArrayWithDiscriminator: Story = {
  args: {
    schema: arraySchema,
    defaultValue: {
      tools: [{ type: 'rest-api', name: 'My API', url: 'https://example.com' }],
    },
  },
};

export const FlatSectionsVariant: Story = {
  args: {
    variant: SchemaRendererVariant.FlatSections,
    schema: flatMixedSchema,
  },
};

export const FlatWithRadioGroup: Story = {
  args: {
    variant: SchemaRendererVariant.Flat,
    schema: {
      $defs: {
        DirectConnection: {
          title: 'Direct',
          type: 'object',
          properties: {
            type: { const: 'direct', default: 'direct', type: 'string' },
            server: {
              title: 'Server',
              type: 'object',
              properties: {
                host: { title: 'Host', type: 'string' },
                port: { title: 'Port', type: 'integer', default: 5432 },
              },
              required: ['host'],
            },
            auth: {
              title: 'Authentication',
              type: 'object',
              properties: {
                username: { title: 'Username', type: 'string' },
                password: {
                  title: 'Password',
                  type: 'string',
                  isProtected: true,
                },
              },
            },
          },
          required: ['server'],
        },
        ProxyConnection: {
          title: 'Via proxy',
          type: 'object',
          properties: {
            type: { const: 'proxy', default: 'proxy', type: 'string' },
            proxy: {
              title: 'Proxy settings',
              type: 'object',
              properties: {
                proxyUrl: { title: 'Proxy URL', type: 'string' },
                port: { title: 'Port', type: 'integer', default: 8080 },
              },
              required: ['proxyUrl'],
            },
            credentials: {
              title: 'Credentials',
              type: 'object',
              properties: {
                username: { title: 'Username', type: 'string' },
                password: {
                  title: 'Password',
                  type: 'string',
                  isProtected: true,
                },
              },
            },
          },
          required: ['proxy'],
        },
        SshConnection: {
          title: 'SSH tunnel',
          type: 'object',
          properties: {
            type: { const: 'ssh', default: 'ssh', type: 'string' },
            tunnel: {
              title: 'Tunnel',
              type: 'object',
              properties: {
                sshHost: { title: 'SSH Host', type: 'string' },
                sshPort: { title: 'SSH Port', type: 'integer', default: 22 },
              },
              required: ['sshHost'],
            },
            keys: {
              title: 'Keys',
              type: 'object',
              properties: {
                privateKey: {
                  title: 'Private Key',
                  type: 'string',
                  isProtected: true,
                },
                passphrase: {
                  title: 'Passphrase',
                  type: 'string',
                  isProtected: true,
                },
              },
            },
          },
          required: ['tunnel'],
        },
      },
      properties: {
        name: {
          title: 'Connection name',
          type: 'string',
        },
        connection: {
          title: 'Connection type',
          discriminatorDisplay: SchemaDisplayMode.Radio,
          discriminatorOrientation: SchemaOrientation.Row,
          discriminator: {
            propertyName: 'type',
            mapping: {
              direct: '#/$defs/DirectConnection',
              proxy: '#/$defs/ProxyConnection',
              ssh: '#/$defs/SshConnection',
            },
          },
          oneOf: [
            { $ref: '#/$defs/DirectConnection' },
            { $ref: '#/$defs/ProxyConnection' },
            { $ref: '#/$defs/SshConnection' },
          ],
        },
      },
      required: ['name'],
    } as JsonSchema,
  },
};

export const RadioGroupDiscriminator: Story = {
  args: {
    schema: {
      $defs: {
        EmailNotification: {
          title: 'Email',
          type: 'object',
          properties: {
            type: { const: 'email', default: 'email', type: 'string' },
            address: { title: 'Email Address', type: 'string' },
            subject: {
              title: 'Subject',
              type: 'string',
              default: 'Notification',
            },
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
        SlackNotification: {
          title: 'Slack',
          type: 'object',
          properties: {
            type: { const: 'slack', default: 'slack', type: 'string' },
            channel: { title: 'Channel', type: 'string' },
          },
          required: ['channel'],
        },
      },
      properties: {
        notification: {
          title: 'Notification channel',
          discriminatorDisplay: SchemaDisplayMode.Radio,
          discriminator: {
            propertyName: 'type',
            mapping: {
              email: '#/$defs/EmailNotification',
              webhook: '#/$defs/WebhookNotification',
              slack: '#/$defs/SlackNotification',
            },
          },
          oneOf: [
            { $ref: '#/$defs/EmailNotification' },
            { $ref: '#/$defs/WebhookNotification' },
            { $ref: '#/$defs/SlackNotification' },
          ],
        },
      },
    } as JsonSchema,
  },
};

export const RadioEnumFields: Story = {
  args: {
    schema: {
      properties: {
        plan: {
          title: 'Plan',
          type: 'string',
          enum: ['free', 'pro', 'enterprise'],
          default: 'free',
          enumDisplay: SchemaDisplayMode.Radio,
        },
        direction: {
          title: 'Direction',
          type: 'string',
          enum: ['left', 'center', 'right'],
          default: 'center',
          enumDisplay: SchemaDisplayMode.Radio,
          enumOrientation: SchemaOrientation.Row,
        },
        mode: {
          title: 'Mode (select fallback)',
          type: 'string',
          enum: ['fast', 'balanced', 'accurate'],
          default: 'balanced',
        },
      },
    },
    variant: SchemaRendererVariant.Flat,
  },
};

export const Credentials: Story = {
  args: { schema: credentialsSchema, variant: SchemaRendererVariant.Flat },
};

export const HiddenFields: Story = {
  args: {
    schema: hiddenFieldsSchema,
    variant: SchemaRendererVariant.Flat,
  },
};

export const FlatWithGroups: Story = {
  args: { schema: flatMixedSchema, variant: SchemaRendererVariant.Flat },
};

export const ResourceField: Story = {
  args: {
    schema: resourceSchema,
    variant: SchemaRendererVariant.Flat,
    acceptableResourceTypes: {
      external_services: ['openai-prod', 'anthropic-prod', 'azure-staging'],
    },
  },
};

export const AllOfWithDefaults: Story = {
  args: {
    schema: allOfDefaultsSchema,
    defaultValue: {
      deidentification_config: {
        info_types: [
          'PHONE_NUMBER',
          'FIRST_NAME',
          'LAST_NAME',
          'DATE_OF_BIRTH',
        ],
      },
    },
  },
};

export const CustomFieldRenderer: Story = {
  args: {
    schema: simpleSchema,
    renderField: (path, _schema, defaultElement) => {
      if (path[path.length - 1] === 'name') {
        return (
          <div
            style={{
              border: '2px dashed #888',
              padding: '4px',
              borderRadius: '4px',
            }}
          >
            {defaultElement}
          </div>
        );
      }
      return defaultElement;
    },
  },
};

export const SkipUntouchedComparison: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>
          skipUntouched: false (default) — errors shown immediately
        </h3>
        <SchemaRendererWithPreview
          schema={credentialsSchema}
          variant={SchemaRendererVariant.Flat}
          skipUntouched={false}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>
          skipUntouched: true — errors shown only after interaction
        </h3>
        <SchemaRendererWithPreview
          schema={credentialsSchema}
          variant={SchemaRendererVariant.Flat}
          skipUntouched={true}
        />
      </div>
    </div>
  ),
};
