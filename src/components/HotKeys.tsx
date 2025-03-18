import { useState } from "react";
import { KEY_BINDINGS_INFO, KEY_NAMES } from "../constants/hotkeys";
import Modal from "./Modal";

const HotKeysButton = () => {
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
        Горячие клавиши
      </button>
      {isOpen && (
        <Modal onClose={onClose}>
          <h1 className="modal-title">Горячие клавиши</h1>
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
