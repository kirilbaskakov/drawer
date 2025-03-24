interface Primitive {
  translate(dx: number, dy: number): void;
  scale(scaleX: number, scaleY: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export default Primitive;
