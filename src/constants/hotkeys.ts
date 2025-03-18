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
  { name: "Отменить", keys: KEY_BINDINGS.UNDO },
  { name: "Повторить", keys: KEY_BINDINGS.REDO },
  { name: "Удалить", keys: KEY_BINDINGS.DELETE },
  { name: "Увеличить", keys: KEY_BINDINGS.ZOOM_IN },
  { name: "Уменьшить", keys: KEY_BINDINGS.ZOOM_OUT },
  { name: "Выбрать все", keys: KEY_BINDINGS.SELECT_ALL },
  { name: "Копировать", keys: KEY_BINDINGS.COPY },
  { name: "Вставить", keys: KEY_BINDINGS.PASTE },
  { name: "Вырезать", keys: KEY_BINDINGS.CUT },
];

export default KEY_BINDINGS;
