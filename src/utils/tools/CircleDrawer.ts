import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../../types/Tool";

class CircleDrawer implements Tool {
  cursor: string = "crosshair";

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

  handleMouseMove(e: MouseEvent) {
    if (!this.circleStart || !this.currentFigure) {
      return;
    }
    this.currentFigure.clear();
    this.currentFigure.drawEllipse({
      x1: this.circleStart[0],
      y1: this.circleStart[1],
      x2: e.pageX,
      y2: e.pageY,
    });
    this.canvasContext.repaint();
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.canvasContext.context) {
      return;
    }
    this.circleStart = [e.pageX, e.pageY];
    this.currentFigure = new Figure();
    this.canvasContext.addFigure(this.currentFigure);
  }
}

export const circleDrawer = new CircleDrawer(canvasContext);

export default CircleDrawer;
