import { useState } from "react";
import { canvasContext } from "../utils/CanvasContext";

const Zoom = () => {
  const [zoom, setZoom] = useState(1);

  const updateZoom = (delta: number) => () => {
    const newZoom = zoom + delta;
    if (newZoom > 0.05 && newZoom <= 30) {
      setZoom(newZoom);
      canvasContext.zoom(newZoom);
    }
  };

  return (
    <div className="toolbar toolbar-bottom-right">
      <button className="zoom-button" onClick={updateZoom(-0.1)}>
        -
      </button>
      <p className="zoom-value">{Math.round(zoom * 100)}%</p>
      <button className="zoom-button" onClick={updateZoom(0.1)}>
        +
      </button>
    </div>
  );
};

export default Zoom;
