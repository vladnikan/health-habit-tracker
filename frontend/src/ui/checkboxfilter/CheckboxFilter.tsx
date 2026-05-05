import type { Item } from './Item';
import React, { useState, useEffect } from 'react';
import styles from './CheckboxFilter.module.css';
import { Icon } from '../icon';

interface CheckboxFilterProps {
  items: Item[];
  selectedItem?: string[];
  onItemSelected?: (selectedItem: string) => void;
  itemsToShow: number;
  linkText: string;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  items,
  selectedItem,
  onItemSelected,
  itemsToShow,
  linkText
}) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedItemLocal, setSelectedItemLocal] = useState<string[]>(
    selectedItem || []
  );

  useEffect(() => {
    if (selectedItem !== undefined) {
      setSelectedItemLocal(selectedItem);
    }
  }, [selectedItem]);

  const visibleItems = showAll ? items : items.slice(0, itemsToShow);

  const handleCheckboxChange = (id: string) => {
    setSelectedItemLocal((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    onItemSelected?.(id);
  };

  return (
    <div className={styles.checkboxContainer}>
      {visibleItems.map((item) => (
        <div key={item.id} className={styles.item}>
          <input
            type='checkbox'
            id={`checkbox-${item.id}`}
            checked={selectedItemLocal.includes(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
            className={styles.checkbox}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleCheckboxChange(item.id);
              }
            }}
          />
          <label
            className={styles.checkboxLabel}
            htmlFor={`checkbox-${item.id}`}
          >
            <span className={styles.checkboxCustom}>
              {selectedItemLocal.includes(item.id) ? (
                <Icon kind='checkbox-done-accent' size={20} />
              ) : (
                <Icon kind='checkbox-empty' size={20} />
              )}
            </span>
            {item.label}
          </label>
        </div>
      ))}

      {items.length > itemsToShow && (
        <button
          type='button'
          onClick={() => setShowAll(!showAll)}
          className={styles.ShowAllButton}
        >
          <div className={styles.showAllLable}>
            {linkText}
            {showAll ? (
              <Icon kind='chevron-up' />
            ) : (
              <Icon kind='chevron-down' />
            )}
          </div>
        </button>
      )}
    </div>
  );
};
