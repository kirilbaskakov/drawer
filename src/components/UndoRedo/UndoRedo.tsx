import { observer } from "mobx-react-lite";
import { GrRedo,GrUndo } from "react-icons/gr";

import useCanvasContext from "@/hooks/useCanvasContext";

import styles from "./UndoRedo.module.css";

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
        className={styles.undoRedoButton}
        onClick={onUndoClick}
        disabled={!canvasContext.canUndo}
      >
        <GrUndo />
      </button>
      <button
        className={styles.undoRedoButton}
        onClick={onRedoClick}
        disabled={!canvasContext.canRedo}
      >
        <GrRedo />
      </button>
    </div>
  );
});

export default UndoRedo;
