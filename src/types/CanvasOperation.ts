type CanvasOperation = {
  apply: () => void;
  rollback: () => void;
};

export default CanvasOperation;
