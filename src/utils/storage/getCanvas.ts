import CanvasContext from "../CanvasContext";

const getCanvas = (id: string) => {
  const json = localStorage.getItem("canvases");
  const canvases = json ? JSON.parse(json) : {};
  const canvas = canvases[id];
  return {
    canvasContext:
      canvas?.canvasContext && CanvasContext.fromJSON(canvas.canvasContext),
    name: canvas?.name,
    lastOpen: canvas?.lastOpen,
  };
};

export default getCanvas;
