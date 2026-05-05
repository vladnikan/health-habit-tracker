import type { FC } from 'react';
import styles from './preloader.module.css';

export type PreloaderProps = {
  height?: number;
  width?: number;
};

export const Preloader: FC<PreloaderProps> = ({
  height = 128,
  width = 128
}) => (
  <div className={styles.container} style={{ height, width }}>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 128 128'
      className={styles.spinner}
      style={{ height, width }}
    >
      <path
        d='M 64 8 A 56 56 0 0 1 120 64'
        fill='none'
        stroke='var(--color-disabled-text)'
        strokeWidth='16'
        strokeLinecap='round'
      />
    </svg>
  </div>
);
