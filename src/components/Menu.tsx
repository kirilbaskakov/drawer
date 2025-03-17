import { useState } from "react";
import Picker from "./Picker";
import { CANVAS_COLORS } from "../constants/drawingDefaults";
import useClickOutside from "../hooks/useClickOutside";

const Menu = () => {
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const [isOpen, setIsOpen] = useState(false);

  const onBurgerClicked = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div className="menu-button" ref={menuRef}>
      <button className="burger" onClick={onBurgerClicked}>
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </button>
      {isOpen && (
        <div className="menu">
          <input className="document-title" value="document" />
          <div className="menu-section">
            <button className="menu-option">Новый файл</button>
            <button className="menu-option">Открыть</button>
            <button className="menu-option">Сохранить</button>
            <button className="menu-option">Очистить холст</button>
            <button className="menu-option">Горячие клавиши</button>
          </div>
          <div className="menu-section">
            <label>Язык</label>
            <select className="language-select">
              <option>Русский</option>
              <option>Английский</option>
            </select>
            <label>Тема</label>
          </div>
          <div className="menu-section">
            <Picker
              title="Фон холста"
              options={CANVAS_COLORS.map((color) => ({
                icon: (
                  <div
                    className="custom-tool-icon"
                    style={{ backgroundColor: color }}
                  />
                ),
                value: color,
              }))}
              onSelect={console.log}
              value={CANVAS_COLORS[0]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
