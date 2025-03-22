import CanvasContext from "./CanvasContext";

const getCanvas = (id: string) => {
  const json = localStorage.getItem("canvases");
  const canvases = json ? JSON.parse(json) : {};
  const canvas = canvases[id];
  if (!canvas) {
    return;
  }
  return CanvasContext.fromJSON(canvas);
};

export default getCanvas;
