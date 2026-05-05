import React from 'react';
import styles from './button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kind: 'primary' | 'secondary' | 'tertiary';
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  kind,
  text,
  icon,
  iconPosition,
  disabled,
  onClick,
  ...other
}) => {
  const className = `${styles.button} ${styles[`${kind}__button`]}`;

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...other}
    >
      {icon && iconPosition === 'left' && icon}
      {text && <span>{text}</span>}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};
