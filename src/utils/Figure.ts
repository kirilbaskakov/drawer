import {
  DEFAULT_BOUDING_RECT,
  DEFAULT_STYLES,
} from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
import ScaleType from "../types/ScaleType";
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

interface ImagePrimitive {
  type: "image";
  x: number;
  y: number;
  image: HTMLImageElement | null;
  src: string;
  scale: [number, number];
  translate: [number, number];
}

type Primitive = EllipsePrimitive | CurvePrimitive | ImagePrimitive;

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
          primitive.scale[0] *= scaleX;
          primitive.scale[1] *= scaleY;
          primitive.translate[0] *= scaleX;
          primitive.translate[1] *= scaleY;
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
    curve.points.push([...curve.points[0]]);
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

  intersectWith(rect: Rect) {
    return doRectsIntersect(rect, this.boundingRect);
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
    this.applyStyles(context);
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
      }
    }
  }

  toJSON() {
    return JSON.stringify({
      primitives: this.primitives,
      boundingRect: this.boundingRect,
    });
  }

  static fromJSON(jsonString: string) {
    const parsedObject = JSON.parse(jsonString);
    if (parsedObject.primitives && parsedObject.boundingRect) {
      const figure = new Figure();
      figure.primitives = parsedObject.primitives as Primitive[];
      figure.boundingRect = parsedObject.boundingRect as Rect;
      return figure;
    }
  }

  private applyStyles(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.styles.strokeStyle;
    context.lineWidth = this.styles.lineWidth;
    context.setLineDash(this.styles.lineDash);
    context.fillStyle = this.styles.fillStyle;
  }

  private drawEllipse(
    context: CanvasRenderingContext2D,
    ellipse: EllipsePrimitive,
  ) {
    context.beginPath();
    context.ellipse(...ellipse.center, ...ellipse.radius, 0, 0, 2 * Math.PI);
    context.stroke();
    if (this.styles.fillStyle != "transparent") {
      context.fill();
    }
  }

  private drawCurve(context: CanvasRenderingContext2D, curve: CurvePrimitive) {
    if (!curve.points.length) {
      return;
    }
    context.beginPath();
    context.moveTo(...curve.points[0]);
    for (const point of curve.points) {
      context.lineTo(...point);
    }
    context.stroke();
    if (this.styles.fillStyle != "transparent") {
      context?.fill();
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
}
export default Figure;
