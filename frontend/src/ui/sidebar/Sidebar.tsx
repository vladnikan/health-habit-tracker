import React from 'react';
import styles from './sidebar.module.css';
import { Text } from '../text';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onChange?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  selectedItem: string;
  onItemSelected: (selectedItem: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedItem,
  onItemSelected
}) => (
  <nav className={styles.sidebarNav}>
    <ul>
      {items.map((item) => {
        const isSelected = item.id === selectedItem;

        return (
          <li key={item.id} className={styles.sidebarItem}>
            <button
              className={`${styles.sidebarButton} ${isSelected ? styles.sidebarButtonSelected : ''}`}
              onClick={() => onItemSelected(item.id)}
              aria-label={item.label}
            >
              {item.icon}
              <Text style='Body' size='normal'>
                {item.label}
              </Text>
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);
