import { useState } from "react";
import Picker from "./Picker";
import { CANVAS_COLORS } from "../constants/drawingDefaults";
import useClickOutside from "../hooks/useClickOutside";
import { observer } from "mobx-react-lite";
import { canvasContext } from "../utils/CanvasContext";
import HotKeysButton from "./HotKeys";
import useConfirm from "../hooks/useConfirm";

const Menu = observer(() => {
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const [isOpen, setIsOpen] = useState(false);
  const { showModal } = useConfirm();
  const onBurgerClicked = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const exportToPng = () => {
    const link = document.createElement("a");
    link.download = "canvas_image.png";
    link.href = canvasContext.export();
    link.click();
  };

  const clearCanvas = () => {
    showModal(
      "Вы действительно хотите очистить холст?",
      "Ваши изменения не сохранятся",
    ).then((confirmed) => confirmed && canvasContext.clear());
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
            <button className="menu-option" onClick={exportToPng}>
              Экспортировать в png
            </button>
            <button className="menu-option" onClick={clearCanvas}>
              Очистить холст
            </button>
            <HotKeysButton />
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
              onSelect={(value) => canvasContext.setCanvasColor(value)}
              value={canvasContext.canvasColor}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default Menu;
