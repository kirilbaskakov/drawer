import { ReactNode, createContext, useEffect, useState } from "react";
import CanvasContext from "../utils/CanvasContext";
import { useParams } from "react-router-dom";
import saveCanvas from "../utils/saveCanvas";
import getCanvas from "../utils/getCanvas";

type CanvasStoreContextType = {
  canvasContext: CanvasContext;
};

export const CanvasStoreContext = createContext({} as CanvasStoreContextType);

const CanvasStoreProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const [canvasContext, setCanvasContext] = useState<CanvasContext | null>(
    null,
  );

  useEffect(() => {
    const id = params.id;
    let intervalId = null;
    if (id) {
      const canvas = getCanvas(id) ?? new CanvasContext();
      intervalId = setInterval(() => {
        if (canvas && id) {
          saveCanvas(canvas, id);
        }
      }, 5000);
      setCanvasContext(canvas);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [params.id]);

  if (!canvasContext) {
    return null;
  }

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
