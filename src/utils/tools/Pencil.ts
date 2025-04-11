import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

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
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
  }

  handleMouseUp(x: number, y: number) {
    if (!this.isDrawing) return;
    this.currentFigure?.addPoint(x, y);
    this.canvasContext.repaint();
    this.isDrawing = false;
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
