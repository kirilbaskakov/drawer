import { useState } from "react";
import { KEY_BINDINGS_INFO, KEY_NAMES } from "../constants/hotkeys";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";

const HotKeysButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button className="menu-option" onClick={onClick}>
        {t("hotkeys")}
      </button>
      {isOpen && (
        <Modal onClose={onClose}>
          <h1 className="modal-title">{t("hotkeys")}</h1>
          <div className="hotkeys-list">
            {KEY_BINDINGS_INFO.map(({ name, keys }) => (
              <>
                <div className="hotkey-name">{name}</div>
                <div>
                  {keys.map((combo) => (
                    <div className="hotkey-sequence">
                      {combo.map((key) => (
                        <div className="hotkey">
                          {KEY_NAMES[key as keyof typeof KEY_NAMES] ?? ""}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default HotKeysButton;
