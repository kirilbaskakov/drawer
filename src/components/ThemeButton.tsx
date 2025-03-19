import { FaCloudSun, FaCloudMoon } from "react-icons/fa";
const ThemeButton = () => {
  return (
    <div className="theme-button">
      <FaCloudSun className="theme-icon sun" />
      <FaCloudMoon className="theme-icon moon" />
      <div className="theme-circle" />
    </div>
  );
};

export default ThemeButton;
