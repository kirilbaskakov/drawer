export const KEY_BINDINGS = {
  UNDO: [["ControlLeft", "KeyZ"]],
  REDO: [["ControlLeft", "ShiftLeft", "KeyZ"]],
  DELETE: [["Delete"]],
  ZOOM_IN: [["ControlLeft", "Equal"]],
  ZOOM_OUT: [["ControlLeft", "Minus"]],
  SELECT_ALL: [["ControlLeft", "KeyA"]],
  COPY: [["ControlLeft", "KeyC"]],
  PASTE: [["ControlLeft", "KeyV"]],
  CUT: [["ControlLeft", "KeyX"]],
};

export const KEY_NAMES = {
  ControlLeft: "Ctrl",
  ShiftLeft: "Shift",
  KeyZ: "Z",
  KeyA: "A",
  KeyC: "C",
  KeyV: "V",
  KeyX: "X",
  Equal: "+",
  Minus: "-",
  Delete: "Delete",
};

export const KEY_BINDINGS_INFO = [
  { nameKey: "undo", keys: KEY_BINDINGS.UNDO },
  { nameKey: "redo", keys: KEY_BINDINGS.REDO },
  { nameKey: "delete", keys: KEY_BINDINGS.DELETE },
  { nameKey: "zoomIn", keys: KEY_BINDINGS.ZOOM_IN },
  { nameKey: "zoomOut", keys: KEY_BINDINGS.ZOOM_OUT },
  { nameKey: "selectAll", keys: KEY_BINDINGS.SELECT_ALL },
  { nameKey: "copy", keys: KEY_BINDINGS.COPY },
  { nameKey: "paste", keys: KEY_BINDINGS.PASTE },
  { nameKey: "cut", keys: KEY_BINDINGS.CUT },
];

export default KEY_BINDINGS;
