import { useState } from "react";
import { useTranslation } from "react-i18next";

import { KEY_BINDINGS_INFO, KEY_NAMES } from "@/constants/hotkeys";

import Modal from "../Modal/Modal";
import styles from "./HotKeys.module.css";

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
          <h1 className={styles.modalTitle}>{t("hotkeys")}</h1>
          <div className={styles.hotkeysList}>
            {KEY_BINDINGS_INFO.map(({ nameKey, keys }) => (
              <>
                <div>{t(nameKey)}</div>
                <div>
                  {keys.map((combo) => (
                    <div className={styles.hotkeySequence}>
                      {combo.map((key) => (
                        <div className={styles.hotkey}>
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
