import { useContext } from "react";
import { ConfirmationModalContext } from "../store/ConfirmationModalContext";

const useConfirm = () => {
  return useContext(ConfirmationModalContext);
};

export default useConfirm;
