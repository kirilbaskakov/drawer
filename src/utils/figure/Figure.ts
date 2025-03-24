import {
  DEFAULT_BOUDING_RECT,
  DEFAULT_STYLES,
} from "../../constants/drawingDefaults";
import { CanvasStyles } from "../../types/CanvasStyles";
import Primitive from "../../types/Primitive";
import Rect from "../../types/Rect";
import applyStyles from "../canvasUtils/applyStyles";
import createPolygonFromRect from "../geometry/createPolygonFromRect";
import isRectInside from "../geometry/isRectInside";
import updateBoundingRect from "../geometry/updateBoundingRect";
import CurvePrimitive from "./primitives/CurvePrimitive";
import EllipsePrimitive from "./primitives/EllipsePrimitive";
import ImagePrimitive from "./primitives/ImagePrimitive";
import TextPrimitive from "./primitives/TextPrimitive";

type PrimitiveType = "curve" | "ellipse" | "image" | "text";

class Figure {
  id: number;
  isAdditional = false;
  boundingRect: Rect = { ...DEFAULT_BOUDING_RECT };
  styles: CanvasStyles = DEFAULT_STYLES;

  private primitives: Array<Primitive> = [];

  constructor(isAdditional = false) {
    this.isAdditional = isAdditional;
    this.id = +new Date();
  }

  translate(dx: number, dy: number) {
    this.boundingRect.x1 += dx;
    this.boundingRect.x2 += dx;
    this.boundingRect.y1 += dy;
    this.boundingRect.y2 += dy;
    for (const primitive of this.primitives) {
      primitive.translate(dx, dy);
    }
  }

  scale(scaleX: number, scaleY: number, basePoint: [number, number]) {
    const newX = basePoint[0] + (this.boundingRect.x1 - basePoint[0]) * scaleX;
    const newY = basePoint[1] + (this.boundingRect.y1 - basePoint[1]) * scaleY;
    this.boundingRect.x1 *= scaleX;
    this.boundingRect.x2 *= scaleX;
    this.boundingRect.y1 *= scaleY;
    this.boundingRect.y2 *= scaleY;
    for (const primitive of this.primitives) {
      primitive.scale(scaleX, scaleY);
    }
    this.translate(newX - this.boundingRect.x1, newY - this.boundingRect.y1);
  }

  addEllipse(rect: Rect) {
    this.primitives.push(new EllipsePrimitive(rect));
    updateBoundingRect(this.boundingRect, rect.x1, rect.y1);
    updateBoundingRect(this.boundingRect, rect.x2, rect.y2);
  }

  beginCurve(styles?: Partial<CanvasStyles>) {
    this.primitives.push(new CurvePrimitive([], styles));
  }

  addPoint(x: number, y: number) {
    const curve = this.primitives[this.primitives.length - 1];
    if (curve instanceof CurvePrimitive) {
      curve.points.push([x, y]);
      updateBoundingRect(this.boundingRect, x, y);
    }
  }

  closeCurve() {
    const curve = this.primitives[this.primitives.length - 1];
    if (curve instanceof CurvePrimitive) {
      curve.points.push([...curve.points[0]]);
    }
  }

  addRect(rect: Rect, styles?: Partial<CanvasStyles>) {
    this.addPolygon(createPolygonFromRect(rect), styles);
  }

  addPolygon(points: Array<[number, number]>, styles?: Partial<CanvasStyles>) {
    this.beginCurve(styles);
    for (const point of points) {
      this.addPoint(...point);
    }
    this.closeCurve();
  }

  addImage(image: HTMLImageElement, x: number, y: number) {
    this.primitives.push(new ImagePrimitive(x, y, image));
    updateBoundingRect(this.boundingRect, x, y);
    updateBoundingRect(this.boundingRect, x + image.width, y + image.height);
  }

  addText(text: string, x: number, y: number) {
    const primitive = new TextPrimitive(
      x,
      y,
      text,
      this.styles.fontSize + " " + this.styles.fontFamily,
    );
    this.primitives.push(primitive);
    const boundingRect = primitive.getBoundingRect();
    updateBoundingRect(this.boundingRect, boundingRect.x1, boundingRect.y1);
    updateBoundingRect(this.boundingRect, boundingRect.x2, boundingRect.y2);
  }

  intersectWith(rect: Rect) {
    return this.primitives.some((primitive) => primitive.intersectsWith(rect));
  }

  containsIn(rect: Rect) {
    return isRectInside(rect, this.boundingRect);
  }

  setStyles(styles: Partial<CanvasStyles>) {
    this.styles = { ...this.styles, ...styles };
  }

  clear() {
    this.boundingRect = { ...DEFAULT_BOUDING_RECT };
    this.primitives = [];
  }

  paint(context: CanvasRenderingContext2D) {
    applyStyles(context, this.styles);
    for (const primitive of this.primitives) {
      primitive.draw(context, this.styles);
    }
  }

  toJSON() {
    const primitivesJSON = this.primitives.map((primitive) => ({
      type: this.getPrimitiveType(primitive),
      json: JSON.stringify(primitive),
    }));

    return JSON.stringify({
      primitives: primitivesJSON,
      boundingRect: this.boundingRect,
      styles: this.styles,
    });
  }

  static fromJSON(jsonString: string) {
    const parsedObject = JSON.parse(jsonString);
    if (
      parsedObject.primitives &&
      parsedObject.boundingRect &&
      parsedObject.styles
    ) {
      const figure = new Figure();
      console.log(parsedObject);
      figure.primitives = parsedObject.primitives.map(
        ({ type, json }: { type: PrimitiveType; json: string }) => {
          switch (type) {
            case "curve":
              return CurvePrimitive.fromJSON(json);
            case "ellipse":
              return EllipsePrimitive.fromJSON(json);
            case "image":
              return ImagePrimitive.fromJSON(json);
            case "text":
              return TextPrimitive.fromJSON(json);
          }
        },
      );
      figure.boundingRect = parsedObject.boundingRect as Rect;
      figure.setStyles(parsedObject.styles);
      return figure;
    }
  }

  private getPrimitiveType(primitive: Primitive): PrimitiveType {
    if (primitive instanceof CurvePrimitive) {
      return "curve";
    }
    if (primitive instanceof EllipsePrimitive) {
      return "ellipse";
    }
    if (primitive instanceof ImagePrimitive) {
      return "image";
    }
    if (primitive instanceof TextPrimitive) {
      return "text";
    }
    return "curve";
  }
}
export default Figure;
