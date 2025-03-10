import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../Tool";

class LineDrawer implements Tool {
  private canvasContext: CanvasContext;
  private lineStart: null | [number, number] = null;
  private currentFigure: Figure | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp() {}

  handleMouseMove(e: MouseEvent) {
    if (!this.lineStart || !this.currentFigure) {
      return;
    }
    this.currentFigure.clear();
    this.currentFigure.beginLine(...this.lineStart);
    this.currentFigure.drawLine(e.pageX, e.pageY);
    this.canvasContext.repaint();
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.canvasContext.context) {
      return;
    }
    if (this.lineStart) {
      this.lineStart = null;
      this.currentFigure = null;
      return;
    }
    this.lineStart = [e.pageX, e.pageY];
    this.currentFigure = new Figure(
      this.canvasContext.context,
      this.canvasContext.offset,
    );
    this.canvasContext.addFigure(this.currentFigure);
    this.currentFigure.beginLine(e.pageX, e.pageY);
    this.currentFigure.drawLine(e.pageX, e.pageY);
  }
}

export const lineDrawer = new LineDrawer(canvasContext);

export default LineDrawer;
