import CanvasContext from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../../types/Tool";
import { CanvasStyles } from "../../types/CanvasStyles";

class LineDrawer implements Tool {
  cursor: string = "crosshair";
  definableStyles: Array<keyof CanvasStyles> = [
    "strokeStyle",
    "lineWidth",
    "lineDash",
  ];

  private canvasContext: CanvasContext;
  private lineStart: null | [number, number] = null;
  private currentFigure: Figure | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp() {}

  handleMouseMove(x: number, y: number) {
    if (!this.lineStart || !this.currentFigure) {
      return;
    }
    this.currentFigure.clear();
    this.currentFigure.beginCurve();
    this.currentFigure.addPoint(...this.lineStart);
    this.currentFigure.addPoint(x, y);
    this.canvasContext.repaint();
  }

  handleMouseDown(x: number, y: number) {
    if (!this.canvasContext.context) {
      return;
    }
    if (this.lineStart) {
      this.lineStart = null;
      this.currentFigure = null;
      return;
    }
    this.lineStart = [x, y];
    this.currentFigure = new Figure();
    this.canvasContext.addFigure(this.currentFigure);
    this.currentFigure.setStyles(this.canvasContext.styles);
    this.currentFigure.beginCurve();
    this.currentFigure.addPoint(x, y);
  }
}

export default LineDrawer;
