import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from './Icon';

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered'
  },
  args: {
    kind: 'add',
    size: 24
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {},
    kind: {
      control: {
        type: 'select'
      },
      options: [
        'add',
        'add-accent',
        'arrow-left',
        'arrow-square-left',
        'arrow-square-right',
        'book',
        'briefcase',
        'calendar',
        'checkbox-done',
        'checkbox-done-accent',
        'checkbox-empty',
        'checkbox-remove',
        'checkbox-remove-accent',
        'chevron-down',
        'chevron-right',
        'chevron-right-caption',
        'chevron-left-caption',
        'chevron-up',
        'clock',
        'count',
        'cross',
        'cross-green',
        'done',
        'edit',
        'edit-caption',
        'eye',
        'eye-slash',
        'filter-square',
        'gallery-add',
        'gallery-add-green',
        'gallery-edit',
        'global',
        'home',
        'idea',
        'lifestyle',
        'like',
        'like-filled',
        'like-filled-accent',
        'logout',
        'message-text',
        'moon',
        'more-square',
        'notification',
        'notification-alarm',
        'palette',
        'plus-circle',
        'radiobutton-active',
        'radiobutton-active-green',
        'radiobutton-empty',
        'request',
        'scroll',
        'scroll-filled',
        'search',
        'search-caption',
        'share',
        'sort',
        'sun',
        'user',
        'user-circle'
      ]
    },
    size: {
      control: {
        type: 'number',
        min: 16,
        max: 128,
        step: 2
      }
    }
  }
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof Icon>;

export const View: Story = {};

export const Clickable: Story = {
  name: 'Clickable',
  args: {
    kind: 'add',
    onClick: () => {
      alert('Clicked!');
    }
  }
};
