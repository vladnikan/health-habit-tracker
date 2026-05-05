import { type FC } from 'react';
import styles from './notification.module.css';
import { Icon } from '../icon';

type TNotification = {
  text: string;
  hoverText?: string;
  onClick?: () => void;
  onClose?: () => void;
};

export const Notification: FC<TNotification> = ({
  text,
  hoverText,
  onClick,
  onClose
}) => (
  <div className={styles.notification}>
    <div className={styles.close}>
      <Icon kind='cross' onClick={onClose} />
    </div>
    <div className={styles.icon}>
      <Icon kind='idea' />
    </div>
    <div className={styles.text}>{text}</div>

    {hoverText && (
      <button onClick={onClick} className={styles.hover}>
        {hoverText}
      </button>
    )}
  </div>
);
