const deleteCanvas = (id: string) => {
  const json = localStorage.getItem("canvases");
  const canvases = json ? JSON.parse(json) : {};
  if (canvases[id]) {
    delete canvases[id];
  }
  localStorage.setItem("canvases", JSON.stringify(canvases));
};

export default deleteCanvas;
