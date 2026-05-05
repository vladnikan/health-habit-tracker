import React, { type SyntheticEvent } from 'react';
import styles from './input.module.css';
import { Icon } from '../icon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  isPassword?: boolean;
  passwordIcon?: React.ReactNode;
  isMultiline?: boolean;
  multilineIcon?: React.ReactNode;
  onChanged?: (e: SyntheticEvent) => void;
  error?: string;
  clue?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  isPassword,
  passwordIcon,
  isMultiline,
  multilineIcon,
  onChanged,
  error,
  clue,
  ...other
}: InputProps) => {
  if (!passwordIcon && isPassword) {
    passwordIcon = <Icon kind='eye' />;
  }

  if (!multilineIcon && isMultiline) {
    multilineIcon = <Icon kind='edit' />;
  }

  return !isMultiline ? (
    <div className={styles.generalContainer}>
      <div
        className={
          error ? styles.inputContainerWithError : styles.inputContainer
        }
      >
        <input
          className={styles.input}
          placeholder={placeholder}
          type={isPassword ? 'password' : 'text'}
          onChange={onChanged}
          {...other}
        />
        {passwordIcon && <span className={styles.icon}>{passwordIcon}</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {!error && clue && <p className={styles.extra_text}>{clue}</p>}
    </div>
  ) : (
    <div className={styles.textAreaWrapper}>
      <textarea
        rows={4}
        className={styles.textArea}
        placeholder={placeholder}
        onChange={onChanged}
      />
      {multilineIcon && (
        <span className={styles.multilineIcon}>{multilineIcon}</span>
      )}
    </div>
  );
};
