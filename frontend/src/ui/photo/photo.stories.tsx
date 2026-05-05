import type { Meta, StoryObj } from '@storybook/react';
import { Photo } from './Photo';

const meta: Meta<typeof Photo> = {
  title: 'Components/Photo',
  component: Photo,
  tags: ['autodocs'],
  argTypes: {
    url: { control: 'text' },
    altName: { control: 'text' },
    size: {
      control: 'select',
      options: ['medium', 'large']
    },
    className: { control: 'text' }
  },
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Photo>;

export default meta;
type Story = StoryObj<typeof Photo>;

export const Medium: Story = {
  args: {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altName: 'Средний аватар',
    size: 'medium'
  }
};

export const Large: Story = {
  args: {
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    altName: 'Большой аватар',
    size: 'large'
  }
};

export const WithoutImage: Story = {
  args: {
    size: 'medium',
    altName: 'Нет фото'
  }
};
