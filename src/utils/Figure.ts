import { DEFAULT_BOUDING_RECT } from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
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
  private lines: Array<[number, number][]> = [];

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
    canvasContext.context?.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI,
    );
    // this.instructions.push([
    //   "ellipse",
    //   [centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI],
    // ]);
    canvasContext.context?.fill();
    canvasContext.context?.stroke();
  }

  beginLine() {
    this.lines.push([]);
  }

  addPoint(clientX: number, clientY: number) {
    const [x, y] = this.translateClientPoint(clientX, clientY);
    this.lines[this.lines.length - 1].push([x, y]);
    updateBoundingRect(this.boundingRect, x, y);
  }

  endLine() {
    const last = this.lines[this.lines.length - 1];
    last.push(last[0]);
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
    this.lines.push([...points, points[0]]);
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

  setStyles(styles: Partial<CanvasStyles>) {
    this.styles = { ...this.styles, ...styles };
    this.applyStyles();
  }

  clear() {
    this.boundingRect = { ...DEFAULT_BOUDING_RECT };
    this.lines = [];
  }

  repaint() {
    canvasContext.context?.save();
    canvasContext.context?.translate(this.offset[0], this.offset[1]);
    this.applyStyles();
    for (const line of this.lines) {
      if (!line.length) {
        return;
      }
      canvasContext.context?.moveTo(line[0][0], line[0][1]);
      for (let i = 0; i < line.length; i++) {
        canvasContext.context?.lineTo(line[i][0], line[i][1]);
      }
      canvasContext.context?.stroke();
      if (this.styles.fillStyle != "transparent") {
        canvasContext.context?.fill();
      }
    }
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
