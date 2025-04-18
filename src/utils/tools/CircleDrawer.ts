import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

class CircleDrawer implements Tool {
  cursor: string = "crosshair";
  definableStyles: Array<keyof CanvasStyles> = [
    "strokeStyle",
    "lineWidth",
    "lineDash",
    "fillStyle",
  ];

  private canvasContext: CanvasContext;
  private currentFigure: Figure | null = null;
  private circleStart: null | [number, number] = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
  }

  handleMouseUp() {
    this.circleStart = null;
    this.currentFigure = null;
  }

  handleMouseMove(x: number, y: number) {
    if (!this.circleStart || !this.currentFigure) {
      return;
    }
    this.currentFigure.clear();
    this.currentFigure.addEllipse({
      x1: this.circleStart[0],
      y1: this.circleStart[1],
      x2: x,
      y2: y,
    });
    this.canvasContext.repaint();
  }

  handleMouseDown(x: number, y: number) {
    if (!this.canvasContext.context) {
      return;
    }
    this.circleStart = [x, y];
    this.currentFigure = new Figure();
    this.currentFigure.setStyles(this.canvasContext.styles);
    this.canvasContext.addFigure(this.currentFigure);
  }
}

export default CircleDrawer;
