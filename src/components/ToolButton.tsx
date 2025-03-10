import { ReactNode } from "react";

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
      className={"tool-button " + (isActive ? "active" : "")}
      title={tooltip}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default ToolButton;
