import Rect from "../../types/Rect";
import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../Tool";

class RectangleDrawer implements Tool {
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
    this.drawRect({
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

  private drawRect({ x1, y1, x2, y2 }: Rect) {
    if (!this.currentFigure) {
      return;
    }
    this.currentFigure.drawPolygon([
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
    ]);
  }
}

export const rectangleDrawer = new RectangleDrawer(canvasContext);

export default RectangleDrawer;
