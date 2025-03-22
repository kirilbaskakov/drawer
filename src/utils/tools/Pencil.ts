import CanvasContext from "../CanvasContext";
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

  handleMouseUp(x: number, y: number) {
    this.isDrawing = false;
    this.currentFigure?.addPoint(x, y);
    this.canvasContext.repaint();
  }

  handleMouseMove(x: number, y: number) {
    if (!this.isDrawing) {
      return;
    }
    this.currentFigure?.addPoint(x, y);
    this.canvasContext.repaint();
  }

  handleMouseDown(x: number, y: number) {
    if (!this.canvasContext.context) {
      return;
    }
    this.isDrawing = true;
    this.currentFigure = new Figure();
    this.canvasContext.addFigure(this.currentFigure);
    this.currentFigure.setStyles(this.canvasContext.styles);
    this.currentFigure.beginCurve();
    this.currentFigure.addPoint(x, y);
  }
}

export default Pencil;
