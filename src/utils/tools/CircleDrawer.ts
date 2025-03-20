import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../../types/Tool";
import { CanvasStyles } from "../../types/CanvasStyles";

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
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
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
    this.canvasContext.addFigure(this.currentFigure);
  }
}

export const circleDrawer = new CircleDrawer(canvasContext);

export default CircleDrawer;
