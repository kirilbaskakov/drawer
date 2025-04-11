import Primitive from "../../../types/Primitive";
import Rect from "../../../types/Rect";
import createPolygonFromRect from "../../geometry/createPolygonFromRect";
import rectIntersectPolygon from "../../geometry/rectIntersectPolygon";
import parseObject from "../../storage/parseObject";

class EllipsePrimitive implements Primitive {
  center: [number, number];
  radius: [number, number];

  constructor({ x1, y1, x2, y2 }: Rect) {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.abs(x2 - x1) / 2;
    const radiusY = Math.abs(y2 - y1) / 2;
    this.center = [centerX, centerY];
    this.radius = [radiusX, radiusY];
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.ellipse(...this.center, ...this.radius, 0, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  }

  scale(scaleX: number, scaleY: number) {
    this.center[0] *= scaleX;
    this.center[1] *= scaleY;
    this.radius[0] *= scaleX;
    this.radius[1] *= scaleY;
  }

  translate(dx: number, dy: number) {
    this.center[0] += dx;
    this.center[1] += dy;
  }

  getBoundingRect(): Rect {
    return {
      x1: this.center[0] - this.radius[0],
      y1: this.center[1] - this.radius[1],
      x2: this.center[0] + this.radius[0],
      y2: this.center[1] + this.radius[1],
    };
  }

  intersectsWith(rect: Rect) {
    return rectIntersectPolygon(
      rect,
      createPolygonFromRect(this.getBoundingRect()),
    );
  }

  static fromJSON(jsonString: string) {
    const object = new EllipsePrimitive({ x1: 0, y1: 0, x2: 0, y2: 0 });
    parseObject(jsonString, object, ["center", "radius"]);
    return object;
  }
}

export default EllipsePrimitive;
