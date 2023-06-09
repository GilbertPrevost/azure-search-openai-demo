import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from "./dropdownlist.module.css";

interface DropListProps {
  items: Array<{ id: number; uuid: string; label: string }>;
  defaultSelectedItem?: { id: number; label: string };
  onItemSelect?: (selectedItem: { id: number; uuid: string; label: string }) => void;
  storageKey: string;
  selectedLabel: string;
}

const DropList: React.FC<DropListProps> = ({
  items,
  defaultSelectedItem,
  onItemSelect,
  storageKey,
  selectedLabel,
}) => {
  const [selectedItem, setSelectedItem] = useState(
    defaultSelectedItem || items[0]
  );

  useEffect(() => {
    // When the component mounts, check if there is a selected item in the cookies
    const storedSelectedItem = Cookies.get(storageKey);
    if (storedSelectedItem) {
      setSelectedItem(JSON.parse(storedSelectedItem));
    }
  }, [storageKey]);

  const handleItemSelect = (item: { id: number; uuid: string; label: string }) => {
    setSelectedItem(item);
    Cookies.set(storageKey, JSON.stringify(item));
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  return (
    <div className={styles.dropdown1}>
      <select
        className={styles.dropdowninput}
        value={selectedItem.id}
        onChange={(e) => {
          const selectedItemId = parseInt(e.target.value);
          const selectedItem = items.find((item) => item.id === selectedItemId);
          if (selectedItem) {
            handleItemSelect(selectedItem);
          }
        }}
      >
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <span
        className={styles.dropdown2}
        style={{ pointerEvents: 'none', top: '-10px' }}
      >
        <svg
          className={styles.dropdown3}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 14l6-6H4l6 6z"
          />
        </svg>
      </span>
    </div>
  );
};

export default DropList;
