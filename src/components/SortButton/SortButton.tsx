import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSort } from "react-icons/fa";

import useClickOutside from "@/hooks/useClickOutside";

import styles from "./SortButton.module.css";

const options = [
  { value: "lastOpen", labelKey: "byDate" },
  { value: "name", labelKey: "byName" },
] as const;

export type SortValue = (typeof options)[number]["value"];

const SortButton = ({
  selectedSort,
  onChange,
}: {
  selectedSort: SortValue;
  onChange: (value: SortValue) => void;
}) => {
  const { t } = useTranslation();
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.sortButtonContainer} ref={ref}>
      <FaSort
        className={styles.sortButton}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      />
      {isOpen && (
        <div className={styles.sortButtonList}>
          {options.map(({ value, labelKey }) => (
            <div
              key={value}
              className={styles.sortButtonOption}
              onClick={() => onChange(value)}
            >
              <p className={value === selectedSort ? styles.selected : ""}>
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortButton;
