import getCanvas from "./getCanvas";

const getAllCanvases = () => {
  const canvases = localStorage.getItem("canvases");
  const ids = canvases ? Object.keys(JSON.parse(canvases)) : [];
  return ids.map((id) => {
    const { name, lastOpen, canvasContext } = getCanvas(id);
    const image = canvasContext.export();
    canvasContext.delete();
    return { name, lastOpen, image, id };
  });
};

export default getAllCanvases;
