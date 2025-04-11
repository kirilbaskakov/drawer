import { ReactNode } from "react";

import styles from "./ToolButton.module.css";

const ToolButton = ({
  icon,
  onClick,
  isActive = false,
  tooltip = "",
}: {
  icon: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  tooltip?: string;
}) => {
  return (
    <button
      className={styles.toolButton + " " + (isActive ? styles.active : "")}
      title={tooltip}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default ToolButton;
