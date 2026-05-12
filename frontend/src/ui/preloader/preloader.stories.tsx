import type { Meta, StoryObj } from '@storybook/react';
import { Preloader } from './Preloader';

const meta: Meta<typeof Preloader> = {
  title: 'UI/Preloader',
  component: Preloader,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: {
        type: 'number',
        min: 16,
        max: 512,
        step: 8
      }
    },
    width: {
      control: {
        type: 'number',
        min: 16,
        max: 512,
        step: 8
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Preloader>;

export const Default: Story = {
  args: {}
};

export const CustomSize: Story = {
  args: {
    height: 256,
    width: 256
  }
};

export const Small: Story = {
  args: {
    height: 64,
    width: 64
  }
};

export const Large: Story = {
  args: {
    height: 256,
    width: 256
  }
};
