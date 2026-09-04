import { createRoot } from 'react-dom/client';
import {
  DialSchemaRenderer,
  SchemaRendererVariant,
  type JsonSchema,
} from '@epam/ai-dial-ui-kit';

const schema = {
  type: 'object',
  properties: {},
  additionalProperties: true,
} satisfies JsonSchema;

/**
 * The undeclared `fixturePayload` key takes the
 * SchemaAdditionalPropertiesEditor path. That component mounts with the
 * application but reaches Monaco only through its own dynamic import.
 */
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <DialSchemaRenderer
      schema={schema}
      defaultValue={{ fixturePayload: { nested: true } }}
      variant={SchemaRendererVariant.Flat}
    />,
  );
}
