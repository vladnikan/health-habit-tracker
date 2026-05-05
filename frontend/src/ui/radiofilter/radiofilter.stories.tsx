import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { Item } from './Radiofilter';
import { Radiofilter } from './Radiofilter';

const meta: Meta<typeof Radiofilter> = {
  title: 'UI/Radiofilter',
  component: Radiofilter,
  argTypes: {
    onItemSelected: { action: 'itemSelected' }
  }
};

export default meta;

type Story = StoryObj<typeof Radiofilter>;

const items: Item[] = [
  { id: 'all', label: 'Всё' },
  { id: 'learn', label: 'Хочу научиться' },
  { id: 'teach', label: 'Могу научить' }
];

export const Default: Story = {
  args: {
    items: items,
    selectedItem: 'all'
  }
};

export const Controlled: Story = {
  args: {
    items: items,
    selectedItem: 'all'
  },
  render: (args) => {
    const [selectedItem, setSelectedItem] = useState(args.selectedItem);

    return (
      <Radiofilter
        {...args}
        selectedItem={selectedItem}
        onItemSelected={(id: string) => {
          setSelectedItem(id);
          args.onItemSelected?.(id);
        }}
      />
    );
  }
};
