import { CanvasStyles } from "../../types/CanvasStyles";
import Rect from "../../types/Rect";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

class Eraser implements Tool {
  cursor: string = "none";
  definableStyles: Array<keyof CanvasStyles> = [];

  private canvasContext: CanvasContext;
  private size = 10;
  private isErasing = false;
  private cursorFigure: Figure | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 10);
  }

  handleMouseUp() {
    this.isErasing = false;
  }

  handleMouseMove(x: number, y: number) {
    if (!this.cursorFigure) {
      this.cursorFigure = new Figure(true);
      this.cursorFigure.setStyles({
        lineWidth: 1,
        fillStyle: "white",
        strokeStyle: "black",
      });
      this.canvasContext.addFigure(this.cursorFigure);
    }
    const position = [x, y];
    const rect: Rect = {
      x1: position[0] - this.size / 2,
      y1: position[1] - this.size / 2,
      x2: position[0] + this.size / 2,
      y2: position[1] + this.size / 2,
    };
    this.cursorFigure.clear();
    this.cursorFigure.addRect(rect);
    this.canvasContext.repaint();
    if (!this.isErasing) {
      return;
    }
    this.canvasContext
      .selectFiguresIntersectRect(rect)
      .forEach(
        (figure) =>
          figure.id != this.cursorFigure?.id &&
          this.canvasContext.deleteFigure(figure),
      );
  }

  handleMouseDown() {
    this.isErasing = true;
  }

  handleMouseLeave() {
    if (this.cursorFigure) {
      this.canvasContext.deleteFigure(this.cursorFigure);
      this.cursorFigure = null;
    }
  }

  reset() {
    if (this.cursorFigure) {
      this.canvasContext.deleteFigure(this.cursorFigure);
    }
    this.cursorFigure = null;
  }
}

export default Eraser;
