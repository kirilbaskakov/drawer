import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  return createPortal(
    <>
      <div className="modal">{children}</div>
      <div className="modal-background" onClick={onClose} />
    </>,
    document.body,
  );
};

export default Modal;
