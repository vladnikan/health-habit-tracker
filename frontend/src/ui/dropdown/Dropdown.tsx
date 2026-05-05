import React, { useState, useEffect } from 'react';
import styles from './dropdown.module.css';

type DropdownItem = {
  id: string;
  label: string;
};

export interface DropdownProps {
  items: DropdownItem[];
  defaultValueId?: string;
  onSelectionChanged?: (selectedValues: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  defaultValueId,
  onSelectionChanged
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  useEffect(() => {
    if (!defaultValueId) return; // если нет значения по умолчанию, не устанавливаем ничего

    const item = items.find((i) => i.id === defaultValueId) ?? null;
    setSelectedItem(item);
  }, [defaultValueId, items]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelectionChanged?.(item.id);
  };

  return (
    <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
      <button type='button' onClick={() => setIsOpen(!isOpen)}>
        <span className={selectedItem ? styles.selected : styles.placeholder}>
          {selectedItem ? selectedItem.label : 'Не указан'}
        </span>
        <span className={styles.arrow}>{isOpen ? '∧' : '∨'}</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown__menu}>
          {items.map((dropdownItem) => (
            <li key={dropdownItem.id}>
              <button type='button' onClick={() => handleSelect(dropdownItem)}>
                {dropdownItem.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
