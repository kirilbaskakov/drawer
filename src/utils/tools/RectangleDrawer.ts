import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

class RectangleDrawer implements Tool {
  cursor: string = "crosshair";
  definableStyles: Array<keyof CanvasStyles> = [
    "strokeStyle",
    "lineWidth",
    "lineDash",
    "fillStyle",
  ];

  private canvasContext: CanvasContext;
  private currentFigure: Figure | null = null;
  private rectStart: null | [number, number] = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
  }

  handleMouseUp() {
    this.rectStart = null;
    this.currentFigure = null;
  }

  handleMouseMove(x: number, y: number) {
    if (!this.rectStart || !this.currentFigure) {
      return;
    }
    this.currentFigure.clear();
    this.currentFigure.addRect({
      x1: this.rectStart[0],
      y1: this.rectStart[1],
      x2: x,
      y2: y,
    });
    this.canvasContext.repaint();
  }

  handleMouseDown(x: number, y: number) {
    if (!this.canvasContext.context) {
      return;
    }
    this.rectStart = [x, y];
    this.currentFigure = new Figure();
    this.canvasContext.addFigure(this.currentFigure);
    this.currentFigure.setStyles(this.canvasContext.styles);
  }
}

export default RectangleDrawer;
