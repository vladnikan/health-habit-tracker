import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import styles from './search.module.css';
import { Icon } from '../icon';

interface SearchProps {
  value?: string;
  onChanged?: (newValue: string) => void;
}

export const Search: React.FC<SearchProps> = ({ value, onChanged }) => {
  const [inputValue, setInputValue] = useState<string>(value ?? '');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChanged?.(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onChanged?.('');
  };

  return (
    <div className={styles.searchInputContainer}>
      <div className={styles.inputContainer}>
        <Icon kind='search' size={24} />
        <input
          type='text'
          value={inputValue}
          className={styles.search}
          placeholder='Искать навык'
          onChange={handleInputChange}
        />
      </div>
      {inputValue && (
        <div className={styles.inputButtonClear}>
          <Icon kind='cross' size={24} onClick={handleClear} />
        </div>
      )}
    </div>
  );
};
