import { CanvasStyles } from "./CanvasStyles";
import Rect from "./Rect";

interface Primitive {
  translate(dx: number, dy: number): void;
  scale(scaleX: number, scaleY: number): void;
  draw(context: CanvasRenderingContext2D, defaultStyles: CanvasStyles): void;
  intersectsWith(rect: Rect): boolean;
  getBoundingRect(): Rect;

  toJSON(): string;
  fromJSON(jsonString: string): void;
}

export default Primitive;
