import { observer } from "mobx-react-lite";
import useCanvasContext from "../hooks/useCanvasContext";

const Zoom = observer(() => {
  const { canvasContext } = useCanvasContext();

  const updateZoom = (delta: number) => () => {
    const newZoom = canvasContext.scaleFactor + delta;
    if (newZoom > 0.05 && newZoom <= 30) {
      canvasContext.zoom(newZoom);
    }
  };

  return (
    <div className="toolbar toolbar-bottom-right">
      <button className="zoom-button" onClick={updateZoom(-0.1)}>
        -
      </button>
      <p className="zoom-value">
        {Math.round(canvasContext.scaleFactor * 100)}%
      </p>
      <button className="zoom-button" onClick={updateZoom(0.1)}>
        +
      </button>
    </div>
  );
});

export default Zoom;
