import { ReactNode } from "react";

import ToolButton from "../ToolButton/ToolButton";
import styles from "./Picker.module.css";

type Options<T> = Array<{ icon: ReactNode; value: T }>;

const Picker = <T,>({
  title,
  options,
  onSelect,
  value,
}: {
  title: string;
  options: Options<T>;
  onSelect: (value: T) => void;
  value: T;
}) => {
  const handleClick = (value: T) => () => {
    onSelect(value);
  };
  return (
    <div>
      <h3 className={styles.pickerTitle}>{title}</h3>
      <div className={styles.pickerItems}>
        {options.map(({ icon, value: val }) => (
          <ToolButton
            icon={icon}
            onClick={handleClick(val)}
            isActive={String(value) == String(val)}
          />
        ))}
      </div>
    </div>
  );
};

export default Picker;
