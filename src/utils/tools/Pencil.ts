import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import Tool from "../Tool";

class Pencil implements Tool {
  private canvasContext: CanvasContext;
  private isDrawing: boolean = false;
  private currentFigure: Figure | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
  }

  handleMouseUp(e: MouseEvent) {
    this.isDrawing = false;
    this.currentFigure?.drawLine(e.pageX, e.pageY);
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }
    this.currentFigure?.drawLine(e.pageX, e.pageY);
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.canvasContext.context) {
      return;
    }
    this.isDrawing = true;
    this.currentFigure = new Figure(
      this.canvasContext.context,
      this.canvasContext.offset,
    );
    this.canvasContext.addFigure(this.currentFigure);
    this.currentFigure.beginLine(e.pageX, e.pageY);
  }
}

export const pencil = new Pencil(canvasContext);

export default Pencil;
