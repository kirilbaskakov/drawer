import useWindowSize from "../hooks/useWindowSize";
import { canvasContext } from "../utils/CanvasContext";

const Canvas = () => {
  const { width, height } = useWindowSize();

  const canvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasContext.connectCanvas(canvas);
    }
  };

  return <canvas id="canvas" ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
