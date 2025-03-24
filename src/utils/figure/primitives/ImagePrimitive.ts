import Primitive from "../../../types/Primitive";
import Rect from "../../../types/Rect";
import createPolygonFromRect from "../../geometry/createPolygonFromRect";
import rectIntersectPolygon from "../../geometry/rectIntersectPolygon";

class ImagePrimitive implements Primitive {
  x: number;
  y: number;
  image: HTMLImageElement | null;

  private src: string;
  private scaleValue: [number, number] = [1, 1];
  private translateValue: [number, number] = [0, 0];

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
        this.translateValue[0] / this.translateValue[0],
        this.translateValue[1] / this.translateValue[1],
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
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + (this.image?.width ?? 0),
      y2: this.y + (this.image?.height ?? 0),
    };
  }

  intersectsWith(rect: Rect) {
    return rectIntersectPolygon(
      rect,
      createPolygonFromRect(this.getBoundingRect()),
    );
  }

  toJSON() {
    return JSON.stringify(this);
  }

  fromJSON(parsedObject: Record<string, unknown>) {
    for (const property of [
      "x",
      "y",
      "image",
      "src",
      "scaleValue",
      "translateValue",
    ] as const) {
      if (parsedObject[property]) {
        this[property] = parsedObject[property] as any;
      }
    }
    if (parsedObject.center) {
      this.center = parsedObject.center as [number, number];
    }
    if (parsedObject.radius) {
      this.radius = parsedObject.radius as [number, number];
    }
  }
}

export default ImagePrimitive;
