import { GrUndo, GrRedo } from "react-icons/gr";
import { observer } from "mobx-react-lite";
import useCanvasContext from "../hooks/useCanvasContext";

const UndoRedo = observer(() => {
  const { canvasContext } = useCanvasContext();

  const onUndoClick = () => {
    canvasContext.undo();
  };

  const onRedoClick = () => {
    canvasContext.redo();
  };

  return (
    <div className="toolbar toolbar-bottom-left">
      <button
        className="undo-redo-button"
        onClick={onUndoClick}
        disabled={!canvasContext.canUndo}
      >
        <GrUndo />
      </button>
      <button
        className="undo-redo-button"
        onClick={onRedoClick}
        disabled={!canvasContext.canRedo}
      >
        <GrRedo />
      </button>
    </div>
  );
});

export default UndoRedo;
