import { CanvasStyles } from "./CanvasStyles";

interface Tool {
  cursor: string;
  definableStyles: Array<keyof CanvasStyles>;

  handleMouseUp: (x: number, y: number) => void;
  handleMouseDown: (x: number, y: number) => void;
  handleMouseMove: (x: number, y: number) => void;
  handleMouseLeave?: (x: number, y: number) => void;

  reset?: () => void;
  updateStyles?: (styles: Partial<CanvasStyles>) => void;
}

export default Tool;
