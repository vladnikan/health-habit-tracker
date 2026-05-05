import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxFilter } from './CheckboxFilter';
import type { Item } from './Item';

const mockItems: Item[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
  { id: '6', label: 'Option 6' },
  { id: '7', label: 'Option 7' }
];

const meta: Meta<typeof CheckboxFilter> = {
  title: 'UI/CheckboxFilter',
  component: CheckboxFilter,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    selectedItem: { control: 'object' },
    onItemSelected: { action: 'onItemSelected' },
    itemsToShow: { control: 'number' },
    linkText: { control: 'text' }
  },
  args: {
    items: mockItems,
    itemsToShow: 3,
    linkText: 'Show all'
  }
};

export default meta;

type Story = StoryObj<typeof CheckboxFilter>;

export const Default: Story = {
  args: {
    selectedItem: ['1', '3']
  }
};

export const ShowAllExpanded: Story = {
  args: {
    ...Default.args,
    selectedItem: ['2', '5', '7']
  },
  parameters: {}
};

export const NoSelection: Story = {
  args: {
    ...Default.args,
    selectedItem: []
  }
};

export const FewItems: Story = {
  args: {
    items: mockItems.slice(0, 2),
    itemsToShow: 5,
    selectedItem: ['1'],
    linkText: 'Show more'
  }
};

export const CustomLinkText: Story = {
  args: {
    ...Default.args,
    linkText: 'View all options',
    selectedItem: ['4']
  }
};

export const WithoutOnItemSelected: Story = {
  args: {
    ...Default.args,
    onItemSelected: undefined,
    selectedItem: ['1', '2']
  }
};
