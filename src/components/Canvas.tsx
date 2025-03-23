import { useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import useCanvasContext from "../hooks/useCanvasContext";

const Canvas = () => {
  const { width, height } = useWindowSize();
  const { canvasContext } = useCanvasContext();

  useEffect(() => {
    canvasContext.repaint();
  }, [width, height]);

  const canvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasContext.connectCanvas(canvas);
    }
  };

  return <canvas id="canvas" ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
