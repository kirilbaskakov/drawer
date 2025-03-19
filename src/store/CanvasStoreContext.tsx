import { ReactNode, createContext, useEffect, useState } from "react";
import CanvasContext from "../utils/CanvasContext";
import { useParams } from "react-router-dom";

type CanvasStoreContextType = {
  canvasContext: CanvasContext | null;
};

export const CanvasStoreContext = createContext({} as CanvasStoreContextType);

const CanvasStoreProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const [canvasContext, setCanvasContext] = useState<CanvasContext | null>(
    null,
  );

  useEffect(() => {
    const id = params.id;
    if (id) {
      setCanvasContext(new CanvasContext());
    }
  }, [params.id]);

  const canvasStore: CanvasStoreContextType = {
    canvasContext,
  };

  return (
    <CanvasStoreContext.Provider value={canvasStore}>
      {children}
    </CanvasStoreContext.Provider>
  );
};

export default CanvasStoreProvider;
