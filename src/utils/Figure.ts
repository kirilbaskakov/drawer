import FigureInstruction from "../types/FigureInstruction";
import Rect from "../types/Rect";
import Segment from "../types/Segment";
import segmentIntersectRect from "./geometry/segmentIntersectRect";

class Figure {
  id: number;
  instructions: Array<[any, any]> = [];
  boundingRect: Rect = { x1: 9999, y1: 9999, x2: -9999, y2: -9999 };

  private context: CanvasRenderingContext2D;
  private segments: Segment[] = [];
  private segStart: [number, number] = [0, 0];
  private offset: [number, number] = [0, 0];

  constructor(
    context: CanvasRenderingContext2D,
    offset: [number, number] = [0, 0],
  ) {
    this.id = +new Date();
    this.context = context;
    this.offset = offset;
  }

  beginLine(x: number, y: number) {
    x -= this.offset[0];
    y -= this.offset[1];
    this.context.beginPath();
    this.instructions.push(["beginPath", []]);
    this.context.moveTo(x, y);
    this.instructions.push(["moveTo", [x, y]]);
    this.segStart = [x, y];
    this.updateBoundingRect(x, y);
  }

  drawLine(x: number, y: number) {
    x -= this.offset[0];
    y -= this.offset[1];
    this.context.lineTo(x, y);
    this.instructions.push(["lineTo", [x, y]]);
    this.context.stroke();
    this.instructions.push(["stroke", []]);
    this.segments.push({
      x1: this.segStart[0],
      y1: this.segStart[1],
      x2: x,
      y2: y,
    });
    this.updateBoundingRect(x, y);
  }

  drawPolygon(points: Array<[number, number]>) {
    for (let i = 0; i < points.length; i++) {
      this.beginLine(...points[i]);
      this.drawLine(...points[i + 1 >= points.length ? 0 : i + 1]);
    }
  }

  intersectWith(rect: Rect) {
    return this.segments.some((segment) => segmentIntersectRect(segment, rect));
  }

  containsIn(rect: Rect) {
    return this.segments.every((segment) =>
      segmentIntersectRect(segment, rect),
    );
  }

  clearBoundingRect() {
    const w = this.boundingRect.x2 - this.boundingRect.x1;
    const h = this.boundingRect.y2 - this.boundingRect.y1;
    this.context.clearRect(
      this.boundingRect.x1 - 5,
      this.boundingRect.y1 - 5,
      w + 10,
      h + 10,
    );
  }

  clear() {
    this.clearBoundingRect();
    this.instructions = [];
    this.boundingRect = { x1: 9999, y1: 9999, x2: -9999, y2: -9999 };
    this.segments = [];
  }

  repaint() {
    this.instructions.forEach((instruction) => {
      this.context[instruction[0]](...instruction[1]);
    });
  }

  private updateBoundingRect(x: number, y: number) {
    this.boundingRect.x1 = Math.min(this.boundingRect.x1, x);
    this.boundingRect.x2 = Math.max(this.boundingRect.x2, x);
    this.boundingRect.y1 = Math.min(this.boundingRect.y1, y);
    this.boundingRect.y2 = Math.max(this.boundingRect.y2, y);
  }
}

export default Figure;
