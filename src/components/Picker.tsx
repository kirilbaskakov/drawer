import { ReactNode, useState } from "react";
import ToolButton from "./ToolButton";

type Options<T> = Array<{ icon: ReactNode; value: T }>;

const Picker = <T,>({
  title,
  defaultValue = null,
  options,
  onSelect,
}: {
  title: string,
  options: Options<T>;
  defaultValue?: null | T;
  onSelect: (value: T) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState<T | null>(
    defaultValue
  );

  const handleClick = (value: T) => () => {
    setSelectedValue(value);
    onSelect(value);
  };
  return (
    <div>
      <h3 className="picker-title">{title}</h3>
      <div className="picker-items">
        {options.map(({ icon, value }) => (
            <ToolButton
            icon={icon}
            onClick={handleClick(value)}
            isActive={String(selectedValue) == String(value)}
            />
        ))}
      </div>
    </div>
  );
};

export default Picker;
