import { useEffect } from "react";

import useCanvasContext from "@/hooks/useCanvasContext";
import useWindowSize from "@/hooks/useWindowSize";

const Canvas = () => {
  const { width, height } = useWindowSize();
  const { canvasContext } = useCanvasContext();

  useEffect(() => {
    canvasContext.repaint();
  }, [canvasContext, width, height]);

  const canvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasContext.connectCanvas(canvas);
    }
  };

  return <canvas id="canvas" ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
