import LanguageSelect from "./LanguageSelect";
import ThemeButton from "./ThemeButton";

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Drawer</h1>
      <ThemeButton />
      <div>
        <LanguageSelect />
      </div>
    </header>
  );
};

export default Header;
