import CanvasContext, { canvasContext } from "../CanvasContext";
import throttle from "../throttle";
import Tool from "../Tool";

class Hand implements Tool {
  private canvasContext: CanvasContext;
  private position: [number, number] | null = null;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp() {
    this.position = null;
  }

  handleMouseMove(e: MouseEvent) {
    if (this.position) {
      this.canvasContext.translate(
        e.pageX - this.position[0],
        e.pageY - this.position[1],
      );
      this.position = [e.pageX, e.pageY];
    }
  }

  handleMouseDown(e: MouseEvent) {
    this.position = [e.pageX, e.pageY];
  }
}

export const hand = new Hand(canvasContext);

export default Hand;
