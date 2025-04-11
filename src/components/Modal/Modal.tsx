import { ReactNode } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";

const Modal = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  return createPortal(
    <>
      <div className={styles.modal}>{children}</div>
      <div className={styles.modalBackground} onClick={onClose} />
    </>,
    document.body,
  );
};

export default Modal;
