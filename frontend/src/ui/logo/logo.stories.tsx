import type { Meta, StoryObj } from '@storybook/react';

import { Logo } from './Logo';

const meta = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {}
  }
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
  name: 'Not clickable (default)'
};

export const Clickable: Story = {
  name: 'Clickable',
  args: {
    onClick: () => {}
  },

  render: () => <Logo onClick={() => alert('logo clicked')} />
};
