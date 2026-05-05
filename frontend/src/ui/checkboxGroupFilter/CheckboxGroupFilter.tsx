import React, { useState, useEffect } from 'react';
import { CheckboxFilter } from '../checkboxfilter';
import styles from './CheckboxGroupFilter.module.css';
import { Icon } from '../icon';

export type Item = {
  id: string;
  label: string;
};

export type Group = {
  id: string;
  label: string;
  items: Item[];
};

interface CheckboxGroupFilterProps {
  groups: Group[];
  selectedItem?: string[];
  onItemSelected?: (selectedItem: string) => void;
  itemsToShow: number;
  linkText: string;
}

export const CheckboxGroupFilter: React.FC<CheckboxGroupFilterProps> = ({
  groups,
  selectedItem = [],
  onItemSelected,
  itemsToShow,
  linkText
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedItem);

  useEffect(() => {
    setSelectedItems(selectedItem);
  }, [selectedItem]);

  const visibleGroups = showAllGroups ? groups : groups.slice(0, itemsToShow);

  const handleGroupClick = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleItemSelected = (itemId: string) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(newSelected);

    if (onItemSelected) {
      onItemSelected(itemId);
    }
  };

  const isGroupAllSelected = (group: Group): boolean =>
    group.items.length > 0 &&
    group.items.every((item) => selectedItems.includes(item.id));

  const isGroupSomeSelected = (group: Group): boolean =>
    group.items.some((item) => selectedItems.includes(item.id)) &&
    !isGroupAllSelected(group);

  const handleGroupCheckboxClick = (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();

    const groupItemIds = group.items.map((item) => item.id);
    const allSelected = isGroupAllSelected(group);

    if (allSelected) {
      groupItemIds.forEach((id) => {
        if (onItemSelected) {
          onItemSelected(id);
        }
      });
    } else {
      groupItemIds.forEach((id) => {
        if (!selectedItems.includes(id) && onItemSelected) {
          onItemSelected(id);
        }
      });
    }
  };

  const getSelectedItemsForGroup = (group: Group): string[] =>
    selectedItems.filter((id) => group.items.some((item) => item.id === id));

  return (
    <div className={styles.checkboxContainer}>
      {visibleGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.id);
        const isAllSelected = isGroupAllSelected(group);
        const isSomeSelected = isGroupSomeSelected(group);

        return (
          <div key={group.id} className={styles.group}>
            <div
              className={styles.groupHeader}
              onClick={() => handleGroupClick(group.id)}
            >
              <input
                type='checkbox'
                id={`group-${group.id}`}
                className={`${styles.checkbox} ${styles.groupCheckbox}`}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isSomeSelected;
                  }
                }}
                onClick={(e) => handleGroupCheckboxClick(group, e)}
                onChange={() => {}}
              />
              <label
                htmlFor={`group-${group.id}`}
                className={`${styles.checkboxLabel} ${styles.groupCheckboxLabel}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={styles.checkboxCustom}>
                  {isAllSelected ? (
                    <Icon kind='checkbox-done-accent' size={20} />
                  ) : isSomeSelected ? (
                    <Icon kind='checkbox-remove-accent' size={20} />
                  ) : (
                    <Icon kind='checkbox-empty' size={20} />
                  )}
                </span>
              </label>

              <span className={styles.groupLabel}>{group.label}</span>

              {isExpanded ? (
                <Icon kind='chevron-up' size={16} />
              ) : (
                <Icon kind='chevron-down' size={16} />
              )}
            </div>

            {isExpanded && (
              <div className={styles.groupItems}>
                <CheckboxFilter
                  items={group.items}
                  selectedItem={getSelectedItemsForGroup(group)}
                  onItemSelected={handleItemSelected}
                  itemsToShow={group.items.length}
                  linkText=''
                />
              </div>
            )}
          </div>
        );
      })}

      {groups.length > itemsToShow && (
        <button
          type='button'
          className={styles.showAllButton}
          onClick={() => setShowAllGroups(!showAllGroups)}
        >
          <div className={styles.showAllLabel}>
            {showAllGroups ? 'Свернуть' : linkText}
            {showAllGroups ? (
              <Icon kind='chevron-up' size={16} />
            ) : (
              <Icon kind='chevron-down' size={16} />
            )}
          </div>
        </button>
      )}
    </div>
  );
};
