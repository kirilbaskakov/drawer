import CanvasContext from "../CanvasContext";

const saveCanvas = (canvasContext: CanvasContext, id: string, name: string) => {
  const json = localStorage.getItem("canvases");
  const canvases = json ? JSON.parse(json) : {};
  canvases[id] = {
    name,
    lastOpen: +new Date(),
    canvasContext: canvasContext.toJSON(),
  };
  localStorage.setItem("canvases", JSON.stringify(canvases));
};

export default saveCanvas;
