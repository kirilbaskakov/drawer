import { DEFAULT_BOUDING_RECT } from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
import { canvasContext } from "./CanvasContext";
import doRectsIntersect from "./geometry/doRectsIntersect";
import isRectInside from "./geometry/isRectInside";
import updateBoundingRect from "./geometry/updateBoundingRect";

interface EllipsePrimitive {
  type: "ellipse";
  center: [number, number];
  radius: [number, number];
}

interface CurvePrimitive {
  type: "curve";
  points: Array<[number, number]>;
}

type Primitive = EllipsePrimitive | CurvePrimitive;

class Figure {
  id: number;
  isAdditional = false;
  boundingRect: Rect = { ...DEFAULT_BOUDING_RECT };
  styles: CanvasStyles;

  private offset = [0, 0];
  private primitives: Array<Primitive> = [];

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

  addEllipse({ x1, y1, x2, y2 }: Rect) {
    updateBoundingRect(this.boundingRect, x1, y1);
    updateBoundingRect(this.boundingRect, x2, y2);
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.abs(x2 - x1) / 2;
    const radiusY = Math.abs(y2 - y1) / 2;
    this.primitives.push({
      type: "ellipse",
      center: [centerX, centerY],
      radius: [radiusX, radiusY],
    });
  }

  beginCurve() {
    this.primitives.push({
      type: "curve",
      points: [],
    });
  }

  addPoint(x: number, y: number) {
    const curve = this.primitives[this.primitives.length - 1];
    if (curve.type != "curve") {
      return;
    }
    curve.points.push([x, y]);
    updateBoundingRect(this.boundingRect, x, y);
  }

  closeCurve() {
    const curve = this.primitives[this.primitives.length - 1];
    if (curve.type != "curve") {
      return;
    }
    curve.points.push(curve.points[0]);
  }

  addRect(rect: Rect) {
    this.addPolygon([
      [rect.x1, rect.y1],
      [rect.x2, rect.y1],
      [rect.x2, rect.y2],
      [rect.x1, rect.y2],
    ]);
  }

  addPolygon(points: Array<[number, number]>) {
    this.beginCurve();
    for (const point of points) {
      this.addPoint(...point);
    }
    this.closeCurve();
  }

  intersectWith(rect: Rect) {
    return doRectsIntersect(rect, this.boundingRect);
  }

  containsIn(rect: Rect) {
    return isRectInside(rect, this.boundingRect);
  }

  setStyles(styles: Partial<CanvasStyles>) {
    this.styles = { ...this.styles, ...styles };
    this.applyStyles();
  }

  clear() {
    this.boundingRect = { ...DEFAULT_BOUDING_RECT };
    this.primitives = [];
  }

  paint() {
    canvasContext.context?.save();
    canvasContext.context?.translate(this.offset[0], this.offset[1]);
    this.applyStyles();
    for (const primitive of this.primitives) {
      switch (primitive.type) {
        case "curve":
          this.drawCurve(primitive);
          break;
        case "ellipse":
          this.drawEllipse(primitive);
          break;
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

  private drawEllipse(ellipse: EllipsePrimitive) {
    canvasContext.context?.beginPath();
    canvasContext.context?.ellipse(
      ...ellipse.center,
      ...ellipse.radius,
      0,
      0,
      2 * Math.PI,
    );
    canvasContext.context?.stroke();
    if (this.styles.fillStyle != "transparent") {
      canvasContext.context?.fill();
    }
  }

  private drawCurve(curve: CurvePrimitive) {
    if (!curve.points.length) {
      return;
    }
    canvasContext.context?.beginPath();
    canvasContext.context?.moveTo(...curve.points[0]);
    for (const point of curve.points) {
      canvasContext.context?.lineTo(...point);
    }
    canvasContext.context?.stroke();
    if (this.styles.fillStyle != "transparent") {
      canvasContext.context?.fill();
    }
  }
}
export default Figure;
