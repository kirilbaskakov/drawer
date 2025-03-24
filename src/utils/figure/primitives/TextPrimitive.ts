import { CanvasStyles } from "../../../types/CanvasStyles";
import Primitive from "../../../types/Primitive";
import Rect from "../../../types/Rect";
import createPolygonFromRect from "../../geometry/createPolygonFromRect";
import rectIntersectPolygon from "../../geometry/rectIntersectPolygon";

class TextPrimitive implements Primitive {
  x: number;
  y: number;
  text: string;

  private scaleValue: [number, number] = [1, 1];
  private translateValue: [number, number] = [0, 0];

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.text = text;
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
    //  const { width } = context.measureText(text.text);
    //  updateBoundingRect(
    //    this.boundingRect,
    //    text.x * text.scale[0] + text.translate[0] + width,
    //    this.boundingRect.y2,
    //  );
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
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + 100,
      y2: this.y + 20,
    };
  }
}

export default TextPrimitive;
