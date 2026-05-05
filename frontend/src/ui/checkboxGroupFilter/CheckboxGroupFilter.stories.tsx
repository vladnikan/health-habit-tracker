import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroupFilter } from './CheckboxGroupFilter';
import type { Group } from './CheckboxGroupFilter';

const mockGroups: Group[] = [
  {
    id: 'group1',
    label: 'Категория 1',
    items: [
      { id: '1-1', label: 'Опция 1-1' },
      { id: '1-2', label: 'Опция 1-2' },
      { id: '1-3', label: 'Опция 1-3' }
    ]
  },
  {
    id: 'group2',
    label: 'Категория 2',
    items: [
      { id: '2-1', label: 'Опция 2-1' },
      { id: '2-2', label: 'Опция 2-2' },
      { id: '2-3', label: 'Опция 2-3' },
      { id: '2-4', label: 'Опция 2-4' }
    ]
  },
  {
    id: 'group3',
    label: 'Категория 3',
    items: [
      { id: '3-1', label: 'Опция 3-1' },
      { id: '3-2', label: 'Опция 3-2' }
    ]
  },
  {
    id: 'group4',
    label: 'Категория 4',
    items: [
      { id: '4-1', label: 'Опция 4-1' },
      { id: '4-2', label: 'Опция 4-2' },
      { id: '4-3', label: 'Опция 4-3' },
      { id: '4-4', label: 'Опция 4-4' },
      { id: '4-5', label: 'Опция 4-5' }
    ]
  },
  {
    id: 'group5',
    label: 'Категория 5',
    items: [{ id: '5-1', label: 'Опция 5-1' }]
  },
  {
    id: 'group6',
    label: 'Категория 6',
    items: [
      { id: '6-1', label: 'Опция 6-1' },
      { id: '6-2', label: 'Опция 6-2' }
    ]
  },
  {
    id: 'group7',
    label: 'Категория 7',
    items: [
      { id: '7-1', label: 'Опция 7-1' },
      { id: '7-2', label: 'Опция 7-2' },
      { id: '7-3', label: 'Опция 7-3' }
    ]
  }
];

const meta: Meta<typeof CheckboxGroupFilter> = {
  title: 'UI/CheckboxGroupFilter',
  component: CheckboxGroupFilter,
  tags: ['autodocs'],
  argTypes: {
    groups: { control: 'object' },
    selectedItem: { control: 'object' },
    onItemSelected: { action: 'onItemSelected' },
    itemsToShow: { control: 'number' },
    linkText: { control: 'text' }
  },
  args: {
    groups: mockGroups,
    itemsToShow: 3,
    linkText: 'Все категории'
  }
};

export default meta;

type Story = StoryObj<typeof CheckboxGroupFilter>;

export const Default: Story = {
  args: {
    selectedItem: ['1-1', '2-2', '4-3']
  }
};

export const NoSelection: Story = {
  args: {
    selectedItem: []
  }
};

export const AllSelectedInGroup: Story = {
  args: {
    selectedItem: ['2-1', '2-2', '2-3', '2-4']
  }
};

export const FewGroups: Story = {
  args: {
    groups: mockGroups.slice(0, 2),
    itemsToShow: 5,
    selectedItem: ['1-1'],
    linkText: 'Показать еще'
  }
};

export const CustomLinkText: Story = {
  args: {
    ...Default.args,
    linkText: 'Показать все категории',
    selectedItem: ['4-1']
  }
};
