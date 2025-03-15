import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../../types/Tool";

class RectangleDrawer implements Tool {
  cursor: string = "crosshair";

  private canvasContext: CanvasContext;
  private currentFigure: Figure | null = null;
  private rectStart: null | [number, number] = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp() {
    this.rectStart = null;
    this.currentFigure = null;
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.rectStart || !this.currentFigure) {
      return;
    }
    this.currentFigure.clear();
    this.currentFigure.drawRect({
      x1: this.rectStart[0],
      y1: this.rectStart[1],
      x2: e.pageX,
      y2: e.pageY,
    });
    this.canvasContext.repaint();
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.canvasContext.context) {
      return;
    }
    this.rectStart = [e.pageX, e.pageY];
    this.currentFigure = new Figure();
    this.canvasContext.addFigure(this.currentFigure);
  }
}

export const rectangleDrawer = new RectangleDrawer(canvasContext);

export default RectangleDrawer;
