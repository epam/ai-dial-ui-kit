import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import type { JsonSchema } from '@/models/json-schema';
import {
  SchemaDisplayMode,
  SchemaOrientation,
  SchemaRendererVariant,
} from '@/types/json-schema';
import { useSchemaContext } from './context';
import { SchemaRenderer } from './SchemaRenderer';
import type { SchemaRendererProps } from './types';

const primitivesSchema: JsonSchema = {
  properties: {
    name: { title: 'Name', type: 'string', description: 'Display name' },
    count: { title: 'Count', type: 'integer', default: 5 },
    ratio: { title: 'Ratio', type: 'number' },
    enabled: { title: 'Enabled', type: 'boolean', default: true },
    mode: {
      title: 'Mode',
      type: 'string',
      enum: ['fast', 'accurate'],
      default: 'fast',
    },
    token: { title: 'Token', type: 'string', isProtected: true },
    kind: { title: 'Kind', type: 'string', const: 'fixed' },
    hidden: { title: 'Hidden', type: 'string', isHidden: true },
  },
  required: ['name'],
};

const renderFlat = (props: Partial<SchemaRendererProps> = {}) =>
  render(
    <SchemaRenderer
      schema={primitivesSchema}
      variant={SchemaRendererVariant.Flat}
      {...props}
    />,
  );

const chooseOption = (comboboxName: string, optionName: string) => {
  fireEvent.click(screen.getByRole('combobox', { name: comboboxName }));
  fireEvent.click(screen.getByRole('option', { name: optionName }));
};

describe('Dial UI Kit :: SchemaRenderer (2.0)', () => {
  describe('defaults', () => {
    test('reports the schema defaults once on mount', () => {
      const onDefaultValues = vi.fn();
      renderFlat({ onDefaultValues });

      expect(onDefaultValues).toHaveBeenCalledTimes(1);
      expect(onDefaultValues).toHaveBeenCalledWith({
        count: 5,
        enabled: true,
        mode: 'fast',
      });
    });

    test('prefers the provided defaultValue over the schema defaults', () => {
      const onDefaultValues = vi.fn();
      renderFlat({ defaultValue: { name: 'Preset' }, onDefaultValues });

      expect(onDefaultValues).toHaveBeenCalledWith({ name: 'Preset' });
      expect(screen.getByRole('textbox', { name: /Name/ })).toHaveValue(
        'Preset',
      );
    });
  });

  describe('flat variant controls', () => {
    test('names every primitive control by its label', () => {
      renderFlat();

      expect(
        screen.getByRole('textbox', { name: /^Name/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('spinbutton', { name: 'Count' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('spinbutton', { name: 'Ratio' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: 'Enabled' })).toBeChecked();
      expect(screen.getByRole('combobox', { name: 'Mode' })).toHaveValue(
        'fast',
      );
      expect(screen.getByLabelText('Token')).toHaveAttribute(
        'type',
        'password',
      );
      expect(screen.getByRole('textbox', { name: 'Kind' })).toBeDisabled();
      expect(screen.getByRole('textbox', { name: 'Kind' })).toHaveValue(
        'fixed',
      );
    });

    test('does not render hidden properties', () => {
      renderFlat();

      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });

    test('exposes the description through the label info button', () => {
      renderFlat();

      expect(
        screen.getByRole('button', { name: 'Display name' }),
      ).toBeInTheDocument();
    });

    test('reports string, number and boolean edits', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onPropertyChange = vi.fn();
      renderFlat({ onChange, onPropertyChange });

      await user.type(screen.getByRole('textbox', { name: /^Name/ }), 'A');
      expect(onPropertyChange).toHaveBeenLastCalledWith('name', 'A');

      await user.clear(screen.getByRole('spinbutton', { name: 'Count' }));
      await user.type(screen.getByRole('spinbutton', { name: 'Count' }), '7');
      expect(onPropertyChange).toHaveBeenLastCalledWith('count', 7);

      await user.click(screen.getByRole('switch', { name: 'Enabled' }));
      expect(onPropertyChange).toHaveBeenLastCalledWith('enabled', false);
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ name: 'A', count: 7, enabled: false }),
      );
    });

    test('reports an enum selection', () => {
      const onPropertyChange = vi.fn();
      renderFlat({ onPropertyChange });

      chooseOption('Mode', 'accurate');

      expect(onPropertyChange).toHaveBeenLastCalledWith('mode', 'accurate');
    });

    test('renders an enum as a named radio group with enumDisplay radio', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          variant={SchemaRendererVariant.Flat}
          onPropertyChange={onPropertyChange}
          schema={{
            properties: {
              size: {
                title: 'Size',
                type: 'string',
                enum: ['s', 'm'],
                enumDisplay: SchemaDisplayMode.Radio,
                enumOrientation: SchemaOrientation.Row,
              },
            },
          }}
        />,
      );

      const group = screen.getByRole('radiogroup', { name: 'Size' });
      fireEvent.click(within(group).getByRole('radio', { name: 'm' }));

      expect(onPropertyChange).toHaveBeenLastCalledWith('size', 'm');
    });

    test('disables every control when readonly', () => {
      renderFlat({ readonly: true });

      expect(screen.getByRole('textbox', { name: /^Name/ })).toBeDisabled();
      expect(screen.getByRole('spinbutton', { name: 'Count' })).toBeDisabled();
      expect(screen.getByRole('switch', { name: 'Enabled' })).toBeDisabled();
    });

    test('offers the live options of a dial:resource field', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          variant={SchemaRendererVariant.Flat}
          onPropertyChange={onPropertyChange}
          acceptableResourceTypes={{ model: ['gpt-4', 'claude'] }}
          schema={{
            properties: {
              model: {
                title: 'Model',
                type: 'string',
                'dial:resource': true,
                acceptableResourceTypes: ['model', 'missing'],
              },
            },
          }}
        />,
      );

      chooseOption('Model', 'claude');

      expect(onPropertyChange).toHaveBeenLastCalledWith('model', 'claude');
    });
  });

  describe('required fields', () => {
    test('shows the required error immediately by default', () => {
      renderFlat();

      expect(screen.getByText('"Name" is required')).toBeInTheDocument();
      // the error styling lands on the field wrapper, not the <input>
      expect(
        screen
          .getByRole('textbox', { name: /^Name/ })
          .closest('.dial-kit-input-error'),
      ).not.toBeNull();
    });

    test('waits for an interaction with skipUntouched', async () => {
      const user = userEvent.setup();
      renderFlat({ skipUntouched: true, defaultValue: { name: 'x' } });

      expect(screen.queryByText('"Name" is required')).not.toBeInTheDocument();

      await user.clear(screen.getByRole('textbox', { name: /^Name/ }));

      expect(screen.getByText('"Name" is required')).toBeInTheDocument();
    });

    test('counts a missing required top-level value on its section', () => {
      render(<SchemaRenderer schema={primitivesSchema} />);

      const nameSection = screen.getByRole('button', { name: 'Name' })
        .parentElement as HTMLElement;
      expect(within(nameSection).getByText('1 error')).toBeInTheDocument();
      expect(screen.getByText('"Name" is required')).toBeInTheDocument();
    });

    test('hides section errors until touched with skipUntouched', () => {
      render(<SchemaRenderer schema={primitivesSchema} skipUntouched />);

      expect(screen.queryByText('1 error')).not.toBeInTheDocument();
    });
  });

  describe('sections variant', () => {
    test('wraps each property in a section named by its title', () => {
      render(<SchemaRenderer schema={primitivesSchema} />);

      const toggle = screen.getByRole('button', { name: 'Count' });
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(
        screen.getByRole('spinbutton', { name: 'Count' }),
      ).toBeInTheDocument();
    });

    test('collapses and expands a section from its header button', () => {
      render(<SchemaRenderer schema={primitivesSchema} />);

      const toggle = screen.getByRole('button', { name: 'Count' });
      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(
        screen.queryByRole('spinbutton', { name: 'Count' }),
      ).not.toBeInTheDocument();

      fireEvent.click(toggle);
      const contentId = toggle.getAttribute('aria-controls') ?? '';
      expect(document.getElementById(contentId)).toContainElement(
        screen.getByRole('spinbutton', { name: 'Count' }),
      );
    });

    test('starts collapsed with defaultExpanded false', () => {
      render(
        <SchemaRenderer schema={primitivesSchema} defaultExpanded={false} />,
      );

      expect(screen.getByRole('button', { name: 'Count' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  describe('flat-sections variant', () => {
    test('puts each property under a heading', () => {
      render(
        <SchemaRenderer
          schema={primitivesSchema}
          variant={SchemaRendererVariant.FlatSections}
        />,
      );

      expect(
        screen.getByRole('heading', { level: 2, name: 'Count' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('spinbutton', { name: 'Count' }),
      ).toBeInTheDocument();
    });
  });

  describe('nested objects', () => {
    const nestedSchema: JsonSchema = {
      $defs: {
        Connection: {
          type: 'object',
          title: 'Connection',
          properties: {
            host: { title: 'Host', type: 'string' },
            port: { title: 'Port', type: 'integer' },
          },
          required: ['host'],
        },
      },
      properties: {
        settings: {
          type: 'object',
          title: 'Settings',
          properties: {
            connection: { $ref: '#/$defs/Connection' },
            empty: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
          },
        },
      },
    };

    test('renders nested objects as sections with a summary', () => {
      render(
        <SchemaRenderer
          schema={nestedSchema}
          defaultValue={{ settings: { connection: { host: 'h' } } }}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Connection' }),
      ).toBeInTheDocument();
      expect(screen.getByText('1/2 fields')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /^Host/ })).toHaveValue('h');
      expect(
        screen.getByText('No configurable properties.'),
      ).toBeInTheDocument();
    });

    test('propagates a nested edit up to the root value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SchemaRenderer schema={nestedSchema} onChange={onChange} />);

      await user.type(screen.getByRole('textbox', { name: /^Host/ }), 'x');

      expect(onChange).toHaveBeenLastCalledWith({
        settings: { connection: { host: 'x' } },
      });
    });
  });

  describe('arrays', () => {
    const arraySchema: JsonSchema = {
      properties: {
        tags: { title: 'Tags', type: 'array', items: { type: 'string' } },
        noItems: { title: 'No items', type: 'array' },
      },
    };

    test('adds, edits and removes items', async () => {
      const user = userEvent.setup();
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={arraySchema}
          defaultValue={{ tags: ['a'] }}
          onPropertyChange={onPropertyChange}
        />,
      );

      expect(screen.getByRole('textbox', { name: 'Item 1' })).toHaveValue('a');

      await user.click(screen.getAllByRole('button', { name: 'Add Item' })[0]);
      expect(onPropertyChange).toHaveBeenLastCalledWith('tags', ['a', '']);

      await user.click(
        screen.getByRole('button', { name: 'Remove item: Item 1' }),
      );
      expect(onPropertyChange).toHaveBeenLastCalledWith('tags', ['']);
    });

    test('explains an array without an item schema', () => {
      render(<SchemaRenderer schema={arraySchema} />);

      expect(screen.getByText('No item schema defined.')).toBeInTheDocument();
      expect(
        screen.getByText('No items yet. Add one below.'),
      ).toBeInTheDocument();
    });

    test('hides the add and remove controls when readonly', () => {
      render(
        <SchemaRenderer
          schema={arraySchema}
          defaultValue={{ tags: ['a'] }}
          readonly
        />,
      );

      expect(
        screen.queryByRole('button', { name: 'Add Item' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Remove item/ }),
      ).not.toBeInTheDocument();
    });

    test('adds an item of the chosen discriminator type', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          onPropertyChange={onPropertyChange}
          schema={{
            $defs: {
              Cat: {
                type: 'object',
                properties: {
                  kind: { type: 'string', const: 'cat' },
                  lives: { type: 'integer', default: 9 },
                },
              },
              Dog: {
                type: 'object',
                properties: { kind: { type: 'string', const: 'dog' } },
              },
            },
            properties: {
              pets: {
                title: 'Pets',
                type: 'array',
                items: {
                  oneOf: [{ $ref: '#/$defs/Cat' }, { $ref: '#/$defs/Dog' }],
                  discriminator: {
                    propertyName: 'kind',
                    mapping: { cat: '#/$defs/Cat', dog: '#/$defs/Dog' },
                  },
                },
              },
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
      expect(onPropertyChange).toHaveBeenLastCalledWith('pets', [
        { kind: 'cat', lives: 9 },
      ]);

      chooseOption('Select type to add…', 'dog');
      fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
      expect(onPropertyChange).toHaveBeenLastCalledWith('pets', [
        { kind: 'cat', lives: 9 },
        { kind: 'dog' },
      ]);
      expect(
        screen.getByRole('button', { name: 'Item 2: dog' }),
      ).toBeInTheDocument();
    });
  });

  describe('oneOf', () => {
    const defs = {
      Openai: {
        type: 'object',
        title: 'OpenAI',
        properties: {
          provider: { type: 'string', const: 'openai' },
          apiKey: { title: 'API key', type: 'string' },
        },
      },
      Local: {
        type: 'object',
        title: 'Local',
        properties: {
          provider: { type: 'string', const: 'local' },
          path: { title: 'Path', type: 'string', default: '/models' },
        },
      },
    };
    const discriminated = (
      extra: Record<string, unknown> = {},
    ): JsonSchema => ({
      $defs: defs,
      properties: {
        backend: {
          title: 'Backend',
          oneOf: [{ $ref: '#/$defs/Openai' }, { $ref: '#/$defs/Local' }],
          discriminator: {
            propertyName: 'provider',
            mapping: { openai: '#/$defs/Openai', local: '#/$defs/Local' },
          },
          ...extra,
        },
      },
    });

    test('switches the variant from a select and applies its defaults', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={discriminated()}
          defaultValue={{ backend: { provider: 'openai' } }}
          onPropertyChange={onPropertyChange}
        />,
      );

      expect(
        screen.getByRole('textbox', { name: /^API key/ }),
      ).toBeInTheDocument();

      chooseOption('Backend', 'local');

      expect(onPropertyChange).toHaveBeenLastCalledWith('backend', {
        provider: 'local',
        path: '/models',
      });
      expect(screen.getByRole('textbox', { name: /^Path/ })).toHaveValue(
        '/models',
      );
    });

    test('shows the variant editor under the selected radio in a column', () => {
      render(
        <SchemaRenderer
          schema={discriminated({
            discriminatorDisplay: SchemaDisplayMode.Radio,
          })}
          defaultValue={{ backend: { provider: 'local', path: 'p' } }}
        />,
      );

      const group = screen.getByRole('radiogroup', { name: 'Backend' });
      expect(within(group).getByRole('radio', { name: 'Local' })).toBeChecked();
      expect(within(group).getByRole('textbox', { name: /^Path/ })).toHaveValue(
        'p',
      );
      // the discriminator property is the radio itself, not a field
      expect(
        screen.queryByRole('textbox', { name: /Provider/ }),
      ).not.toBeInTheDocument();
    });

    test('shows the variant editor below a row of radios', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={discriminated({
            discriminatorDisplay: SchemaDisplayMode.Radio,
            discriminatorOrientation: SchemaOrientation.Row,
          })}
          defaultValue={{ backend: { provider: 'openai' } }}
          onPropertyChange={onPropertyChange}
        />,
      );

      const group = screen.getByRole('radiogroup', { name: 'Backend' });
      expect(
        within(group).queryByRole('textbox', { name: /^API key/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: /^API key/ }),
      ).toBeInTheDocument();

      fireEvent.click(within(group).getByRole('radio', { name: 'Local' }));
      expect(onPropertyChange).toHaveBeenLastCalledWith('backend', {
        provider: 'local',
        path: '/models',
      });
    });

    const undiscriminated = (
      extra: Record<string, unknown> = {},
    ): JsonSchema => ({
      properties: {
        auth: {
          title: 'Auth',
          oneOf: [
            {
              title: 'Key',
              type: 'object',
              properties: { key: { title: 'Key value', type: 'string' } },
              required: ['key'],
            },
            {
              title: 'Basic',
              type: 'object',
              properties: {
                user: { title: 'User', type: 'string', default: 'admin' },
              },
              required: ['user'],
            },
          ],
          ...extra,
        },
      },
    });

    test('detects the variant without a discriminator from required keys', () => {
      render(
        <SchemaRenderer
          schema={undiscriminated()}
          defaultValue={{ auth: { user: 'root' } }}
        />,
      );

      expect(screen.getByRole('combobox', { name: 'Auth' })).toHaveValue(
        'Basic',
      );
      expect(screen.getByRole('textbox', { name: /^User/ })).toHaveValue(
        'root',
      );
    });

    test('switches an undiscriminated variant from a select', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={undiscriminated()}
          onPropertyChange={onPropertyChange}
        />,
      );

      chooseOption('Auth', 'Basic');

      expect(onPropertyChange).toHaveBeenLastCalledWith('auth', {
        user: 'admin',
      });
    });

    test('switches an undiscriminated variant from radios', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={undiscriminated({
            discriminatorDisplay: SchemaDisplayMode.Radio,
          })}
          onPropertyChange={onPropertyChange}
        />,
      );

      const group = screen.getByRole('radiogroup', { name: 'Auth' });
      expect(
        within(group).getByRole('textbox', { name: /^Key value/ }),
      ).toBeInTheDocument();

      fireEvent.click(within(group).getByRole('radio', { name: 'Basic' }));
      expect(onPropertyChange).toHaveBeenLastCalledWith('auth', {
        user: 'admin',
      });
    });
  });

  describe('anyOf', () => {
    const nullableSchema: JsonSchema = {
      properties: {
        alias: {
          title: 'Alias',
          anyOf: [{ type: 'null' }, { type: 'string' }],
        },
        limits: {
          title: 'Limits',
          anyOf: [
            { type: 'null' },
            { type: 'array', items: { type: 'string' } },
          ],
        },
      },
    };

    test('shows no editor while the null variant is selected', () => {
      render(<SchemaRenderer schema={nullableSchema} />);

      expect(screen.getByRole('combobox', { name: 'Alias' })).toHaveValue(
        'null',
      );
      expect(
        screen.queryByRole('textbox', { name: 'Alias' }),
      ).not.toBeInTheDocument();
    });

    test('switches to a typed variant and back to null', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={nullableSchema}
          onPropertyChange={onPropertyChange}
        />,
      );

      chooseOption('Alias', 'string');
      expect(onPropertyChange).toHaveBeenLastCalledWith('alias', '');
      expect(
        screen.getByRole('textbox', { name: 'Alias' }),
      ).toBeInTheDocument();

      chooseOption('Limits', 'array');
      expect(onPropertyChange).toHaveBeenLastCalledWith('limits', []);

      chooseOption('Alias', 'null');
      expect(onPropertyChange).toHaveBeenLastCalledWith('alias', null);
    });
  });

  describe('key-value maps', () => {
    const mapSchema: JsonSchema = {
      properties: {
        labels: {
          title: 'Labels',
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    };

    test('edits keys on blur and values inline', async () => {
      const user = userEvent.setup();
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={mapSchema}
          defaultValue={{ labels: { env: 'prod' } }}
          onPropertyChange={onPropertyChange}
        />,
      );

      const key = screen.getByRole('textbox', { name: 'Key' });
      await user.clear(key);
      await user.type(key, 'stage');
      await user.tab();
      expect(onPropertyChange).toHaveBeenLastCalledWith('labels', {
        stage: 'prod',
      });

      await user.type(screen.getByRole('textbox', { name: 'stage' }), '!');
      expect(onPropertyChange).toHaveBeenLastCalledWith('labels', {
        stage: 'prod!',
      });

      await user.click(
        screen.getByRole('button', { name: 'Remove field: stage' }),
      );
      expect(onPropertyChange).toHaveBeenLastCalledWith('labels', {});
      expect(
        screen.getByText('No fields yet. Add one below.'),
      ).toBeInTheDocument();
    });

    test('flags an empty key once it has been left', async () => {
      const user = userEvent.setup();
      render(<SchemaRenderer schema={mapSchema} skipUntouched />);

      await user.click(screen.getByRole('button', { name: 'Add Field' }));
      expect(screen.queryByText('Key is required')).not.toBeInTheDocument();

      await user.click(screen.getByRole('textbox', { name: 'Key' }));
      await user.tab();
      expect(screen.getByText('Key is required')).toBeInTheDocument();
    });

    test('renders object values as sections', () => {
      render(
        <SchemaRenderer
          schema={{
            properties: {
              servers: {
                title: 'Servers',
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: { url: { title: 'URL', type: 'string' } },
                  required: ['url'],
                },
              },
            },
          }}
          defaultValue={{ servers: { main: {} } }}
        />,
      );

      expect(screen.getByRole('button', { name: 'main' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /^URL/ })).toBeInTheDocument();
      expect(screen.getAllByText('1 error').length).toBeGreaterThan(0);
    });

    describe('with unschematized values', () => {
      const freeSchema: JsonSchema = {
        properties: {
          extra: { title: 'Extra', type: 'object', additionalProperties: true },
        },
      };

      test('changes an entry type and resets its value', () => {
        const onPropertyChange = vi.fn();
        render(
          <SchemaRenderer
            schema={freeSchema}
            defaultValue={{ extra: { flag: 'x' } }}
            onPropertyChange={onPropertyChange}
          />,
        );

        chooseOption('Type', 'Boolean');
        expect(onPropertyChange).toHaveBeenLastCalledWith('extra', {
          flag: false,
        });

        chooseOption('flag', 'True');
        expect(onPropertyChange).toHaveBeenLastCalledWith('extra', {
          flag: true,
        });

        chooseOption('Type', 'Null');
        expect(screen.getByRole('textbox', { name: 'flag' })).toHaveValue(
          'null',
        );
      });

      test('edits an object entry as JSON', () => {
        const onPropertyChange = vi.fn();
        render(
          <SchemaRenderer
            schema={freeSchema}
            defaultValue={{ extra: { meta: { a: 1 } } }}
            onPropertyChange={onPropertyChange}
          />,
        );

        const editor = screen.getByRole('textbox', { name: 'meta' });
        expect(editor.tagName).toBe('TEXTAREA');

        fireEvent.change(editor, { target: { value: '{"a": 2}' } });
        expect(onPropertyChange).toHaveBeenLastCalledWith('extra', {
          meta: { a: 2 },
        });
      });
    });
  });

  describe('values outside the schema', () => {
    test('edits an undeclared key as JSON and flags invalid text', () => {
      const onPropertyChange = vi.fn();
      render(
        <SchemaRenderer
          schema={{ properties: {} }}
          defaultValue={{ legacy_flag: { on: true } }}
          onPropertyChange={onPropertyChange}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Legacy Flag' }),
      ).toBeInTheDocument();
      const editor = screen.getByRole('textbox', { name: 'Legacy Flag' });
      expect(editor).toHaveValue('{\n  "on": true\n}');

      fireEvent.change(editor, { target: { value: '{"on": ' } });
      expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
      expect(onPropertyChange).not.toHaveBeenCalled();

      fireEvent.change(editor, { target: { value: '{"on": false}' } });
      expect(screen.queryByText('Invalid JSON')).not.toBeInTheDocument();
      expect(onPropertyChange).toHaveBeenLastCalledWith('legacy_flag', {
        on: false,
      });
    });

    test('renders undeclared keys under a heading in flat variants', () => {
      render(
        <SchemaRenderer
          schema={{ properties: {} }}
          variant={SchemaRendererVariant.Flat}
          defaultValue={{ legacy: 1 }}
        />,
      );

      expect(
        screen.getByRole('heading', { level: 2, name: 'Legacy' }),
      ).toBeInTheDocument();
    });

    test('edits an object with no fixed properties as JSON', () => {
      render(
        <SchemaRenderer
          variant={SchemaRendererVariant.Flat}
          schema={{ properties: { blob: { title: 'Blob', type: 'object' } } }}
        />,
      );

      expect(screen.getByRole('textbox', { name: 'Blob' }).tagName).toBe(
        'TEXTAREA',
      );
    });
  });

  describe('renderField', () => {
    test('replaces the control but keeps the label', () => {
      const renderField = vi.fn((path: string[], _schema, defaultElement) =>
        path.join('.') === 'name' ? (
          <span>custom control</span>
        ) : (
          defaultElement
        ),
      );
      renderFlat({ renderField });

      expect(screen.getByText('custom control')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(
        screen.queryByRole('textbox', { name: /^Name/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('spinbutton', { name: 'Count' }),
      ).toBeInTheDocument();
    });
  });

  test('applies texts overrides', () => {
    render(
      <SchemaRenderer
        schema={{
          properties: {
            list: { title: 'List', type: 'array', items: { type: 'string' } },
          },
        }}
        texts={{ addItem: 'Append', noItemsYet: 'Empty list' }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Append' })).toBeInTheDocument();
    expect(screen.getByText('Empty list')).toBeInTheDocument();
  });

  test('useSchemaContext throws outside a SchemaRenderer', () => {
    const Consumer = () => {
      useSchemaContext();
      return null;
    };
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      'useSchemaContext must be used inside SchemaRenderer',
    );
  });
});
