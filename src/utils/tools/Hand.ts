import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import throttle from "../throttle";

class Hand implements Tool {
  cursor: string = "grab";
  definableStyles: Array<keyof CanvasStyles> = [];

  private canvasContext: CanvasContext;
  private position: [number, number] | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
  }

  handleMouseUp() {
    this.position = null;
    if (this.canvasContext.canvas) {
      this.canvasContext.canvas.style.cursor = "grab";
    }
  }

  handleMouseMove(x: number, y: number) {
    if (this.position) {
      this.canvasContext.translate(x - this.position[0], y - this.position[1]);
    }
  }

  handleMouseDown(x: number, y: number) {
    this.position = [x, y];
    if (this.canvasContext.canvas) {
      this.canvasContext.canvas.style.cursor = "grabbing";
    }
  }
}

export default Hand;
