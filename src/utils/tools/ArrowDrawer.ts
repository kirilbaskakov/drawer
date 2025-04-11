import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

class ArrowDrawer implements Tool {
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
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
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
    this.currentFigure.beginCurve();
    const d = Math.sqrt(
      Math.pow(x - this.lineStart[0], 2) + Math.pow(y - this.lineStart[1], 2),
    );
    const h = 12;
    const dx = (x - this.lineStart[0]) / d,
      dy = (y - this.lineStart[1]) / d;
    const px = dy,
      py = -dx;
    this.currentFigure.addPoint(x - h * (dx + px), y - h * (dy + py));
    this.currentFigure.addPoint(x, y);
    this.currentFigure.addPoint(x - h * (dx - px), y - h * (dy - py));
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

export default ArrowDrawer;
