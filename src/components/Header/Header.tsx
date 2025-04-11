import { PiPencilCircle } from "react-icons/pi";

import LanguageSelect from "../LanguageSelect/LanguageSelect";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <PiPencilCircle size={40} />
          <h1>Drawer</h1>
        </div>
        <div>
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
};

export default Header;
