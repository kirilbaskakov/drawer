import { useContext } from "react";

import { CanvasStoreContext } from "../store/CanvasStoreContext";

const useCanvasContext = () => {
  return useContext(CanvasStoreContext);
};

export default useCanvasContext;
