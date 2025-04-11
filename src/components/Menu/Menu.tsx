import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { CANVAS_COLORS } from "@/constants/drawingDefaults";
import useCanvasContext from "@/hooks/useCanvasContext";
import useClickOutside from "@/hooks/useClickOutside";
import useConfirm from "@/hooks/useConfirm";
import generateId from "@/utils/generateId";

import HotKeysButton from "../HotKeys/HotKeys";
import LanguageSelect from "../LanguageSelect/LanguageSelect";
import Picker from "../Picker/Picker";
import styles from "./Menu.module.css";

const Menu = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { canvasContext, canvasName, setCanvasName } = useCanvasContext();
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const [isOpen, setIsOpen] = useState(false);
  const { showModal } = useConfirm();

  const onBurgerClicked = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const createNewFile = () => {
    window.open(window.location.origin + "/" + generateId(), "_blank");
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

  const navigateBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.menuButton} ref={menuRef}>
      <div className={styles.menuButtons}>
        <button className={styles.burger} onClick={onBurgerClicked}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
        </button>
        <button className={styles.backButton} onClick={navigateBack}>
          {t("home")}
        </button>
      </div>
      {isOpen && (
        <div className={styles.menu}>
          <input
            className={styles.documentTitle}
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
          />
          <div className={styles.menuSection}>
            <button className="menu-option" onClick={createNewFile}>
              {t("newFile")}
            </button>
            <button className="menu-option" onClick={exportToPng}>
              {t("export")}
            </button>
            <button className="menu-option" onClick={clearCanvas}>
              {t("clearCanvas")}
            </button>
            <HotKeysButton />
          </div>
          <div className={styles.menuSection}>
            <label>{t("language")}</label>
            <LanguageSelect />
          </div>
          <div className={styles.menuSection}>
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
