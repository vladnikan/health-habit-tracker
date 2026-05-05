import type { FC } from 'react';

import styles from './logo.module.css';

type TLogo = {
  onClick?: () => void;
};

export const Logo: FC<TLogo> = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label='Logo'
    disabled={!onClick}
    className={styles.logo}
  >
    <img src='/images/logo.svg' alt='Logo' />
  </button>
);
