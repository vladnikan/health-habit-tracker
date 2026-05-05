import type { Meta, StoryObj } from '@storybook/react';

import { Notification } from './Notification';
import { useState } from 'react';
import styles from './notification.stories.module.css';

const meta = {
  title: 'UI/Notification',
  component: Notification,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    text: 'Олег предлагает вам обмен',
    onClose: () => alert('Обработчик закрытия уведомления')
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Основной текст уведомления'
    },
    hoverText: {
      control: 'text',
      description: 'Текст кнопки, отображаемой при наведении'
    },
    onClick: {
      action: 'hover button click',
      description: 'Обработчик клика по hover'
    },
    onClose: {
      action: 'close click',
      description: 'Обработчик закрытия уведомления'
    }
  }
} satisfies Meta<typeof Notification>;

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    hoverText: 'Перейти',
    onClick: () => alert('Clicked')
  }
};

export const MultipleNotifications: Story = {
  parameters: {
    controls: { disable: true }
  },

  render: () => {
    const [notifications, setNotifications] = useState<string[]>([
      'Олег предлагает вам обмен',
      'Мария предлагает вам обмен',
      'Владимир предлагает вам обмен'
    ]);

    const onClose = (index: number) => {
      setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.left_dummy_title} />
          <div className={styles.left_dummy_filters} />
          <div className={styles.left_dummy_filters} />
          <div className={styles.left_dummy_filters} />
          <div className={styles.left_dummy_filters} />

          <div className={styles.notifications}>
            {notifications.map((notify, i) => (
              <Notification
                key={i}
                text={notify}
                onClick={() => alert('Clicked ' + notify)}
                onClose={() => onClose(i)}
                hoverText='Перейти'
              />
            ))}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.right_dummy_title} />
          <div className={styles.right_dummy_cards}>
            <div className={styles.right_dummy_card} />
          </div>
        </div>
      </div>
    );
  }
};
