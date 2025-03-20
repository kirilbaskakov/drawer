import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import Tool from "../../types/Tool";
import throttle from "../throttle";
import { CanvasStyles } from "../../types/CanvasStyles";

class Pencil implements Tool {
  cursor: string = "crosshair";
  definableStyles: Array<keyof CanvasStyles> = [
    "strokeStyle",
    "lineWidth",
    "lineDash",
  ];

  private canvasContext: CanvasContext;
  private isDrawing: boolean = false;
  private currentFigure: Figure | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp(e: MouseEvent) {
    this.isDrawing = false;
    this.currentFigure?.addPoint(e.pageX, e.pageY);
    this.canvasContext.repaint();
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }
    this.currentFigure?.addPoint(e.pageX, e.pageY);
    this.canvasContext.repaint();
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.canvasContext.context) {
      return;
    }
    this.isDrawing = true;
    this.currentFigure = new Figure();
    this.canvasContext.addFigure(this.currentFigure);
    this.currentFigure.beginLine();
    this.currentFigure.addPoint(e.pageX, e.pageY);
  }
}

export const pencil = new Pencil(canvasContext);

export default Pencil;
