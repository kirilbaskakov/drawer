import { createContext, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CanvasContext from "../utils/CanvasContext";
import getCanvas from "../utils/storage/getCanvas";
import saveCanvas from "../utils/storage/saveCanvas";

type CanvasStoreContextType = {
  canvasContext: CanvasContext;
  canvasName: string;
  setCanvasName: (canvasName: string) => void;
};

export const CanvasStoreContext = createContext({} as CanvasStoreContextType);

const CanvasStoreProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const [canvasName, setCanvasName] = useState("New Document");
  const [canvasContext, setCanvasContext] = useState<CanvasContext | null>(
    null,
  );

  useEffect(() => {
    const id = params.id;
    let canvas: CanvasContext | null = null;
    if (id) {
      const { name, canvasContext } = getCanvas(id);
      canvas = canvasContext ?? new CanvasContext();
      setCanvasContext(canvas);
      setCanvasName(name ?? "New Document");
    }

    return () => {
      canvas?.delete();
    };
  }, [params.id]);

  useEffect(() => {
    let intervalId = null;
    intervalId = setInterval(() => {
      if (canvasContext && params.id) {
        saveCanvas(canvasContext, params.id, canvasName);
      }
    }, 2000);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [canvasContext, params.id, canvasName]);

  if (!canvasContext) {
    return null;
  }

  const canvasStore: CanvasStoreContextType = {
    canvasContext,
    canvasName,
    setCanvasName,
  };

  return (
    <CanvasStoreContext.Provider value={canvasStore}>
      {children}
    </CanvasStoreContext.Provider>
  );
};

export default CanvasStoreProvider;
