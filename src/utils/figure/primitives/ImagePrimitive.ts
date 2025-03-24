import Primitive from "../../../types/Primitive";
import Rect from "../../../types/Rect";
import createPolygonFromRect from "../../geometry/createPolygonFromRect";
import rectIntersectPolygon from "../../geometry/rectIntersectPolygon";
import parseObject from "../../parseObject";

class ImagePrimitive implements Primitive {
  x: number;
  y: number;
  image: HTMLImageElement | null;

  src: string;
  scaleValue: [number, number] = [1, 1];
  translateValue: [number, number] = [0, 0];

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.src = image.src;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.image?.src) {
      context.save();
      context.scale(this.scaleValue[0], this.scaleValue[1]);
      context.translate(
        this.translateValue[0] / this.scaleValue[0],
        this.translateValue[1] / this.scaleValue[1],
      );
      context.drawImage(this.image, this.x, this.y);
      context.restore();
    } else {
      this.image = new Image();
      this.image.onload = () => {
        this.draw(context);
      };
      this.image.src = this.src;
    }
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
    const w = (this.image?.width ?? 0) * this.scaleValue[0];
    const h = (this.image?.height ?? 0) * this.scaleValue[1];
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
    const object = new ImagePrimitive(0, 0, new Image());
    parseObject(jsonString, object, [
      "x",
      "y",
      "image",
      "src",
      "scaleValue",
      "translateValue",
    ]);
    return object;
  }
}

export default ImagePrimitive;
