import { CanvasStyles } from "../types/CanvasStyles";

export const STROKE_COLORS = [
  "#000000",
  "#ba0202",
  "#d4db02",
  "#0267db",
  "#18c900",
];

export const LINE_WIDTHS = [4, 6, 8];

export const LINE_DASH = [[], [15]];

export const FILL_COLORS = [
  "transparent",
  "#ff4d4d",
  "#f7ff5c",
  "#5ca3ff",
  "#ffc65c",
];

export const CANVAS_COLORS = [
  "#fff",
  "#F8BBD0",
  "#B3E5FC",
  "#B2DFDB",
  "#E1BEE7",
];

export const DEFAULT_STYLES: CanvasStyles = {
  strokeStyle: "#000000",
  lineWidth: 4,
  lineDash: [],
  fillStyle: "transparent",
};

export const SELECTION_STYLES: Partial<CanvasStyles> = {
  strokeStyle: "#d844fc",
  fillStyle: "rgba(216, 68, 252, 0.1)",
  lineWidth: 1,
  lineDash: [],
};

export const SELECTED_STYLES: Partial<CanvasStyles> = {
  strokeStyle: "#d844fc",
  fillStyle: "transparent",
  lineWidth: 1,
  lineDash: [],
};
