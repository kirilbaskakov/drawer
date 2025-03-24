import { DEFAULT_BOUDING_RECT } from "../../../constants/drawingDefaults";
import { CanvasStyles } from "../../../types/CanvasStyles";
import Primitive from "../../../types/Primitive";
import Rect from "../../../types/Rect";
import applyStyles from "../../canvasUtils/applyStyles";
import rectIntersectPolygon from "../../geometry/rectIntersectPolygon";
import updateBoundingRect from "../../geometry/updateBoundingRect";

class CurvePrimitive implements Primitive {
  points: Array<[number, number]>;
  styles?: Partial<CanvasStyles>;

  constructor(points: Array<[number, number]>, styles?: Partial<CanvasStyles>) {
    this.points = points;
    this.styles = styles;
  }

  draw(context: CanvasRenderingContext2D, defaultStyles: CanvasStyles) {
    if (!this.points.length) {
      return;
    }
    if (this.styles) {
      applyStyles(context, this.styles);
    }
    context.beginPath();
    context.moveTo(...this.points[0]);
    for (const point of this.points) {
      context.lineTo(...point);
    }
    context.stroke();
    context?.fill();
    if (this.styles) {
      applyStyles(context, defaultStyles);
    }
  }

  scale(scaleX: number, scaleY: number) {
    for (const point of this.points) {
      point[0] *= scaleX;
      point[1] *= scaleY;
    }
  }

  translate(dx: number, dy: number) {
    for (const point of this.points) {
      point[0] += dx;
      point[1] += dy;
    }
  }

  getBoundingRect(): Rect {
    const boundingRect = { ...DEFAULT_BOUDING_RECT };
    for (const point of this.points) {
      updateBoundingRect(boundingRect, point[0], point[1]);
    }
    return boundingRect;
  }

  intersectsWith(rect: Rect) {
    return rectIntersectPolygon(rect, this.points);
  }

  toJSON() {
    return JSON.stringify(this);
  }

  fromJSON(jsonString: string) {
    const parsedObject = JSON.parse(jsonString);
    if (parsedObject.points) {
      this.points = parsedObject.points as Array<[number, number]>;
    }
    if (parsedObject.styles) {
      this.styles = parsedObject.styles as Partial<CanvasStyles>;
    }
  }
}

export default CurvePrimitive;
