import { type FC, type ElementType, type ReactNode } from 'react';
import styles from './text.module.css';

export type TextStyle = 'H1' | 'H2' | 'H3' | 'H4' | 'Body' | 'Caption';
export type TextSize = 'normal' | 'large';

type TextProps = {
  children: ReactNode;
  style: TextStyle;
  as?: ElementType;
  size?: TextSize;
};

const DEFAULT_TAG_BY_STYLE: Record<TextStyle, ElementType> = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  Body: 'div',
  Caption: 'div'
};

export const Text: FC<TextProps> = ({
  children,
  style,
  as,
  size = 'normal'
}) => {
  const Component = as ?? DEFAULT_TAG_BY_STYLE[style];

  const className =
    size === 'large' ? `${styles[style]} ${styles.large}` : styles[style];

  return <Component className={className}>{children}</Component>;
};
