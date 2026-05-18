import type { FC } from 'react';
import styles from './icon.module.css';

type TIcon = {
  size?: number;
  onClick?: () => void;
  kind:
    | 'add'
    | 'add-accent'
    | 'arrow-left'
    | 'arrow-square-left'
    | 'arrow-square-right'
    | 'book'
    | 'briefcase'
    | 'calendar'
    | 'checkbox-done'
    | 'checkbox-done-accent'
    | 'checkbox-empty'
    | 'checkbox-remove'
    | 'checkbox-remove-accent'
    | 'chevron-down'
    | 'chevron-right'
    | 'chevron-right-caption'
    | 'chevron-left-caption'
    | 'chevron-up'
    | 'clock'
    | 'count'
    | 'cross'
    | 'cross-green'
    | 'done'
    | 'edit'
    | 'edit-caption'
    | 'eye'
    | 'eye-slash'
    | 'filter-square'
    | 'gallery-add'
    | 'gallery-add-green'
    | 'gallery-edit'
    | 'global'
    | 'home'
    | 'idea'
    | 'lifestyle'
    | 'like'
    | 'like-filled'
    | 'like-filled-accent'
    | 'logout'
    | 'message-text'
    | 'moon'
    | 'more-square'
    | 'notification'
    | 'notification-alarm'
    | 'palette'
    | 'plus-circle'
    | 'radiobutton-active'
    | 'radiobutton-active-green'
    | 'radiobutton-empty'
    | 'request'
    | 'scroll'
    | 'scroll-filled'
    | 'search'
    | 'search-caption'
    | 'share'
    | 'sort'
    | 'sun'
    | 'user'
    | 'user-circle'
    | 'google'
    | 'apple'
    | 'pulse'
    | 'heart'
    | 'arrow-top'
    | 'fire'
    | 'inProgress'
    | 'trashcan'
    | 'water'
    | 'food'
    | 'lightning'
    | 'pencil'
    | 'stress';
};

export const Icon: FC<TIcon> = ({ kind, size = 24, onClick }) => {
  const img = (
    <img
      src={`/images/icons/${kind}.svg`}
      alt={`icon ${kind}`}
      height={size}
      width={size}
    />
  );

  if (!onClick) return img;

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={kind}
      className={styles.iconButton}
    >
      {img}
    </button>
  );
};
