import { useState } from "react";
import Picker from "./Picker";
import { CANVAS_COLORS } from "../constants/drawingDefaults";
import useClickOutside from "../hooks/useClickOutside";
import { observer } from "mobx-react-lite";
import { canvasContext } from "../utils/CanvasContext";
import HotKeysButton from "./HotKeys";
import useConfirm from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";

const Menu = observer(() => {
  const { t } = useTranslation();
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
    showModal(t("clearCanvasConfirmTitle"), t("clearCanvasConfirmText")).then(
      (confirmed) => confirmed && canvasContext.clear(),
    );
  };

  const newFile = () => {};

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
            <button className="menu-option">{t("newFile")}</button>
            <button className="menu-option">{t("openFile")}</button>
            <button className="menu-option" onClick={exportToPng}>
              {t("export")}
            </button>
            <button className="menu-option" onClick={clearCanvas}>
              {t("clearCanvas")}
            </button>
            <HotKeysButton />
          </div>
          <div className="menu-section">
            <LanguageSelect />
            <label>{t("theme")}</label>
          </div>
          <div className="menu-section">
            <Picker
              title={t("canvasBackground")}
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
