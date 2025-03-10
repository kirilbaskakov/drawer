import Rect from "../../types/Rect";
import CanvasContext, { canvasContext } from "../CanvasContext";
import throttle from "../throttle";
import Tool from "../Tool";

class Eraser implements Tool {
  private canvasContext: CanvasContext;
  private size = 10;
  private isErasing = false;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp() {
    this.isErasing = false;
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.isErasing) {
      return;
    }
    const position = [
      e.pageX - this.canvasContext.offset[0],
      e.pageY - this.canvasContext.offset[1],
    ];
    const rect: Rect = {
      x1: position[0] - this.size / 2,
      y1: position[1] - this.size / 2,
      x2: position[0] + this.size / 2,
      y2: position[1] + this.size / 2,
    };
    this.canvasContext
      .selectFiguresIntersectRect(rect)
      .forEach((figure) => this.canvasContext.deleteFigure(figure));
  }

  handleMouseDown() {
    this.isErasing = true;
  }
}
export const eraser = new Eraser(canvasContext);

export default Eraser;
