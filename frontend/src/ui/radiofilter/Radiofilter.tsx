import { useState, useEffect, type FC } from 'react';
import { Icon } from '../icon';
import styles from './radiofilter.module.css';

export type Item = {
  id: string;
  label: string;
};

export type RadiofilterProps = {
  items: Item[];
  selectedItem?: string;
  onItemSelected?: (selectedItem: string) => void;
};

export const Radiofilter: FC<RadiofilterProps> = ({
  items,
  selectedItem,
  onItemSelected
}) => {
  const [currentSelected, setCurrentSelected] = useState<string | undefined>(
    selectedItem
  );

  useEffect(() => {
    setCurrentSelected(selectedItem);
  }, [selectedItem]);

  const handleItemClick = (itemId: string) => {
    setCurrentSelected(itemId);
    onItemSelected?.(itemId);
  };

  return (
    <div className={styles.root} role='radiogroup'>
      {items.map((item) => {
        const isSelected = item.id === currentSelected;

        return (
          <button
            key={item.id}
            type='button'
            className={styles.item}
            role='radio'
            aria-checked={isSelected}
            onClick={() => handleItemClick(item.id)}
          >
            <Icon
              kind={
                isSelected ? 'radiobutton-active-green' : 'radiobutton-empty'
              }
            />
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
