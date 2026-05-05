import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    kind: {
      control: 'radio',
      options: ['primary', 'secondary', 'tertiary']
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right']
    },
    icon: {
      control: false
    },
    onClick: { action: 'clicked' }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    kind: 'primary',
    text: 'Primary Default',
    iconPosition: 'left'
  }
};

export const Secondary: Story = {
  args: {
    kind: 'secondary',
    text: 'Войти'
  }
};

export const Tertiary: Story = {
  args: {
    kind: 'tertiary',
    text: 'Подробнее'
  }
};

export const WithIconLeft: Story = {
  args: {
    kind: 'secondary',
    text: 'Редактировать',
    icon: <span>˘¯Â˜ı◊Ç˛</span>,
    iconPosition: 'left'
  }
};

export const WithIconRight: Story = {
  args: {
    kind: 'secondary',
    text: 'Редактировать',
    icon: <span>˘¯Â˜ı◊Ç˛</span>,
    iconPosition: 'right'
  }
};

export const Disabled: Story = {
  args: {
    kind: 'primary',
    text: 'Недоступно',
    disabled: true
  }
};
