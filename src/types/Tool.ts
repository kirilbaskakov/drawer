import { CanvasStyles } from "./CanvasStyles";

interface Tool {
  cursor: string;

  handleMouseUp: (e: MouseEvent) => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseLeave?: (e: MouseEvent) => void;

  reset?: () => void;
  updateStyles?: (styles: Partial<CanvasStyles>) => void;
}

export default Tool;
