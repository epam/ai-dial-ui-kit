import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialItemInput, type DialItemInputProps } from './ItemInput';
import { DialItemType } from '@/types/item';

const meta: Meta<typeof DialItemInput> = {
  title: 'Components/ItemInput',
  component: DialItemInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['file', 'folder', 'other'],
    },
    loading: { control: 'boolean' },
    shared: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof DialItemInput>;

export const Default: Story = {
  args: {
    name: 'Document.txt',
    type: DialItemType.File,
    elementId: 'input-1',
    iconLabel: 'File',
    iconSize: 20,
  } as DialItemInputProps,
};

export const Folder: Story = {
  args: {
    name: 'Projects',
    type: DialItemType.Folder,
    elementId: 'input-2',
    shared: true,
    iconLabel: 'Folder',
    iconSize: 20,
  } as DialItemInputProps,
};

export const Invalid: Story = {
  args: {
    name: 'Duplicate name',
    type: DialItemType.Folder,
    elementId: 'input-4',
    iconSize: 20,
    inputInvalid: true,
    inputInvalidMessage:
      'This name already exists at this location. Please choose a different name.',
  } as DialItemInputProps,
};

export const Loading: Story = {
  args: {
    name: 'Loading item...',
    type: DialItemType.File,
    elementId: 'input-3',
    loading: true,
    iconLabel: 'Loading',
    iconSize: 20,
  } as DialItemInputProps,
};
