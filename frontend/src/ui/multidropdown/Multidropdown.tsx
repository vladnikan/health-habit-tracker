import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../icon';
import styles from './multidropdown.module.css';

export type DropdownItem = {
  id: string;
  label: string;
};

export interface MultidropdownProps {
  items: DropdownItem[];
  onSelectionChanged?: (selectedValues: string[]) => void;
}

export const Multidropdown: React.FC<MultidropdownProps> = ({
  items,
  onSelectionChanged
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemToggle = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);

    if (onSelectionChanged) {
      onSelectionChanged(Array.from(newSelectedIds));
    }
  };

  const getDisplayText = () => {
    if (selectedIds.size === 0) {
      return 'Выберите категорию';
    }
    return `Выбрано: ${selectedIds.size}`;
  };

  return (
    <div className={styles.multidropdown} ref={dropdownRef}>
      <button
        type='button'
        className={styles.dropdownButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <span
          className={`${styles.dropdownText} ${
            selectedIds.size === 0 ? styles.dropdownTextPlaceholder : ''
          }`}
        >
          {getDisplayText()}
        </span>
        <Icon kind={isOpen ? 'chevron-up' : 'chevron-down'} size={24} />
      </button>
      {isOpen && (
        <div className={styles.dropdownList} role='listbox'>
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <label
                key={item.id}
                className={styles.dropdownItem}
                role='option'
                aria-selected={isSelected}
              >
                <input
                  type='checkbox'
                  checked={isSelected}
                  onChange={() => handleItemToggle(item.id)}
                  className={styles.checkboxInput}
                />
                <Icon
                  kind={isSelected ? 'checkbox-done-accent' : 'checkbox-empty'}
                  size={24}
                />
                <span className={styles.itemLabel}>{item.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
