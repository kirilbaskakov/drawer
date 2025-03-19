import { canvasContext } from "./CanvasContext";

const saveCanvas = (id: string) => {
  const json = localStorage.getItem("canvases");
  const canvases = json ? JSON.parse(json) : {};
  canvases[id] = JSON.stringify(canvasContext);
  localStorage.setItem("canvases", canvases);
};

export default saveCanvas;
