import { ReactNode, createContext, useRef, useState } from "react";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";

type ModalContextType = {
  showModal: (title: string, text: string) => Promise<boolean>;
};

export const ConfirmationModalContext = createContext<ModalContextType>(
  {} as ModalContextType,
);

export const ConfirmationModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    text: "",
  });
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const showModal = (title: string, text: string) => {
    setIsOpen(true);
    setModalData({ title, text });
    return new Promise((resolve: (value: boolean) => void) => {
      resolver.current = resolve;
    });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onConfirm = () => {
    if (resolver.current) resolver.current(true);
    onClose();
  };

  const onCancel = () => {
    if (resolver.current) resolver.current(false);
    onClose();
  };

  const modalContext: ModalContextType = {
    showModal,
  };

  return (
    <ConfirmationModalContext.Provider value={modalContext}>
      {children}
      {isOpen && (
        <Modal onClose={onClose}>
          <h1 className="confirmation-title">{modalData.title}</h1>
          <p className="confirmation-text">{modalData.text}</p>
          <div className="confirmation-buttons">
            <button className="confirmation-button primary" onClick={onConfirm}>
              {t("confirm")}
            </button>
            <button
              className="confirmation-button secondary"
              onClick={onCancel}
            >
              {t("cancel")}
            </button>
          </div>
        </Modal>
      )}
    </ConfirmationModalContext.Provider>
  );
};
