import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    items: [
      { id: '1', label: 'Женский' },
      { id: '2', label: 'Мужской' },
      { id: '3', label: 'Вертолет' }
    ]
  }
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};

export const WithSelectionHandler: Story = {
  args: {
    onSelectionChanged: (value: string) => {
      console.log('Selected:', value);
    }
  }
};
