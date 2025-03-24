import { CanvasStyles } from "../../../types/CanvasStyles";
import Primitive from "../../../types/Primitive";
import Rect from "../../../types/Rect";
import getTextDimensions from "../../canvasUtils/getTextDimensions";
import createPolygonFromRect from "../../geometry/createPolygonFromRect";
import rectIntersectPolygon from "../../geometry/rectIntersectPolygon";
import parseObject from "../../parseObject";

class TextPrimitive implements Primitive {
  x: number;
  y: number;
  text: string;

  scaleValue: [number, number] = [1, 1];
  translateValue: [number, number] = [0, 0];
  font: string;

  constructor(x: number, y: number, text: string, font: string) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
  }

  draw(context: CanvasRenderingContext2D, defaultStyles: CanvasStyles) {
    context.fillStyle = defaultStyles.strokeStyle;
    context.textBaseline = "top";
    context.save();
    context.scale(this.scaleValue[0], this.scaleValue[1]);
    context.translate(
      this.translateValue[0] / this.scaleValue[0],
      this.translateValue[1] / this.scaleValue[1],
    );
    context.fillText(this.text, this.x, this.y);
    context.restore();
    context.fillStyle = defaultStyles.fillStyle;
  }

  scale(scaleX: number, scaleY: number) {
    this.scaleValue[0] *= scaleX;
    this.scaleValue[1] *= scaleY;
    this.translateValue[0] *= scaleX;
    this.translateValue[1] *= scaleY;
  }

  translate(dx: number, dy: number) {
    this.translateValue[0] += dx;
    this.translateValue[1] += dy;
  }

  getBoundingRect(): Rect {
    const x = this.x * this.scaleValue[0] + this.translateValue[0];
    const y = this.y * this.scaleValue[1] + this.translateValue[1];
    const { width, height } = getTextDimensions(this.text, this.font);
    const w = width * this.scaleValue[0];
    const h = height * this.scaleValue[1];
    return {
      x1: x,
      y1: y,
      x2: x + w,
      y2: y + h,
    };
  }

  intersectsWith(rect: Rect) {
    return rectIntersectPolygon(
      rect,
      createPolygonFromRect(this.getBoundingRect()),
    );
  }

  static fromJSON(jsonString: string) {
    const object = new TextPrimitive(0, 0, "", "");
    parseObject(jsonString, object, [
      "x",
      "y",
      "text",
      "font",
      "scaleValue",
      "translateValue",
    ]);
    return object;
  }
}

export default TextPrimitive;
