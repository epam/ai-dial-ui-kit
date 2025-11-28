import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useMemo, useState, type FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  DialDraggableItem,
  type DialDraggableItemProps,
} from './DraggableItem';

const meta = {
  title: 'Components/DraggableItem',
  component: DialDraggableItem,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        <div className="text-primary">
          <Story />
        </div>
      </DndProvider>
    ),
  ],
  argTypes: {
    id: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    handleAriaLabel: { control: { type: 'text' } },
    findItem: { control: false },
    moveItem: { control: false },
    children: { control: { type: 'text' } },
  },
  args: {
    id: 'item-1',
    children: 'Draggable row',
    handleAriaLabel: 'Drag item',
  },
} satisfies Meta<DialDraggableItemProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <DialDraggableItem {...args} />,
};

const SortableListDemoExample: FC = () => {
  interface Row {
    id: string;
    label: string;
  }
  const initial: Row[] = useMemo(
    () => [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Bravo' },
      { id: 'c', label: 'Charlie' },
    ],
    [],
  );

  const [rows, setRows] = useState<Row[]>(initial);

  const findItem = useCallback(
    (id: string) => rows.findIndex((r) => r.id === id),
    [rows],
  );

  const moveItem = useCallback((id: string, atIndex: number) => {
    setRows((prev) => {
      const fromIndex = prev.findIndex((r) => r.id === id);
      if (fromIndex === -1 || atIndex === -1 || fromIndex === atIndex)
        return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(atIndex, 0, moved);
      return next;
    });
  }, []);

  return (
    <div className="w-[360px] rounded-xl border p-3 shadow">
      <h3 className="mb-3 text-base font-medium">Sortable list</h3>
      <div role="list" className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.id} role="listitem" className="rounded border p-2">
            <DialDraggableItem
              id={row.id}
              findItem={findItem}
              moveItem={moveItem}
            >
              <span className="text-sm">{row.label}</span>
            </DialDraggableItem>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SortableListDemo: Story = {
  render: () => <SortableListDemoExample />,
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-accent-primary-alpha',
  },
};
