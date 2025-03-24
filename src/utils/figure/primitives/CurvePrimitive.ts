import { CanvasStyles } from "../../../types/CanvasStyles";
import Primitive from "../../../types/Primitive";

class CurvePrimitive implements Primitive {
  points: Array<[number, number]>;
  styles?: Partial<CanvasStyles>;

  constructor(points: Array<[number, number]>, styles?: Partial<CanvasStyles>) {
    this.points = points;
    this.styles = styles;
  }

  draw(context: CanvasRenderingContext2D) {
    if (!this.points.length) {
      return;
    }
    if (this.styles) {
      //   this.applyStyles(context, curve.styles);
    }
    context.beginPath();
    context.moveTo(...this.points[0]);
    for (const point of this.points) {
      context.lineTo(...point);
    }
    context.stroke();
    context?.fill();
    // if (this.styles) {
    //   this.applyStyles(context, this.styles);
    // }
  }

  scale(scaleX: number, scaleY: number) {}

  translate(translateX: number, translateY: number) {}
}

export default CurvePrimitive;
