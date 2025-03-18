import { DEFAULT_BOUDING_RECT } from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
import Segment from "../types/Segment";
import { canvasContext } from "./CanvasContext";
import doRectsIntersect from "./geometry/doRectsIntersect";
import isRectInside from "./geometry/isRectInside";
import updateBoundingRect from "./geometry/updateBoundingRect";

class Figure {
  id: number;
  isAdditional = false;
  boundingRect: Rect = { ...DEFAULT_BOUDING_RECT };
  styles: CanvasStyles;

  private offset = [0, 0];
  private instructions: Array<[any, any]> = [];
  private segments: Segment[] = [];
  private segStart: [number, number] = [0, 0];

  constructor(isAdditional = false) {
    this.isAdditional = isAdditional;
    this.id = +new Date();
    this.styles = { ...canvasContext.styles };
    this.applyStyles();
  }

  translate(dx: number, dy: number) {
    this.offset[0] += dx;
    this.offset[1] += dy;
    this.boundingRect.x1 += dx;
    this.boundingRect.x2 += dx;
    this.boundingRect.y1 += dy;
    this.boundingRect.y2 += dy;
  }

  beginLine(clientX: number, clientY: number) {
    const [x, y] = this.translateClientPoint(clientX, clientY);
    canvasContext.context?.beginPath();
    this.instructions.push(["beginPath", []]);
    canvasContext.context?.moveTo(x, y);
    this.instructions.push(["moveTo", [x, y]]);
    this.segStart = [x, y];
    updateBoundingRect(this.boundingRect, x, y);
  }

  drawLine(clientX: number, clientY: number) {
    const [x, y] = this.translateClientPoint(clientX, clientY);
    canvasContext.context?.lineTo(x, y);
    this.instructions.push(["lineTo", [x, y]]);
    canvasContext.context?.stroke();
    // this.instructions.push(["stroke", []]);
    this.segments.push({
      x1: this.segStart[0],
      y1: this.segStart[1],
      x2: x,
      y2: y,
    });
    this.segStart = [x, y];
    updateBoundingRect(this.boundingRect, x, y);
  }

  drawEllipse({ x1, y1, x2, y2 }: Rect) {
    [x1, y1] = this.translateClientPoint(x1, y1);
    [x2, y2] = this.translateClientPoint(x2, y2);
    updateBoundingRect(this.boundingRect, x1, y1);
    updateBoundingRect(this.boundingRect, x2, y2);
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.abs(x2 - x1) / 2;
    const radiusY = Math.abs(y2 - y1) / 2;
    canvasContext.context?.beginPath();
    this.instructions.push(["beginPath", []]);
    canvasContext.context?.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI,
    );
    this.instructions.push([
      "ellipse",
      [centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI],
    ]);
    canvasContext.context?.fill();
    this.instructions.push(["fill", []]);
    canvasContext.context?.stroke();
    this.instructions.push(["stroke", []]);
  }

  drawRect(rect: Rect) {
    this.drawPolygon([
      [rect.x1, rect.y1],
      [rect.x2, rect.y1],
      [rect.x2, rect.y2],
      [rect.x1, rect.y2],
    ]);
  }

  drawPolygon(points: Array<[number, number]>) {
    this.beginLine(...points[0]);
    for (let i = 0; i < points.length; i++) {
      this.drawLine(...points[i + 1 >= points.length ? 0 : i + 1]);
    }
    canvasContext.context?.fill();
    this.instructions.push(["fill", []]);
    canvasContext.context?.stroke();
    this.instructions.push(["stroke", []]);
  }

  intersectWith(clientRect: Rect) {
    return doRectsIntersect(clientRect, this.getClientBoundingRect());
  }

  containsIn(clientRect: Rect) {
    return isRectInside(clientRect, this.getClientBoundingRect());
  }

  getClientBoundingRect(): Rect {
    const [x1, y1] = this.translateToClientPoint(
      this.boundingRect.x1,
      this.boundingRect.y1,
    );
    const [x2, y2] = this.translateToClientPoint(
      this.boundingRect.x2,
      this.boundingRect.y2,
    );
    return {
      x1,
      y1,
      x2,
      y2,
    };
  }

  clearBoundingRect() {
    const w = this.boundingRect.x2 - this.boundingRect.x1;
    const h = this.boundingRect.y2 - this.boundingRect.y1;
    canvasContext.context?.clearRect(
      this.boundingRect.x1 - 5,
      this.boundingRect.y1 - 5,
      w + 10,
      h + 10,
    );
  }

  setStyles(styles: Partial<CanvasStyles>) {
    this.styles = { ...this.styles, ...styles };
    this.applyStyles();
  }

  clear() {
    this.clearBoundingRect();
    this.instructions = [];
    this.boundingRect = { ...DEFAULT_BOUDING_RECT };
    this.segments = [];
  }

  repaint() {
    canvasContext.context?.save();
    canvasContext.context?.translate(this.offset[0], this.offset[1]);
    this.applyStyles();
    this.instructions.forEach((instruction) => {
      canvasContext.context?.[instruction[0]](...instruction[1]);
    });
    canvasContext.context?.stroke();
    canvasContext.context?.restore();
  }

  private applyStyles() {
    if (!canvasContext.context) {
      return;
    }
    canvasContext.context.strokeStyle = this.styles.strokeStyle;
    canvasContext.context.lineWidth = this.styles.lineWidth;
    canvasContext.context.setLineDash(this.styles.lineDash);
    canvasContext.context.fillStyle = this.styles.fillStyle;
  }

  private translateClientPoint(clientX: number, clientY: number) {
    clientX -= canvasContext.offset[0];
    clientY -= canvasContext.offset[1];
    clientX /= canvasContext.scaleFactor;
    clientY /= canvasContext.scaleFactor;
    return [clientX, clientY];
  }

  private translateToClientPoint(x: number, y: number) {
    x *= canvasContext.scaleFactor;
    y *= canvasContext.scaleFactor;
    x += canvasContext.offset[0];
    y += canvasContext.offset[1];
    return [x, y];
  }
}
export default Figure;
