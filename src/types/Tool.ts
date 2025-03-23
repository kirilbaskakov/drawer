import { CanvasStyles } from "./CanvasStyles";

interface Tool {
  cursor: string;
  definableStyles: Array<keyof CanvasStyles>;

  handleMouseUp: (x: number, y: number, e: MouseEvent) => void;
  handleMouseDown: (x: number, y: number, e: MouseEvent) => void;
  handleMouseMove: (x: number, y: number, e: MouseEvent) => void;
  handleMouseLeave?: (x: number, y: number, e: MouseEvent) => void;

  reset?: () => void;
  updateStyles?: (styles: Partial<CanvasStyles>) => void;
}

export default Tool;
