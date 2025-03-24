import {
  DEFAULT_BOUDING_RECT,
  DEFAULT_STYLES,
} from "../../constants/drawingDefaults";
import { CanvasStyles } from "../../types/CanvasStyles";
import Rect from "../../types/Rect";
import ScaleType from "../../types/ScaleType";
import createPolygonFromRect from "../geometry/createPolygonFromRect";
import isRectInside from "../geometry/isRectInside";
import rectIntersectPolygon from "../geometry/rectIntersectPolygon";
import updateBoundingRect from "../geometry/updateBoundingRect";

interface EllipsePrimitive {
  type: "ellipse";
  center: [number, number];
  radius: [number, number];
}

interface CurvePrimitive {
  type: "curve";
  points: Array<[number, number]>;
  styles?: Partial<CanvasStyles>;
}

interface ImagePrimitive {
  type: "image";
  x: number;
  y: number;
  image: HTMLImageElement | null;
  src: string;
  scale: [number, number];
  translate: [number, number];
}

interface TextPrimitive {
  type: "text";
  x: number;
  y: number;
  text: string;
  scale: [number, number];
  translate: [number, number];
}

type Primitive =
  | EllipsePrimitive
  | CurvePrimitive
  | ImagePrimitive
  | TextPrimitive;

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
      switch (primitive.type) {
        case "curve":
          for (const point of primitive.points) {
            point[0] += dx;
            point[1] += dy;
          }
          break;
        case "ellipse":
          primitive.center[0] += dx;
          primitive.center[1] += dy;
          break;
        case "image":
        case "text":
          primitive.translate[0] += dx;
          primitive.translate[1] += dy;
          break;
      }
    }
  }

  scale(scaleX: number, scaleY: number, scaleType: ScaleType = "nw-resize") {
    const prevBoundingRect = { ...this.boundingRect };
    this.boundingRect.x1 *= scaleX;
    this.boundingRect.x2 *= scaleX;
    this.boundingRect.y1 *= scaleY;
    this.boundingRect.y2 *= scaleY;
    for (const primitive of this.primitives) {
      switch (primitive.type) {
        case "curve":
          for (const point of primitive.points) {
            point[0] *= scaleX;
            point[1] *= scaleY;
          }
          break;
        case "ellipse":
          primitive.center[0] *= scaleX;
          primitive.center[1] *= scaleY;
          primitive.radius[0] *= scaleX;
          primitive.radius[1] *= scaleY;
          break;
        case "image":
        case "text":
          primitive.scale[0] *= scaleX;
          primitive.scale[1] *= scaleY;
          primitive.translate[0] *= scaleX;
          primitive.translate[1] *= scaleY;
          break;
      }
    }
    switch (scaleType) {
      case "nw-resize":
      case "w-resize":
      case "n-resize":
        this.translate(
          prevBoundingRect.x1 - this.boundingRect.x1,
          prevBoundingRect.y1 - this.boundingRect.y1,
        );
        break;
      case "se-resize":
      case "s-resize":
      case "e-resize":
        this.translate(
          prevBoundingRect.x2 - this.boundingRect.x2,
          prevBoundingRect.y2 - this.boundingRect.y2,
        );
        break;
      case "ne-resize":
        this.translate(
          prevBoundingRect.x1 - this.boundingRect.x1,
          prevBoundingRect.y2 - this.boundingRect.y2,
        );
        break;
      case "sw-resize":
        this.translate(
          prevBoundingRect.x2 - this.boundingRect.x2,
          prevBoundingRect.y1 - this.boundingRect.y1,
        );
        break;
    }
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

  beginCurve(styles?: Partial<CanvasStyles>) {
    this.primitives.push({
      type: "curve",
      points: [],
      styles,
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
    curve.points.push([...curve.points[0]]);
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
    this.primitives.push({
      type: "image",
      src: image.src,
      image: null,
      x,
      y,
      scale: [1, 1],
      translate: [0, 0],
    });
    updateBoundingRect(this.boundingRect, x, y);
    updateBoundingRect(this.boundingRect, x + image.width, y + image.height);
  }

  addText(text: string, x: number, y: number) {
    this.primitives.push({
      type: "text",
      x,
      y,
      text,
      scale: [1, 1],
      translate: [0, 0],
    });
    updateBoundingRect(this.boundingRect, x, y);
    updateBoundingRect(
      this.boundingRect,
      x + text.length * 6.2,
      y + parseInt(this.styles.fontSize) / 2 + 1,
    );
  }

  intersectWith(rect: Rect) {
    return this.primitives.some((primitive) => {
      switch (primitive.type) {
        case "curve":
          return rectIntersectPolygon(rect, primitive.points);
        case "ellipse":
          return rectIntersectPolygon(
            rect,
            createPolygonFromRect({
              x1: primitive.center[0] - primitive.radius[0],
              y1: primitive.center[1] - primitive.radius[1],
              x2: primitive.center[0] + primitive.radius[0],
              y2: primitive.center[0] + primitive.radius[0],
            }),
          );
        case "image": {
          const x = primitive.x * primitive.scale[0] + primitive.translate[0],
            y = primitive.y * primitive.scale[1] + primitive.translate[1];
          const w = (primitive.image?.width ?? 0) * primitive.scale[0],
            h = (primitive.image?.height ?? 0) * primitive.scale[1];
          return rectIntersectPolygon(
            rect,
            createPolygonFromRect({ x1: x, y1: y, x2: x + w, y2: y + h }),
          );
        }
      }
    });
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
    this.applyStyles(context, this.styles);
    for (const primitive of this.primitives) {
      switch (primitive.type) {
        case "curve":
          this.drawCurve(context, primitive);
          break;
        case "ellipse":
          this.drawEllipse(context, primitive);
          break;
        case "image":
          this.drawImage(context, primitive);
          break;
        case "text":
          this.drawText(context, primitive);
          break;
      }
    }
  }

  toJSON() {
    return JSON.stringify({
      primitives: this.primitives,
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
      figure.primitives = parsedObject.primitives as Primitive[];
      figure.boundingRect = parsedObject.boundingRect as Rect;
      figure.setStyles(parsedObject.styles);
      return figure;
    }
  }

  private applyStyles(
    context: CanvasRenderingContext2D,
    styles: Partial<CanvasStyles>,
  ) {
    if (styles.strokeStyle) context.strokeStyle = styles.strokeStyle;
    if (styles.lineWidth) context.lineWidth = styles.lineWidth;
    if (styles.lineDash) context.setLineDash(styles.lineDash);
    if (styles.fillStyle) context.fillStyle = styles.fillStyle;
    if (styles.fontSize && styles.fontFamily)
      context.font = styles.fontSize + " " + styles.fontFamily;
  }

  private drawEllipse(
    context: CanvasRenderingContext2D,
    ellipse: EllipsePrimitive,
  ) {
    context.beginPath();
    context.ellipse(...ellipse.center, ...ellipse.radius, 0, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  }

  private drawCurve(context: CanvasRenderingContext2D, curve: CurvePrimitive) {
    if (!curve.points.length) {
      return;
    }
    if (curve.styles) {
      this.applyStyles(context, curve.styles);
    }
    context.beginPath();
    context.moveTo(...curve.points[0]);
    for (const point of curve.points) {
      context.lineTo(...point);
    }
    context.stroke();
    context?.fill();
    if (curve.styles) {
      this.applyStyles(context, this.styles);
    }
  }

  private drawImage(context: CanvasRenderingContext2D, image: ImagePrimitive) {
    if (image.image?.src) {
      context.save();
      context.scale(image.scale[0], image.scale[1]);
      context.translate(
        image.translate[0] / image.scale[0],
        image.translate[1] / image.scale[1],
      );
      context.drawImage(image.image, image.x, image.y);
      context.restore();
    } else {
      image.image = new Image();
      image.image.onload = () => {
        context.save();
        context.scale(image.scale[0], image.scale[1]);
        context.translate(
          image.translate[0] / image.scale[0],
          image.translate[1] / image.scale[1],
        );
        context.drawImage(image.image!, image.x, image.y);
        context.restore();
      };
      image.image.src = image.src;
    }
  }

  private drawText(context: CanvasRenderingContext2D, text: TextPrimitive) {
    context.fillStyle = this.styles.strokeStyle;
    context.textBaseline = "top";
    context.save();
    context.scale(text.scale[0], text.scale[1]);
    context.translate(
      text.translate[0] / text.scale[0],
      text.translate[1] / text.scale[1],
    );
    const { width } = context.measureText(text.text);
    updateBoundingRect(
      this.boundingRect,
      text.x * text.scale[0] + text.translate[0] + width,
      this.boundingRect.y2,
    );
    context.fillText(text.text, text.x, text.y);
    context.restore();
    context.fillStyle = this.styles.fillStyle;
  }
}
export default Figure;
